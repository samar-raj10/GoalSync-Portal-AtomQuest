const express = require('express');
const Goal = require('../models/Goal');
const Cycle = require('../models/Cycle');
const QuarterlyUpdate = require('../models/QuarterlyUpdate');
const CheckIn = require('../models/CheckIn');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');
const { auth, permit } = require('../middleware/auth');
const { calculateProgressScore } = require('../utils/scoring');

const router = express.Router();
router.use(auth);

async function ensureQuarterOpen(quarter) {
  const cycle = await Cycle.findOne({ name: quarter });
  return Boolean(cycle?.active || cycle?.adminOverride);
}

router.get('/', async (req, res) => {
  const filter = req.user.role === 'employee' ? { employee: req.user._id } : {};
  res.json(await QuarterlyUpdate.find(filter).populate({ path: 'goal', populate: 'employee manager' }).sort({ updatedAt: -1 }));
});

router.post('/', permit('employee'), async (req, res) => {
  const { goalId, quarter, actualAchievement, progressStatus } = req.body;
  if (!(await ensureQuarterOpen(quarter))) return res.status(400).json({ message: `${quarter} check-in window is closed` });
  const goal = await Goal.findOne({ _id: goalId, employee: req.user._id, locked: true });
  if (!goal) return res.status(404).json({ message: 'Locked approved goal not found' });
  const progressScore = calculateProgressScore({ scoreType: goal.scoreType, uom: goal.uom, target: goal.target, actualAchievement });
  const update = await QuarterlyUpdate.findOneAndUpdate(
    { goal: goal._id, quarter },
    { employee: req.user._id, actualAchievement, progressStatus, progressScore },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  if (goal.sharedGoal && goal.isSharedPrimary) {
    const linkedGoals = await Goal.find({ sharedGoal: goal.sharedGoal, _id: { $ne: goal._id } });
    await Promise.all(linkedGoals.map(linked => QuarterlyUpdate.findOneAndUpdate(
      { goal: linked._id, quarter },
      { employee: linked.employee, actualAchievement, progressStatus, progressScore },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )));
  }
  res.json(update);
});

router.post('/:goalId/checkins', permit('manager'), async (req, res) => {
  const goal = await Goal.findOne({ _id: req.params.goalId, manager: req.user._id });
  if (!goal) return res.status(404).json({ message: 'Goal not found' });
  const checkIn = await CheckIn.create({ goal: goal._id, employee: goal.employee, manager: req.user._id, quarter: req.body.quarter, comment: req.body.comment, sentiment: req.body.sentiment });
  await Notification.create({ user: goal.employee, message: `Manager added ${req.body.quarter} check-in comments for ${goal.title}`, type: 'info' });
  if (goal.locked) await AuditLog.create({ actor: req.user._id, entity: 'CheckIn', entityId: checkIn._id, field: 'comment', oldValue: '', newValue: req.body.comment });
  res.status(201).json(checkIn);
});

router.get('/checkins/all', async (req, res) => {
  const filter = req.user.role === 'employee' ? { employee: req.user._id } : req.user.role === 'manager' ? { manager: req.user._id } : {};
  res.json(await CheckIn.find(filter).populate('goal employee manager').sort({ createdAt: -1 }));
});

module.exports = router;
