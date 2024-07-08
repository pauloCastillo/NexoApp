const { ControlTime } = require("../db/models");

async function generateReport() {
  const allTimeControlRegisters = await ControlTime.find();
  console.log(allTimeControlRegisters);
}

module.exports = generateReport;
