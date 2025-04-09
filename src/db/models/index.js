const Employee = require("./employee");
const JobTitle = require("./jobTitle");
const ControlTime = require("./timeControl");
const Location = require("./locations");
const ManagerModel = require("./manager");

const model = {
  Employee,
  JobTitle,
  ControlTime,
  Location,
  ManagerModel,
};

module.exports = model;
