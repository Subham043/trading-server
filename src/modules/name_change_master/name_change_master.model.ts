import { InferInsertModel, desc, eq, ilike, or } from "drizzle-orm";
import { companyMasters } from "../../db/schema/company_master";
import { nameChangeMasters } from "../../db/schema/name_change_master";
import db from "../../db";
import { NameChangeMasterUpdateType } from "../../@types/name_change_master.type";
import { WorksheetColumnsType } from "../../utils/excel";

export const ExcelNameChangeMastersColumns: WorksheetColumnsType = [
  { key: "id", header: "ID" },
  { key: "NSE", header: "NSE" },
  { key: "BSE", header: "BSE" },
  { key: "currentName", header: "New Name" },
  { key: "previousName", header: "Previous Name" },
  { key: "dateNameChange", header: "Date of Name Change" },
  { key: "companyId", header: "Company Master Id" },
  { key: "createdAt", header: "Created At" },
];

export const ExcelNameChangeCompanyColumns: WorksheetColumnsType = [
  ...ExcelNameChangeMastersColumns,
  { key: "CIN", header: "CIN" },
  { key: "ISIN", header: "ISIN" },
  { key: "faceValue", header: "Face Value" },
];

export const NameChangeMasterSelect = {
  id: nameChangeMasters.id,
  NSE: nameChangeMasters.NSE,
  BSE: nameChangeMasters.BSE,
  // newName: nameChangeMasters.newName,
  currentName: nameChangeMasters.currentName,
  previousName: nameChangeMasters.previousName,
  dateNameChange: nameChangeMasters.dateNameChange,
  // newRTA: nameChangeMasters.newRTA,
  // previousRTA: nameChangeMasters.previousRTA,
  // dateRTAChange: nameChangeMasters.dateRTAChange,
  // oldSecuritySymbol: nameChangeMasters.oldSecuritySymbol,
  // newSecuritySymbol: nameChangeMasters.newSecuritySymbol,
  // dateSecurityChange: nameChangeMasters.dateSecurityChange,
  createdAt: nameChangeMasters.createdAt,
  companyId: nameChangeMasters.companyID,
};

export const CompanyMasterSelect = {
  companyId: companyMasters.id,
  CIN: companyMasters.CIN,
  ISIN: companyMasters.ISIN,
  faceValue: companyMasters.faceValue,
};

export const MasterSelect = {
  ...NameChangeMasterSelect,
  ...CompanyMasterSelect,
};

export const Descending_NameChangeMaster_ID = desc(nameChangeMasters.id);

export const Select_Name_Change_Master_Query = db
  .select(NameChangeMasterSelect)
  .from(nameChangeMasters);

export const Select_Master_Query = db
  .select(MasterSelect)
  .from(nameChangeMasters)
  .leftJoin(companyMasters, eq(nameChangeMasters.companyID, companyMasters.id));

export const Select_NSE_BSE_Query = db
  .select({
    id: nameChangeMasters.id,
    companyId: nameChangeMasters.companyID,
    createdAt: nameChangeMasters.createdAt,
  })
  .from(nameChangeMasters);

export const Select_Sub_Query = db
  .select({
    id: nameChangeMasters.id,
  })
  .from(nameChangeMasters)
  .where(eq(nameChangeMasters.companyID, companyMasters.id))
  .orderBy(Descending_NameChangeMaster_ID)
  .limit(1);

export const Search_Query = (search: string, include: boolean = false) => {
  if (include) {
    return Company_Search_Query(search);
  }
  return Name_Change_Search_Query(search);
};

const Name_Change_Search_Query = (search: string) => {
  return or(
    ilike(nameChangeMasters.NSE, `%${search}%`),
    ilike(nameChangeMasters.BSE, `%${search}%`),
    // ilike(nameChangeMasters.newName, `%${search}%`),
    ilike(nameChangeMasters.currentName, `%${search}%`),
    ilike(nameChangeMasters.previousName, `%${search}%`)
    // ilike(nameChangeMasters.newRTA, `%${search}%`),
    // ilike(nameChangeMasters.previousRTA, `%${search}%`),
    // ilike(nameChangeMasters.oldSecuritySymbol, `%${search}%`),
    // ilike(nameChangeMasters.newSecuritySymbol, `%${search}%`)
  );
};

const Company_Search_Query = (search: string) => {
  return or(
    ilike(nameChangeMasters.NSE, `%${search}%`),
    ilike(nameChangeMasters.BSE, `%${search}%`),
    // ilike(nameChangeMasters.newName, `%${search}%`),
    ilike(nameChangeMasters.currentName, `%${search}%`),
    ilike(nameChangeMasters.previousName, `%${search}%`),
    // ilike(nameChangeMasters.newRTA, `%${search}%`),
    // ilike(nameChangeMasters.previousRTA, `%${search}%`),
    // ilike(nameChangeMasters.oldSecuritySymbol, `%${search}%`),
    // ilike(nameChangeMasters.newSecuritySymbol, `%${search}%`)
    ilike(companyMasters.ISIN, `%${search}%`),
    ilike(companyMasters.CIN, `%${search}%`),
    eq(companyMasters.faceValue, Number(search))
  );
};

export const transformData = (
  data: InferInsertModel<typeof nameChangeMasters> | NameChangeMasterUpdateType
) => ({
  ...data,
  dateNameChange: data.dateNameChange
    ? new Date(data.dateNameChange)
    : new Date(),
  // dateSecurityChange: data.dateSecurityChange
  //   ? new Date(data.dateSecurityChange)
  //   : new Date(),
  // dateRTAChange: data.dateRTAChange
  //   ? new Date(data.dateRTAChange)
  //   : new Date(),
});
