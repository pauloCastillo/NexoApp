import {  httpStatusCode  } from '../utils/httpStatus.js';
import ServiceFactory from '../factories/serviceFactory.js';

async function getAllClients(req, res) {
  try {
    const clientService = ServiceFactory.getService("client");
    const clients = await clientService.getAll();
    res.status(httpStatusCode.OK).json({ clients });
  } catch (error) {
    res.status(httpStatusCode.INTERNAL_SERVER).json({
      message: error.message,
    });
  }
}

async function createClient(req, res) {
  try {
    const clientData = { ...req.body, createdBy: req.employeeId };
    const clientService = ServiceFactory.getService("client", clientData);
    const client = await clientService.create();
    res.status(httpStatusCode.CREATED).json({ client });
  } catch (error) {
    res.status(httpStatusCode.INTERNAL_SERVER).json({
      message: error.message,
    });
  }
}

export { getAllClients, createClient,  };
