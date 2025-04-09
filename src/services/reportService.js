const { createReport } = require("../report");
const { ControlTime } = require("../db/models");

class Report {
  async createReport() {
    const registers = await ControlTime.find().populate("locations", "street").populate("employee", "username");
    createReport(registers);
  }
}

module.exports = {
  Report,
};
