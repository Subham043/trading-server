import Excel from "exceljs";

type WorksheetColumnType = {
  key: string;
  header: string;
};

type WorksheetColumnsType = WorksheetColumnType[];

type GenerateExcelType = <T = any>(
  key: string,
  worksheetColumns: WorksheetColumnsType,
  columns: T[]
) => Promise<Excel.Buffer>;

export type ExcelBuffer = Excel.Buffer;

export const generateExcel: GenerateExcelType = async (
  key,
  worksheetColumns,
  columns
) => {
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet(key + " List");

  worksheet.columns = worksheetColumns;
  columns.forEach((column) => {
    worksheet.addRow(column);
  });
  // const exportPath = path.resolve(__dirname, "../../../static/countries.xlsx");
  // await workbook.xlsx.writeFile(exportPath);
  return await workbook.xlsx.writeBuffer();
};
