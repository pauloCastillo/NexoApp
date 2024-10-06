const { httpStatusCode } = require("../utils/httpStatus");
const { Manager } = require("../db/services/userServices");
async function createManagers(req, res) {
  try {
    const { body } = req;
    const manager = new Manager(body);
    const response = await manager.createEmployee();
    res.status(httpStatusCode.CREATED).send(response);
  } catch (error) {
    res.status(httpStatusCode.INTERNAL_SERVER).send(error.message);
  }
}

module.exports = {
  createManagers,
};
