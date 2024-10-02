const xlsx = require("xlsx");
const fs = require("fs");
const filePath = "../../asistencia.xlsx\";

const currentDate = new Date();

function addNewData(newData){
  let workbook
  if(fs.exists(filePath)){
    workbook = xlsx.readFile(filePath);
  }else{
   workbook = xlsx.utils.book_new();
  }
}

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
  xlsx.writeFile(workbook, "../../asistencia.xlsx", { compression: true });
}

const pageName = "Asistencia del Personal";
let newSheet = workbook.Sheets[pageName];
let existsData = [];
if(newSheet){
  existsData = xlsx.utils.sheet_to_json(workpage);
}

const updatedFiles = [...existsData, ...data];
const newSheet = xlsx.utils.json_to_sheet(updatedFiles);
newSheet.Sheets[newSheet];
xlsx.writeFile(workbook, path);

module.exports = createReport;
