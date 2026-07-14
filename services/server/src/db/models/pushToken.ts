import { Schema, model } from 'mongoose';

const pushTokenSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      enum: ['ios', 'android'],
      required: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

pushTokenSchema.index({ userId: 1 }, { unique: true });
pushTokenSchema.index({ companyId: 1 });

const PushToken = model('PushToken', pushTokenSchema, 'pushTokens');
export default PushToken;
