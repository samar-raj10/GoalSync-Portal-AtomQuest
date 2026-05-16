const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  thrustArea: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  uom: { type: String, enum: ['numeric', 'percentage', 'timeline', 'zero'], required: true },
  scoreType: { type: String, enum: ['min', 'max', 'timeline', 'zero'], default: 'min' },
  target: { type: String, required: true },
  weightage: { type: Number, required: true, min: 10, max: 100 },
  status: { type: String, enum: ['draft', 'submitted', 'approved', 'rejected'], default: 'draft' },
  locked: { type: Boolean, default: false },
  managerComment: String,
  sharedGoal: { type: mongoose.Schema.Types.ObjectId, ref: 'SharedGoal' },
  isSharedPrimary: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);
