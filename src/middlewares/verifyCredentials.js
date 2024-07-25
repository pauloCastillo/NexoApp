const {Employee} = require("../db/models");
const {httpStatusCode} = require("../utils/httpStatus");

const verifyCredentials = async (req, res, next )=>{
  try{
    const { employee } = req.body;
    const existEmployee = await Employee.findOne({ mail: employee.mail });
    if (!existEmployee) {
      return res.status(httpStatusCode.NO_CONTENT).json({ message: "No existe colaborador. Revisa tu usuario y contraseña" });
    }
      const userPassword = await existEmployee.schema.methods.authenticateUser(employee.password, existEmployee._id);
      if(!userPassword){
        return res.status(httpStatusCode.NO_CONTENT).json({ message: "Revisa tu contraseña" });
      }else{
        next();
      }


  }catch (error){
    res.status(httpStatusCode.INTERNAL_SERVER).json({ message: "Error: " + error.message });
  }
}

module.exports = {
  verifyCredentials
}