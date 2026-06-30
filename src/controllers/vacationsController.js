import {  httpStatusCode  } from '../utils/httpStatus.js';
import ServiceFactory from '../factories/serviceFactory.js';

async function getVacationsByEmployee(req, res) {
  try {
    const { employee_id } = req.params;
    const vacationService = ServiceFactory.getService("vacation");
    const vacations = await vacationService.getByEmployee(employee_id);
    res.status(httpStatusCode.OK).json({ vacations });
  } catch (error) {
    res.status(httpStatusCode.INTERNAL_SERVER).json({
      message: error.message,
    });
  }
}

async function createVacation(req, res) {
  try {
    const vacationService = ServiceFactory.getService("vacation", req.body);
    const vacation = await vacationService.create();
    res.status(httpStatusCode.CREATED).json({
      message: "Solicitud de vacación enviada exitosamente",
      vacation,
    });
  } catch (error) {
    res.status(httpStatusCode.INTERNAL_SERVER).json({
      message: error.message,
    });
  }
}

export { getVacationsByEmployee, createVacation,  };
