import { Schema, model } from 'mongoose';

const companySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    geofenceRadius: {
      type: Number,
      default: 200,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Company = model("Company", companySchema, "companies");
export default Company;
