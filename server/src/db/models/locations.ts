import { Schema, model } from 'mongoose';
import { ILocation } from '@/types/models.js';

const locationSchema = new Schema({
  date: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  street: {
    type: String,
    trim: true,
    require: true
  },
  geofenceResult: {
    branchId: { type: Schema.Types.ObjectId, ref: "Branch" },
    branchName: { type: String },
    distance: { type: Number },
    inside: { type: Boolean },
    overriddenBy: { type: Schema.Types.ObjectId, ref: "User" },
    overrideReason: { type: String },
  },
})

const EmployeesLocationSchema = new Schema(
  {
    employee:{
      type:Schema.Types.ObjectId,
      ref:"Employee",
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    locations:[locationSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Location = model<ILocation>("Location", EmployeesLocationSchema, "locations");
export default Location;
