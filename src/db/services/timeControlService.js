const { ControlTime } = require("../models");

async function timeRegister(data, locationId) {
  console.log(data, locationId);
  let newWorkTime;
  switch (data.label) {
    case "entrada":
      newWorkTime = await ControlTime.create({
        entrada: data.time,
        locations: locationId,
      });
      break;
    case "descanso":
      newWorkTime = await ControlTime.create({
        descanso: data.time,
        locations: locationId,
      });
      break;
    case "retorno":
      newWorkTime = await ControlTime.create({
        retorno: data.time,
        locations: locationId,
      });
      break;
    case "salida":
      newWorkTime = await ControlTime.create({
        salida: data.time,
        locations: locationId,
      });
      break;
  }
  return newWorkTime;
}

module.exports = { timeRegister };
