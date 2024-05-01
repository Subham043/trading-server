import { desc, eq, ilike, or } from "drizzle-orm";
import db from "../../db";
import { registrarMasters } from "../../db/schema/registrar_master";
import { WorksheetColumnsType } from "../../utils/excel";
import { registrarMasterBranches } from "../../db/schema/registrar_master_branch";

export type RegistrarMasterBranchExcelData = {
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
  registrarMasterId: number;
};

export const ExcelFailedRegistrarMasterBranchColumn: WorksheetColumnsType = [
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
  { key: "registrarMasterId", header: "Registrar Master Id" },
  { key: "error", header: "Error" },
];

export const ExcelRegistrarMasterBranchesColumns: WorksheetColumnsType = [
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
  { key: "registrarMasterId", header: "Registrar Master Id" },
  { key: "createdAt", header: "Created At" },
];

export const RegistrarMasterSelect = {
  registrarMasterId: registrarMasters.id,
  registrar_name: registrarMasters.registrar_name,
  sebi_regn_id: registrarMasters.sebi_regn_id,
};

export const RegistrarMasterBranchSelect = {
  id: registrarMasterBranches.id,
  address: registrarMasterBranches.address,
  city: registrarMasterBranches.city,
  state: registrarMasterBranches.state,
  pincode: registrarMasterBranches.pincode,
  telephone1: registrarMasterBranches.telephone1,
  telephone2: registrarMasterBranches.telephone2,
  email: registrarMasterBranches.email,
  website: registrarMasterBranches.website,
  nameContactPerson: registrarMasterBranches.nameContactPerson,
  designationContactPerson: registrarMasterBranches.designationContactPerson,
  emailContactPerson: registrarMasterBranches.emailContactPerson,
  phoneContactPerson: registrarMasterBranches.phoneContactPerson,
  officerAssigned: registrarMasterBranches.officerAssigned,
  branch: registrarMasterBranches.branch,
  createdAt: registrarMasterBranches.createdAt,
};

export const MasterSelect = {
  ...RegistrarMasterSelect,
  ...RegistrarMasterBranchSelect,
};

export const Descending_RegistrarMasterBranch_CreatedAt = desc(
  registrarMasterBranches.createdAt
);
export const Descending_RegistrarMaster_ID = desc(registrarMasters.id);

export const Select_Master_Query = db
  .select(MasterSelect)
  .from(registrarMasterBranches)
  .leftJoin(
    registrarMasters,
    eq(registrarMasters.id, registrarMasterBranches.registrarMasterID)
  );

export const Search_Query = (search: string) =>
  or(
    ilike(registrarMasters.registrar_name, `%${search}%`),
    ilike(registrarMasters.sebi_regn_id, `%${search}%`),
    ilike(registrarMasterBranches.address, `%${search}%`),
    ilike(registrarMasterBranches.city, `%${search}%`),
    ilike(registrarMasterBranches.state, `%${search}%`),
    eq(registrarMasterBranches.pincode, search),
    ilike(registrarMasterBranches.email, `%${search}%`),
    ilike(registrarMasterBranches.website, `%${search}%`),
    ilike(registrarMasterBranches.nameContactPerson, `%${search}%`),
    ilike(registrarMasterBranches.designationContactPerson, `%${search}%`),
    ilike(registrarMasterBranches.emailContactPerson, `%${search}%`),
    ilike(registrarMasterBranches.phoneContactPerson, `%${search}%`),
    ilike(registrarMasterBranches.telephone1, `%${search}%`),
    ilike(registrarMasterBranches.telephone2, `%${search}%`),
    ilike(registrarMasterBranches.branch, `%${search}%`),
    ilike(registrarMasterBranches.officerAssigned, `%${search}%`)
  );
