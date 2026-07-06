import { Schema, model } from 'mongoose';
import { IJobTitle } from '@/types/models.js';

const jobSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      trim: true,
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    job_title: {
      type: String,
      trim: true,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const JobTitle = model<IJobTitle>("JobTitle", jobSchema, "jobTitles");
export default JobTitle;
