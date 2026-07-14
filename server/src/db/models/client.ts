import { Schema, model } from 'mongoose';
import { IClient } from '@/types/models.js';

const clientSchema = new Schema(
  {
    companyName: {
      type: String,
      trim: true,
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    contactName: {
      type: String,
      trim: true,
      required: true,
    },
    contactLastName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Client = model<IClient>("Client", clientSchema, "clients");
export default Client;
