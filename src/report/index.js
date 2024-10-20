const xlsx = require("xlsx");
const fs = require("fs");
const filePath = "../../asistencia.xlsx";

const currentDate = new Date();
function createReport(data) {
  const register = data;
  let rows = register.map((row) => {
    return {
      name: row.employee.username,
      entrada: row.entrada,
      descanso: row.descanso,
      retorno: row.retorno,
      salida: row.salida,
      fecha: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      ).toLocaleString("es-BO", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }),
      location: row.locations.street,
    };
  });
  const worksheet = xlsx.utils.json_to_sheet(rows);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Asistencia");
  xlsx.utils.sheet_add_aoa(worksheet, [
    [
      "Nombre",
      "Entrada",
      "Descanso",
      "Retorno",
      "Salida",
      "Fecha",
      "Ubicación",
    ],
  ]);
  fs.readFile(filePath)
  xlsx.writeFile(workbook, filePath, { compression: true });
}

module.exports = { createReport };
