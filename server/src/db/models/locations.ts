import { Schema, model } from 'mongoose';
import { ILocation } from '@/types/models.js';

const locationSchema = new Schema({
  date: {
    type: Date,
    trim: true,
    required: true,
    default: () => new Date(),
  },
  latitude: {
    type: Number,
    trim: true,
    required: true,
  },
  longitude: {
    type: Number,
    trim: true,
    required: true,
  },
  street: {
    type: String,
    trim: true,
    require: true
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
