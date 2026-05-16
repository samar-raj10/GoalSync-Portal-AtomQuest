const mongoose = require('mongoose');

const checkInSchema = new mongoose.Schema({
  goal: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', required: true },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quarter: { type: String, enum: ['Q1', 'Q2', 'Q3', 'Q4'], required: true },
  comment: { type: String, required: true },
  sentiment: { type: String, enum: ['Good', 'Needs Attention', 'At Risk'], default: 'Good' }
}, { timestamps: true });

module.exports = mongoose.model('CheckIn', checkInSchema);
