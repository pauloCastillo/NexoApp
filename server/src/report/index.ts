import xlsx from 'xlsx';

// domain: asistencia (ES) — Attendance
const DEFAULT_FILE_PATH = "asistencia.xlsx";

interface IReportRow {
  employee: { username: string };
  entrada?: string;
  descanso?: string;
  retorno?: string;
  salida?: string;
  locations: { street: string };
}

function mapToSheetRows(data: IReportRow[], currentDate = new Date()) {
  return data.map((row) => ({
    // domain: Nombre (ES) -> name
    name: row.employee.username,
    // domain: Entrada/Descanso/Retorno/Salida (ES) -> checkIn
    checkInStart: row.entrada,
    breakStart: row.descanso,
    breakEnd: row.retorno,
    checkOut: row.salida,
    fecha: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()).toLocaleString("es-BO", { day: "2-digit", month: "2-digit", year: "2-digit" }),
    location: row.locations.street,
  }));
}

function createReport(data: IReportRow[], opts: { filePath?: string; currentDate?: Date; writeFile?: typeof xlsx.writeFile } = {}) {
  const { filePath = DEFAULT_FILE_PATH, currentDate = new Date(), writeFile = xlsx.writeFile } = opts;
  const rows = mapToSheetRows(data, currentDate);
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
  writeFile(workbook, filePath);
  return workbook;
}

export { createReport, mapToSheetRows };
