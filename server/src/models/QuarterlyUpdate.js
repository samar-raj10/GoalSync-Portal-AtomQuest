const mongoose = require('mongoose');

const quarterlyUpdateSchema = new mongoose.Schema({
  goal: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', required: true },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quarter: { type: String, enum: ['Q1', 'Q2', 'Q3', 'Q4'], required: true },
  actualAchievement: { type: String, required: true },
  progressStatus: { type: String, enum: ['Not Started', 'On Track', 'Completed'], required: true },
  progressScore: { type: Number, default: 0 }
}, { timestamps: true });

quarterlyUpdateSchema.index({ goal: 1, quarter: 1 }, { unique: true });
module.exports = mongoose.model('QuarterlyUpdate', quarterlyUpdateSchema);
