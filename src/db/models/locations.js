const { Schema, model } = require("mongoose");

const locationSchema = new Schema(
  {
    employee:{
      type:Schema.Types.ObjectId,
      ref:"Employee",
    },
    date: {
      type: Date,
      trim: true,
      require: true,
      default: () => new Date().toLocaleString("es-BO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour24: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",  
      }), 
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Location = model("Location", locationSchema, "locations");
module.exports = Location;
