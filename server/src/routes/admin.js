const express = require('express');
const Cycle = require('../models/Cycle');
const AuditLog = require('../models/AuditLog');
const Escalation = require('../models/Escalation');
const Goal = require('../models/Goal');
const User = require('../models/User');
const QuarterlyUpdate = require('../models/QuarterlyUpdate');
const { auth, permit } = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/cycles', async (req, res) => res.json(await Cycle.find().sort({ name: 1 })));
router.patch('/cycles/:id', permit('admin'), async (req, res) => res.json(await Cycle.findByIdAndUpdate(req.params.id, req.body, { new: true })));
router.get('/audit-logs', permit('admin'), async (req, res) => res.json(await AuditLog.find().populate('actor').sort({ createdAt: -1 }).limit(100)));
router.get('/escalations', async (req, res) => {
  const filter = req.user.role === 'employee' ? { employee: req.user._id } : req.user.role === 'manager' ? { manager: req.user._id } : {};
  res.json(await Escalation.find(filter).populate('employee manager').sort({ createdAt: -1 }));
});

router.post('/escalations/generate', permit('admin'), async (req, res) => {
  await Escalation.deleteMany({ resolved: false });
  const employees = await User.find({ role: 'employee' });
  const created = [];
  for (const employee of employees) {
    const goals = await Goal.find({ employee: employee._id });
    if (!goals.length || goals.every(g => g.status === 'draft')) created.push(await Escalation.create({ employee: employee._id, manager: employee.manager, reason: 'Goal not submitted', level: 'Employee' }));
    if (goals.some(g => g.status === 'submitted')) created.push(await Escalation.create({ employee: employee._id, manager: employee.manager, reason: 'Goal not approved', level: 'Manager' }));
    const approved = goals.filter(g => g.locked);
    for (const goal of approved) {
      const q1 = await QuarterlyUpdate.findOne({ goal: goal._id, quarter: 'Q1' });
      if (!q1) { created.push(await Escalation.create({ employee: employee._id, manager: employee.manager, reason: 'Quarterly check-in pending', level: 'Employee' })); break; }
    }
  }
  res.json(created);
});

module.exports = router;
