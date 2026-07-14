import { Schema, model } from 'mongoose';
import { IAuditLog } from '@/types/models.js';

const auditLogSchema = new Schema(
  {
    action: {
      type: String,
      required: true,
      trim: true,
    },
    entityType: {
      type: String,
      required: true,
      trim: true,
    },
    entityId: {
      type: String,
    },
    userId: {
      type: String,
    },
    companyId: {
      type: String,
    },
    previousValue: {
      type: Schema.Types.Mixed,
    },
    newValue: {
      type: Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

auditLogSchema.index({ companyId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ entityType: 1, entityId: 1 });

const AuditLog = model<IAuditLog>("AuditLog", auditLogSchema, "auditLogs");
export default AuditLog;