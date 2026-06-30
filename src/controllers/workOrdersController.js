import {  httpStatusCode  } from '../utils/httpStatus.js';
import ServiceFactory from '../factories/serviceFactory.js';

async function getWorkOrdersByEmployee(req, res) {
  try {
    const { employee_id } = req.params;
    const workOrderService = ServiceFactory.getService("workOrder");
    const workOrders = await workOrderService.getByEmployee(employee_id);
    res.status(httpStatusCode.OK).json({ workOrders });
  } catch (error) {
    res.status(httpStatusCode.INTERNAL_SERVER).json({
      message: error.message,
    });
  }
}

async function createWorkOrder(req, res) {
  try {
    const workOrderService = ServiceFactory.getService("workOrder", req.body);
    const workOrder = await workOrderService.create();
    res.status(httpStatusCode.CREATED).json({
      message: "Orden de trabajo registrada exitosamente",
      workOrder,
    });
  } catch (error) {
    res.status(httpStatusCode.INTERNAL_SERVER).json({
      message: error.message,
    });
  }
}

export { getWorkOrdersByEmployee, createWorkOrder,  };
