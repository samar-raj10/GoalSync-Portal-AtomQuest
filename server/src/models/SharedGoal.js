const mongoose = require('mongoose');

const sharedGoalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  thrustArea: { type: String, required: true },
  uom: { type: String, enum: ['numeric', 'percentage', 'timeline', 'zero'], required: true },
  scoreType: { type: String, enum: ['min', 'max', 'timeline', 'zero'], default: 'min' },
  target: { type: String, required: true },
  primaryOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedEmployees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('SharedGoal', sharedGoalSchema);
