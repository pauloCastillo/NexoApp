const { ControlTime } = require("../db/models");

async function generate() {
  const allTimeControlRegisters = await ControlTime.find();
}
