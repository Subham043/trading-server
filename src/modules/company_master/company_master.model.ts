import { desc, eq, ilike, or } from "drizzle-orm";
import db from "../../db";
import { companyMasters } from "../../db/schema/company_master";
import { nameChangeMasters } from "../../db/schema/name_change_master";
import { WorksheetColumnsType } from "../../utils/excel";
import { registrarMasterBranches } from "../../db/schema/registrar_master_branch";
import { registrarMasters } from "../../db/schema/registrar_master";

export type CompanyMasterExcelData = {
  currentName: string | undefined;
  NSE: string | undefined;
  BSE: string | undefined;
  ISIN: string | undefined;
  CIN: string | undefined;
  faceValue: number;
  closingPriceNSE: number;
  closingPriceBSE: number;
  registeredOffice: string | undefined;
  city: string | undefined;
  state: string | undefined;
  pincode: number | undefined;
  telephone: string | undefined;
  fax: string | undefined;
  email: string | undefined;
  website: string | undefined;
  nameContactPerson: string | undefined;
  emailContactPerson: string | undefined;
  phoneContactPerson: string | undefined;
  designationContactPerson: string | undefined;
  registrarMasterBranchId: number | undefined;
  createdBy: number;
};

export type CompanyMasterExcelUpdateData = {
  id: number;
  currentName: string | undefined;
  NSE: string | undefined;
  BSE: string | undefined;
  ISIN: string | undefined;
  CIN: string | undefined;
  faceValue: number | undefined;
  closingPriceNSE: number | undefined;
  closingPriceBSE: number | undefined;
  registeredOffice: string | undefined;
  city: string | undefined;
  state: string | undefined;
  pincode: number | undefined;
  telephone: string | undefined;
  fax: string | undefined;
  email: string | undefined;
  website: string | undefined;
  nameContactPerson: string | undefined;
  emailContactPerson: string | undefined;
  phoneContactPerson: string | undefined;
  designationContactPerson: string | undefined;
  registrarMasterBranchId: number | undefined;
};

export interface CompanyMasterExcelUpdateRepoData
  extends Omit<CompanyMasterExcelUpdateData, "pincode"> {
  pincode?: string | undefined;
}

export const ExcelFailedCompanyMasterColumn: WorksheetColumnsType = [
  { key: "NSE", header: "NSE" },
  { key: "BSE", header: "BSE" },
  { key: "currentName", header: "Current Name of the Company" },
  { key: "ISIN", header: "ISIN" },
  { key: "CIN", header: "CIN" },
  { key: "faceValue", header: "Face Value" },
  { key: "closingPriceNSE", header: "Closing Price in NSE" },
  { key: "closingPriceBSE", header: "Closing Price in BSE" },
  { key: "registeredOffice", header: "Registered Office" },
  { key: "city", header: "City" },
  { key: "state", header: "State" },
  { key: "pincode", header: "Pincode" },
  { key: "telephone", header: "Telephone" },
  { key: "fax", header: "Fax" },
  { key: "email", header: "Email" },
  { key: "website", header: "Website" },
  { key: "nameContactPerson", header: "Name of Contact Person" },
  { key: "emailContactPerson", header: "Email of Contact Person" },
  { key: "phoneContactPerson", header: "Phone of Contact Person" },
  {
    key: "designationContactPerson",
    header: "Designation of Contact Person",
  },
  {
    key: "registrarMasterBranchId",
    header: "Registrar Master Branch Id",
  },
  { key: "error", header: "Error" },
];

export const ExcelFailedCompanyMasterUpdateColumn: WorksheetColumnsType = [
  { key: "id", header: "ID" },
  { key: "NSE", header: "NSE" },
  { key: "BSE", header: "BSE" },
  { key: "currentName", header: "Current Name of the Company" },
  { key: "ISIN", header: "ISIN" },
  { key: "CIN", header: "CIN" },
  { key: "faceValue", header: "Face Value" },
  { key: "closingPriceNSE", header: "Closing Price in NSE" },
  { key: "closingPriceBSE", header: "Closing Price in BSE" },
  { key: "registeredOffice", header: "Registered Office" },
  { key: "city", header: "City" },
  { key: "state", header: "State" },
  { key: "pincode", header: "Pincode" },
  { key: "telephone", header: "Telephone" },
  { key: "fax", header: "Fax" },
  { key: "email", header: "Email" },
  { key: "website", header: "Website" },
  { key: "nameContactPerson", header: "Name of Contact Person" },
  { key: "emailContactPerson", header: "Email of Contact Person" },
  { key: "phoneContactPerson", header: "Phone of Contact Person" },
  {
    key: "designationContactPerson",
    header: "Designation of Contact Person",
  },
  {
    key: "registrarMasterBranchId",
    header: "Registrar Master Branch Id",
  },
  { key: "error", header: "Error" },
];

