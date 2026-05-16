const express = require('express');
const QuarterlyUpdate = require('../models/QuarterlyUpdate');
const Goal = require('../models/Goal');
const { auth } = require('../middleware/auth');
const { toCsv } = require('../utils/csv');

const router = express.Router();
router.use(auth);

async function reportRows(user) {
  const goals = await Goal.find(user.role === 'employee' ? { employee: user._id } : user.role === 'manager' ? { manager: user._id } : {}).populate('employee');
  const updates = await QuarterlyUpdate.find({ goal: { $in: goals.map(g => g._id) } });
  const rows = [];
  for (const goal of goals) {
    const goalUpdates = updates.filter(update => String(update.goal) === String(goal._id));
    if (!goalUpdates.length) rows.push({ employeeName: goal.employee.name, goalTitle: goal.title, target: goal.target, actualAchievement: '', weightage: goal.weightage, status: goal.status, quarter: '', progressPercent: '' });
    goalUpdates.forEach(update => rows.push({ employeeName: goal.employee.name, goalTitle: goal.title, target: goal.target, actualAchievement: update.actualAchievement, weightage: goal.weightage, status: update.progressStatus, quarter: update.quarter, progressPercent: update.progressScore }));
  }
  return rows;
}

router.get('/', async (req, res) => res.json(await reportRows(req.user)));
router.get('/csv', async (req, res) => {
  res.header('Content-Type', 'text/csv');
  res.attachment('goalsync-report.csv');
  res.send(toCsv(await reportRows(req.user)));
});
router.get('/excel', async (req, res) => res.json({ message: 'Frontend exports Excel using the same report data and SheetJS.' }));

module.exports = router;
