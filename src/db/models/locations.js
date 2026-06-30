import {  Schema, model  } from 'mongoose';
import {  DateTime  } from 'luxon';

const locationSchema = new Schema({
  date: {
    type: Date,
    trim: true,
    require: true,
    default: () => DateTime.now().setZone("America/La_Paz").toISO(), 
  },
  latitude: {
    type: Number,
    trim: true,
    require: true,
  },
  longitude: {
    type: Number,
    trim: true,
    require: true,
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
    locations:[locationSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Location = model("Location", EmployeesLocationSchema, "locations");
export default Location;
