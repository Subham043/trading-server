import { desc, eq, ilike, or } from "drizzle-orm";
import db from "../../db";
import { registrarMasters } from "../../db/schema/registrar_master";
import { nameChangeMasters } from "../../db/schema/name_change_master";
import { WorksheetColumnsType } from "../../utils/excel";
import { companyMasters } from "../../db/schema/company_master";

export type RegistrarMasterExcelData = {
  registrar_name: string;
  sebi_regn_id: string;
  address: string | undefined;
  city: string | undefined;
  state: string | undefined;
  pincode: number | undefined;
  telephone1: string | undefined;
  telephone2: string | undefined;
  email: string | undefined;
  website: string | undefined;
  nameContactPerson: string | undefined;
  emailContactPerson: string | undefined;
  phoneContactPerson: string | undefined;
  designationContactPerson: string | undefined;
  officerAssigned: string | undefined;
  branch: string | undefined;
  companyId: number;
  createdBy: number;
};

export const ExcelFailedRegistrarMasterColumn: WorksheetColumnsType = [
  { key: "registrar_name", header: "Registrar Name" },
  { key: "sebi_regn_id", header: "SEBI Regn. ID" },
  { key: "address", header: "Address" },
  { key: "city", header: "City" },
  { key: "state", header: "State" },
  { key: "pincode", header: "Pincode" },
  { key: "telephon1", header: "Telephone 1" },
  { key: "telephon2", header: "Telephone 2" },
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
    key: "officerAssigned",
    header: "Officer Assigned",
  },
  {
    key: "branch",
    header: "Branch",
  },
  { key: "companyId", header: "Company Master Id" },
  { key: "error", header: "Error" },
];

export const ExcelRegistrarMastersColumns: WorksheetColumnsType = [
  { key: "id", header: "ID" },
  { key: "registrar_name", header: "Registrar Name" },
  { key: "sebi_regn_id", header: "SEBI Regn. ID" },
  { key: "address", header: "Address" },
  { key: "city", header: "City" },
  { key: "state", header: "State" },
  { key: "pincode", header: "Pincode" },
  { key: "telephon1", header: "Telephone 1" },
  { key: "telephon2", header: "Telephone 2" },
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
    key: "officerAssigned",
    header: "Officer Assigned",
  },
  {
    key: "branch",
    header: "Branch",
  },
  { key: "companyId", header: "Company Master Id" },
  { key: "createdAt", header: "Created At" },
];

export const RegistrarMasterSelect = {
  id: registrarMasters.id,
  registrar_name: registrarMasters.registrar_name,
  sebi_regn_id: registrarMasters.sebi_regn_id,
  address: registrarMasters.address,
  city: registrarMasters.city,
  state: registrarMasters.state,
  pincode: registrarMasters.pincode,
  telephone1: registrarMasters.telephone1,
  telephone2: registrarMasters.telephone2,
  email: registrarMasters.email,
  website: registrarMasters.website,
  nameContactPerson: registrarMasters.nameContactPerson,
  designationContactPerson: registrarMasters.designationContactPerson,
  emailContactPerson: registrarMasters.emailContactPerson,
  phoneContactPerson: registrarMasters.phoneContactPerson,
  officerAssigned: registrarMasters.officerAssigned,
  branch: registrarMasters.branch,
  createdAt: registrarMasters.createdAt,
};

export const CompanyMasterSelect = {
  companyId: companyMasters.id,
  currentName: nameChangeMasters.currentName,
};

export const MasterSelect = {
  ...RegistrarMasterSelect,
  ...CompanyMasterSelect,
};

export const Descending_RegistrarMaster_CreatedAt = desc(
  registrarMasters.createdAt
);
export const Descending_CompanyMaster_ID = desc(companyMasters.id);
export const Descending_NameChangeMaster_ID = desc(nameChangeMasters.id);

export const Select_Master_Query = db
  .select(MasterSelect)
  .from(registrarMasters)
  .rightJoin(
    registrarMasters,
    eq(registrarMasters.companyID, companyMasters.id)
  );

export const Select_Sub_Query = db
  .select({
    id: companyMasters.id,
  })
  .from(companyMasters);

export const Select_Sub_Query_Main = Select_Sub_Query.where(
  eq(registrarMasters.companyID, companyMasters.id)
)
  .orderBy(Descending_CompanyMaster_ID)
  .limit(1);

export const Select_Sub_Query_Name_Change = db
  .select({
    id: nameChangeMasters.id,
  })
  .from(nameChangeMasters);

export const Select_Sub_Query_Name_Change_Main =
  Select_Sub_Query_Name_Change.where(
    eq(nameChangeMasters.companyID, companyMasters.id)
  )
    .orderBy(Descending_NameChangeMaster_ID)
    .limit(1);

export const Search_Query = (search: string) =>
  or(
    ilike(registrarMasters.registrar_name, `%${search}%`),
    ilike(nameChangeMasters.currentName, `%${search}%`),
    ilike(registrarMasters.sebi_regn_id, `%${search}%`),
    ilike(registrarMasters.address, `%${search}%`),
    ilike(registrarMasters.city, `%${search}%`),
    ilike(registrarMasters.state, `%${search}%`),
    eq(registrarMasters.pincode, search),
    ilike(registrarMasters.email, `%${search}%`),
    ilike(registrarMasters.website, `%${search}%`),
    ilike(registrarMasters.nameContactPerson, `%${search}%`),
    ilike(registrarMasters.designationContactPerson, `%${search}%`),
    ilike(registrarMasters.emailContactPerson, `%${search}%`),
    ilike(registrarMasters.phoneContactPerson, `%${search}%`),
    ilike(registrarMasters.telephone1, `%${search}%`),
    ilike(registrarMasters.telephone2, `%${search}%`),
    ilike(registrarMasters.branch, `%${search}%`),
    ilike(registrarMasters.officerAssigned, `%${search}%`)
  );
