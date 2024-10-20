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

locationSchema.pre("save", (next) => {
  const currentDate = new Date();
  this.date = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  ).toLocaleString("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  next();
});

const Location = model("Location", locationSchema, "locations");
module.exports = Location;
