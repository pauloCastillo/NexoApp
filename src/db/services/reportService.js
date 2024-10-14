const createReport = require("../../report");
const { ControlTime } = require("../models");

class Report {
  async createReport() {
    const employees = await ControlTime.find().populate("employee", "username");
    const locations = await ControlTime.find().populate("locations", "street");
   return  createReport({ employees, locations });
  }
}

module.exports = {
  Report,
};
