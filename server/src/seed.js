require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Goal = require('./models/Goal');
const SharedGoal = require('./models/SharedGoal');
const QuarterlyUpdate = require('./models/QuarterlyUpdate');
const CheckIn = require('./models/CheckIn');
const Notification = require('./models/Notification');
const AuditLog = require('./models/AuditLog');
const Escalation = require('./models/Escalation');
const Cycle = require('./models/Cycle');
const { calculateProgressScore } = require('./utils/scoring');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/goalsync_portal');
  await Promise.all([User.deleteMany(), Goal.deleteMany(), SharedGoal.deleteMany(), QuarterlyUpdate.deleteMany(), CheckIn.deleteMany(), Notification.deleteMany(), AuditLog.deleteMany(), Escalation.deleteMany(), Cycle.deleteMany()]);
  const passwordHash = await bcrypt.hash('demo123', 10);
  const manager = await User.create({ name: 'Maya Manager', email: 'manager@demo.com', passwordHash, role: 'manager', department: 'Customer Success' });
  const employee = await User.create({ name: 'Evan Employee', email: 'employee@demo.com', passwordHash, role: 'employee', department: 'Customer Success', manager: manager._id });
  const admin = await User.create({ name: 'Avery Admin', email: 'admin@demo.com', passwordHash, role: 'admin', department: 'People Ops' });
  const teammate = await User.create({ name: 'Priya Peer', email: 'peer@demo.com', passwordHash, role: 'employee', department: 'Customer Success', manager: manager._id });
  const goals = await Goal.insertMany([
    { employee: employee._id, manager: manager._id, thrustArea: 'Revenue Retention', title: 'Improve renewal conversion', description: 'Drive better renewal discipline across assigned accounts.', uom: 'percentage', scoreType: 'min', target: '92', weightage: 40, status: 'approved', locked: true, managerComment: 'Approved with clear measurable target.' },
    { employee: employee._id, manager: manager._id, thrustArea: 'Customer Experience', title: 'Reduce average first response time', description: 'Lower response time for priority support requests.', uom: 'numeric', scoreType: 'max', target: '4', weightage: 30, status: 'approved', locked: true },
    { employee: employee._id, manager: manager._id, thrustArea: 'Operational Excellence', title: 'Launch account health playbook', description: 'Publish and train the team on the new playbook.', uom: 'timeline', scoreType: 'timeline', target: '2026-07-31', weightage: 30, status: 'approved', locked: true }
  ]);
  const shared = await SharedGoal.create({ title: 'Department NPS improvement', description: 'Lift department NPS through service recovery actions.', thrustArea: 'Department KPI', uom: 'numeric', scoreType: 'min', target: '70', primaryOwner: employee._id, assignedEmployees: [employee._id, teammate._id], createdBy: manager._id });
  await Goal.insertMany([
    { employee: teammate._id, manager: manager._id, thrustArea: shared.thrustArea, title: shared.title, description: shared.description, uom: shared.uom, scoreType: shared.scoreType, target: shared.target, weightage: 20, status: 'submitted', locked: false, sharedGoal: shared._id }
  ]);
  for (const goal of goals) {
    const actualAchievement = goal.scoreType === 'timeline' ? '2026-07-20' : goal.scoreType === 'max' ? '3.5' : '88';
    await QuarterlyUpdate.create({ goal: goal._id, employee: employee._id, quarter: 'Q1', actualAchievement, progressStatus: 'On Track', progressScore: calculateProgressScore({ scoreType: goal.scoreType, uom: goal.uom, target: goal.target, actualAchievement }) });
  }
  await CheckIn.create({ goal: goals[0]._id, employee: employee._id, manager: manager._id, quarter: 'Q1', comment: 'Good renewal hygiene. Keep focus on at-risk accounts.', sentiment: 'Good' });
  await Notification.insertMany([
    { user: employee._id, message: 'Q1 check-in window is active. Please update achievements.', type: 'reminder' },
    { user: manager._id, message: 'Priya Peer has goals pending approval.', type: 'approval' },
    { user: admin._id, message: 'Completion dashboard is ready for review.', type: 'info' }
  ]);
  await Escalation.create({ employee: teammate._id, manager: manager._id, reason: 'Goal not approved', level: 'Manager' });
  await Cycle.insertMany([
    { name: 'Goal Setting', windowLabel: 'Starts May 1', active: true },
    { name: 'Q1', windowLabel: 'July', active: true },
    { name: 'Q2', windowLabel: 'October', active: false },
    { name: 'Q3', windowLabel: 'January', active: false },
    { name: 'Q4', windowLabel: 'March/April', active: false }
  ]);
  console.log('Seed complete. Demo login: employee@demo.com / manager@demo.com / admin@demo.com with password demo123');
  await mongoose.disconnect();
}
seed().catch(error => { console.error(error); process.exit(1); });
