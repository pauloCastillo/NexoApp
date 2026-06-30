import {  Schema, model  } from 'mongoose';

const clientSchema = new Schema(
  {
    companyName: {
      type: String,
      trim: true,
      require: true,
    },
    contactName: {
      type: String,
      trim: true,
      require: true,
    },
    contactLastName: {
      type: String,
      trim: true,
      require: true,
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

const Client = model("Client", clientSchema, "clients");
export default Client;
