import {  Schema, model  } from 'mongoose';

const jobSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      trim: true,
      require: true,
    },
    job_title: {
      type: String,
      trim: true,
      require: true,
    },
    department: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const JobTitle = model("JobTitle", jobSchema, "jobTitles");
export default JobTitle;
