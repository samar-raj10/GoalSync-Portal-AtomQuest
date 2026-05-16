const mongoose = require('mongoose');

const escalationSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reason: { type: String, required: true },
  level: { type: String, enum: ['Employee', 'Manager', 'Admin'], default: 'Employee' },
  resolved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Escalation', escalationSchema);
