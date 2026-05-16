const mongoose = require('mongoose');

const cycleSchema = new mongoose.Schema({
  name: { type: String, enum: ['Goal Setting', 'Q1', 'Q2', 'Q3', 'Q4'], unique: true, required: true },
  windowLabel: { type: String, required: true },
  active: { type: Boolean, default: false },
  adminOverride: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Cycle', cycleSchema);
