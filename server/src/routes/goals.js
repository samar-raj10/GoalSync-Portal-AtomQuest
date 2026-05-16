const express = require('express');
const Goal = require('../models/Goal');
const SharedGoal = require('../models/SharedGoal');
const User = require('../models/User');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const { auth, permit } = require('../middleware/auth');
const { validateGoalSheet } = require('../utils/goalValidation');

const router = express.Router();
router.use(auth);

function scopedGoals(user) {
  if (user.role === 'admin') return Goal.find().populate('employee manager sharedGoal');
  if (user.role === 'manager') return Goal.find({ manager: user._id }).populate('employee manager sharedGoal');
  return Goal.find({ employee: user._id }).populate('employee manager sharedGoal');
}

router.get('/', async (req, res) => {
  const goals = await scopedGoals(req.user).sort({ updatedAt: -1 });
  res.json(goals);
});

router.post('/draft', permit('employee'), async (req, res) => {
  const current = await Goal.find({ employee: req.user._id, locked: false });
  if (current.length >= 8) return res.status(400).json({ message: 'Maximum number of goals per employee is 8' });
  const goal = await Goal.create({ ...req.body, employee: req.user._id, manager: req.user.manager, status: 'draft', locked: false });
  res.status(201).json(goal);
});

router.put('/:id', async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) return res.status(404).json({ message: 'Goal not found' });
  const isOwnerDraft = req.user.role === 'employee' && goal.employee.equals(req.user._id) && !goal.locked && goal.status !== 'submitted';
  const isManagerEdit = req.user.role === 'manager' && goal.manager.equals(req.user._id) && goal.status === 'submitted';
  if (!isOwnerDraft && !isManagerEdit) return res.status(403).json({ message: 'Goal cannot be edited in its current state' });
  if (goal.sharedGoal && (req.body.title || req.body.target)) return res.status(400).json({ message: 'Shared goal title and target are read-only for recipients' });
  if (req.body.weightage !== undefined && Number(req.body.weightage) < 10) return res.status(400).json({ message: 'Each goal must have at least 10% weightage' });
  const allowed = isManagerEdit ? ['target', 'weightage', 'managerComment'] : ['thrustArea', 'title', 'description', 'uom', 'scoreType', 'target', 'weightage'];
  allowed.forEach(field => { if (req.body[field] !== undefined) goal[field] = req.body[field]; });
  await goal.save();
  res.json(goal);
});

router.post('/submit', permit('employee'), async (req, res) => {
  const goals = await Goal.find({ employee: req.user._id, status: { $in: ['draft', 'rejected'] } });
  const errors = validateGoalSheet(goals);
  if (errors.length) return res.status(400).json({ message: errors[0], errors });
  await Goal.updateMany({ _id: { $in: goals.map(g => g._id) } }, { status: 'submitted' });
  await Notification.create({ user: req.user.manager, message: `${req.user.name} submitted goals for approval`, type: 'approval' });
  res.json({ message: 'Goal sheet submitted to manager' });
});

router.post('/:id/approve', permit('manager'), async (req, res) => {
  const goal = await Goal.findOne({ _id: req.params.id, manager: req.user._id });
  if (!goal) return res.status(404).json({ message: 'Goal not found' });
  const sheetGoals = await Goal.find({ employee: goal.employee, status: { $in: ['submitted', 'approved'] } });
  const total = sheetGoals.reduce((sum, item) => sum + Number(item.weightage || 0), 0);
  if (total !== 100) return res.status(400).json({ message: 'Total weightage must equal 100% before approval' });
  goal.status = 'approved'; goal.locked = true; goal.managerComment = req.body.comment || goal.managerComment;
  await goal.save();
  await Notification.create({ user: goal.employee, message: `Goal approved: ${goal.title}`, type: 'success' });
  res.json(goal);
});

router.post('/:id/reject', permit('manager'), async (req, res) => {
  const goal = await Goal.findOne({ _id: req.params.id, manager: req.user._id });
  if (!goal) return res.status(404).json({ message: 'Goal not found' });
  goal.status = 'rejected'; goal.locked = false; goal.managerComment = req.body.comment || 'Please rework this goal';
  await goal.save();
  await Notification.create({ user: goal.employee, message: `Goal rejected for rework: ${goal.title}`, type: 'warning' });
  res.json(goal);
});

router.post('/:id/unlock', permit('admin'), async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) return res.status(404).json({ message: 'Goal not found' });
  const oldValue = String(goal.locked);
  goal.locked = false; goal.status = 'draft';
  await goal.save();
  await AuditLog.create({ actor: req.user._id, entity: 'Goal', entityId: goal._id, field: 'locked', oldValue, newValue: 'false' });
  res.json(goal);
});

router.post('/shared', permit('manager', 'admin'), async (req, res) => {
  const employees = await User.find({ _id: { $in: req.body.assignedEmployees || [] }, role: 'employee' });
  const primaryOwner = req.body.primaryOwner || employees[0]?._id;
  if (!primaryOwner || !employees.length) return res.status(400).json({ message: 'Assign at least one employee' });
  const shared = await SharedGoal.create({ ...req.body, primaryOwner, createdBy: req.user._id, assignedEmployees: employees.map(e => e._id) });
  const goals = await Goal.insertMany(employees.map(employee => ({
    employee: employee._id, manager: employee.manager || req.user._id, thrustArea: shared.thrustArea,
    title: shared.title, description: shared.description, uom: shared.uom, scoreType: shared.scoreType,
    target: shared.target, weightage: req.body.weightage || 10, sharedGoal: shared._id,
    isSharedPrimary: String(employee._id) === String(primaryOwner)
  })));
  res.status(201).json({ shared, goals });
});

module.exports = router;
