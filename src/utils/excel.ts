import { MultipartFile } from "@fastify/multipart";
import Excel from "exceljs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

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

type StoreExcelType = <T = any>(
  key: string,
  worksheetColumns: WorksheetColumnsType,
  columns: T[]
) => Promise<string>;

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
  return await workbook.xlsx.writeBuffer();
};

export const storeExcel: StoreExcelType = async (
  key,
  worksheetColumns,
  columns
) => {
  const { workbook, worksheet } = setup(key, worksheetColumns);
  columns.forEach((column) => {
    worksheet.addRow(column);
  });
  const fileName = `${uuidv4()}.xlsx`;
  const exportPath = path.resolve(
    __dirname,
    "../../static/failed_excel/" + fileName
  );
  await workbook.xlsx.writeFile(exportPath);
  return fileName;
};

export const generateEmptyExcel: GenerateEmptyExcelType = async (
  key,
  worksheetColumns
) => {
  const { workbook } = setup(key, worksheetColumns);
  return await workbook.xlsx.writeBuffer();
};

export const readExcel: (
  file: MultipartFile
) => Promise<Excel.Worksheet | undefined> = async (file) => {
  const buffer = await file.toBuffer();
  const workbook = new Excel.Workbook();
  await workbook.xlsx.load(buffer);
  return workbook.getWorksheet();
};
