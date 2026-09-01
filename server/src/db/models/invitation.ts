import { Schema, model } from 'mongoose';

const invitationSchema = new Schema(
  {
    code: { type: String, required: true, trim: true, uppercase: true },
    company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['employee', 'hr_manager', 'supervisor', 'admin'], default: 'employee' },
    maxUses: { type: Number, default: 1 },
    usedCount: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    invitedName: { type: String, trim: true },
    invitedEmail: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    jobTitle: { type: String, trim: true },
    targetEmail: { type: String, trim: true, lowercase: true },
    targetPhone: { type: String, trim: true },
    department: { type: Schema.Types.ObjectId, ref: 'Department' },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    branch: { type: String, trim: true }, // fallback string label if Branch collection not used
    shiftLabel: { type: String, trim: true },
    shiftId: { type: String, trim: true },
    usedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    usedAt: { type: Date },
    requestedNewAt: { type: Date },
  },
  { timestamps: true, versionKey: false }
);

  invitationSchema.index({ code: 1 }, { unique: true });
  invitationSchema.index({ company: 1, isActive: 1 });
  // ponytail: TTL removed — expiry handled via query (isActive + expiresAt check) + cron if needed, keeps audit trail for request-new

const Invitation = model('Invitation', invitationSchema, 'invitations');
export default Invitation;
