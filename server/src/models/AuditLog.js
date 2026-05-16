const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  entity: { type: String, required: true },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
  field: { type: String, required: true },
  oldValue: String,
  newValue: String
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