export const ExcelCompanyMastersColumns: WorksheetColumnsType = [
  { key: "id", header: "ID" },
  { key: "NSE", header: "NSE" },
  { key: "BSE", header: "BSE" },
  { key: "currentName", header: "Current Name of the Company" },
  { key: "ISIN", header: "ISIN" },
  { key: "CIN", header: "CIN" },
  { key: "faceValue", header: "Face Value" },
  { key: "closingPriceNSE", header: "Closing Price in NSE" },
  { key: "closingPriceBSE", header: "Closing Price in BSE" },
  { key: "registeredOffice", header: "Registered Office" },
  { key: "city", header: "City" },
  { key: "state", header: "State" },
  { key: "pincode", header: "Pincode" },
  { key: "telephone", header: "Telephone" },
  { key: "fax", header: "Fax" },
  { key: "email", header: "Email" },
  { key: "website", header: "Website" },
  { key: "nameContactPerson", header: "Name of Contact Person" },
  { key: "emailContactPerson", header: "Email of Contact Person" },
  { key: "phoneContactPerson", header: "Phone of Contact Person" },
  {
    key: "designationContactPerson",
    header: "Designation of Contact Person",
  },
  { key: "nameChangeMasterId", header: "Name Change Master Id" },
  { key: "registrar_name", header: "Registrar Name" },
  { key: "sebi_regn_id", header: "SEBI Regn. ID" },
  { key: "registrarMasterId", header: "Registrar Master Id" },
  { key: "registrar_branch", header: "Registrar Branch" },
  { key: "registrar_city", header: "Registrar City" },
  { key: "registrar_state", header: "Registrar State" },
  { key: "registrar_pincodes", header: "Registrar Pincode" },
  { key: "registrarMasterBranchId", header: "Registrar Master Branch Id" },
  { key: "createdAt", header: "Created At" },
];

export const CompanyMasterSelect = {
  id: companyMasters.id,
  ISIN: companyMasters.ISIN,
  CIN: companyMasters.CIN,
  faceValue: companyMasters.faceValue,
  closingPriceNSE: companyMasters.closingPriceNSE,
  closingPriceBSE: companyMasters.closingPriceBSE,
  registeredOffice: companyMasters.registeredOffice,
  city: companyMasters.city,
  state: companyMasters.state,
  pincode: companyMasters.pincode,
  telephone: companyMasters.telephone,
  fax: companyMasters.fax,
  email: companyMasters.email,
  website: companyMasters.website,
  nameContactPerson: companyMasters.nameContactPerson,
  designationContactPerson: companyMasters.designationContactPerson,
  emailContactPerson: companyMasters.emailContactPerson,
  phoneContactPerson: companyMasters.phoneContactPerson,
  createdAt: companyMasters.createdAt,
};

export const NameChangeMasterSelect = {
  currentName: nameChangeMasters.currentName,
  NSE: nameChangeMasters.NSE,
  BSE: nameChangeMasters.BSE,
  nameChangeMasterId: nameChangeMasters.id,
};

export const RegistrarMasterBranchSelect = {
  registrar_branch: registrarMasterBranches.branch,
  registrar_city: registrarMasterBranches.city,
  registrar_pincodes: registrarMasterBranches.pincode,
  registrar_state: registrarMasterBranches.state,
  registrarMasterBranchId: registrarMasterBranches.id,
};

export const RegistrarMasterSelect = {
  registrarMasterId: registrarMasters.id,
  registrar_name: registrarMasters.registrar_name,
  sebi_regn_id: registrarMasters.sebi_regn_id,
};

export const MasterSelect = {
  ...CompanyMasterSelect,
  ...NameChangeMasterSelect,
  ...RegistrarMasterSelect,
  ...RegistrarMasterBranchSelect,
};

export const Descending_CompanyMaster_CreatedAt = desc(
  companyMasters.createdAt
);
export const Descending_NameChangeMaster_ID = desc(nameChangeMasters.id);

export const Select_Master_Query = db
  .select(MasterSelect)
  .from(companyMasters)
  .leftJoin(
    nameChangeMasters,
    eq(nameChangeMasters.companyID, companyMasters.id)
  )
  .leftJoin(
    registrarMasterBranches,
    eq(registrarMasterBranches.id, companyMasters.registrarMasterBranchId)
  )
  .leftJoin(
    registrarMasters,
    eq(registrarMasters.id, registrarMasterBranches.registrarMasterID)
  );

export const Select_Sub_Query = db
  .select({
    id: nameChangeMasters.id,
  })
  .from(nameChangeMasters);

export const Select_Sub_Query_Main = Select_Sub_Query.where(
  eq(nameChangeMasters.companyID, companyMasters.id)
)
  .orderBy(Descending_NameChangeMaster_ID)
  .limit(1);

export const Search_Query = (search: string) =>
  or(
    ilike(companyMasters.ISIN, `%${search}%`),
    ilike(nameChangeMasters.currentName, `%${search}%`),
    ilike(nameChangeMasters.BSE, `%${search}%`),
    ilike(nameChangeMasters.NSE, `%${search}%`),
    ilike(companyMasters.CIN, `%${search}%`),
    ilike(companyMasters.registeredOffice, `%${search}%`),
    ilike(companyMasters.city, `%${search}%`),
    ilike(companyMasters.state, `%${search}%`),
    eq(companyMasters.pincode, search),
    ilike(companyMasters.email, `%${search}%`),
    ilike(companyMasters.website, `%${search}%`),
    ilike(companyMasters.nameContactPerson, `%${search}%`),
    ilike(companyMasters.designationContactPerson, `%${search}%`),
    ilike(companyMasters.emailContactPerson, `%${search}%`),
    ilike(companyMasters.phoneContactPerson, `%${search}%`),
    ilike(companyMasters.telephone, `%${search}%`),
    ilike(companyMasters.fax, `%${search}%`),
    eq(companyMasters.faceValue, Number(search)),
    eq(companyMasters.closingPriceNSE, Number(search)),
    eq(companyMasters.closingPriceBSE, Number(search)),
    ilike(registrarMasters.registrar_name, `%${search}%`),
    ilike(registrarMasters.sebi_regn_id, `%${search}%`),
    ilike(registrarMasterBranches.branch, `%${search}%`),
    ilike(registrarMasterBranches.city, `%${search}%`),
    eq(registrarMasterBranches.pincode, search),
    ilike(registrarMasterBranches.state, `%${search}%`)
  );
