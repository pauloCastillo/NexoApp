const { httpStatusCode } = require("../utils/httpStatus");
const { JobTitle } = require("../db/models");

async function createJobTitle(req, res) {
  try {
    const { job } = req.body;
    const newjobTitle = await JobTitle.create({
      job_title: job.name,
      department: job.department,
    });
    res.status(httpStatusCode.CREATED).send(newjobTitle);
  } catch (error) {
    res.status(httpStatusCode.INTERNAL_SERVER).send(error.message);
  }
}

module.exports = {
  createJobTitle,
};
