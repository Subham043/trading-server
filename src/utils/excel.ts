import Excel from "exceljs";

type WorksheetColumnType = {
  key: string;
  header: string;
};

export type WorksheetColumnsType = WorksheetColumnType[];

type GenerateExcelType = <T = any>(
  key: string,
  worksheetColumns: WorksheetColumnsType,
  columns: T[]
) => Promise<Excel.Buffer>;

type GenerateEmptyExcelType = (
  key: string,
  worksheetColumns: WorksheetColumnsType
) => Promise<Excel.Buffer>;

export type ExcelBuffer = Excel.Buffer;

const setup: (
  key: string,
  worksheetColumns: WorksheetColumnsType
) => { workbook: Excel.Workbook; worksheet: Excel.Worksheet } = (
  key,
  worksheetColumns
) => {
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet(key + " List");
  worksheet.columns = worksheetColumns;
  return {
    workbook,
    worksheet,
  };
};

export const generateExcel: GenerateExcelType = async (
  key,
  worksheetColumns,
  columns
) => {
  const { workbook, worksheet } = setup(key, worksheetColumns);
  columns.forEach((column) => {
    worksheet.addRow(column);
  });
  // const exportPath = path.resolve(__dirname, "../../../static/countries.xlsx");
  // await workbook.xlsx.writeFile(exportPath);
  return await workbook.xlsx.writeBuffer();
};

export const generateEmptyExcel: GenerateEmptyExcelType = async (
  key,
  worksheetColumns
) => {
  const { workbook } = setup(key, worksheetColumns);
  return await workbook.xlsx.writeBuffer();
};
