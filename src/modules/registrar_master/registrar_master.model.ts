import { desc, eq, ilike, or } from "drizzle-orm";
import db from "../../db";
import { registrarMasters } from "../../db/schema/registrar_master";
import { WorksheetColumnsType } from "../../utils/excel";
import { registrarMasterBranches } from "../../db/schema/registrar_master_branch";

export type RegistrarMasterExcelData = {
  registrar_name: string;
  sebi_regn_id: string;
  createdBy: number;
};

export const ExcelFailedRegistrarMasterColumn: WorksheetColumnsType = [
  { key: "registrar_name", header: "Registrar Name" },
  { key: "sebi_regn_id", header: "SEBI Regn. ID" },
  { key: "error", header: "Error" },
];

export const ExcelRegistrarMastersColumns: WorksheetColumnsType = [
  { key: "id", header: "ID" },
  { key: "registrar_name", header: "Registrar Name" },
  { key: "sebi_regn_id", header: "SEBI Regn. ID" },
  { key: "registrarMasterBranchId", header: "Registrar Master Branch Id" },
  {
    key: "branch",
    header: "Branch",
  },
  { key: "city", header: "City" },
  { key: "state", header: "State" },
  { key: "pincode", header: "Pincode" },
  { key: "address", header: "Address" },
  { key: "createdAt", header: "Created At" },
];

export const RegistrarMasterSelect = {
  id: registrarMasters.id,
  registrar_name: registrarMasters.registrar_name,
  sebi_regn_id: registrarMasters.sebi_regn_id,
  createdAt: registrarMasters.createdAt,
};

export const RegistrarMasterBranchSelect = {
  registrarMasterBranchId: registrarMasterBranches.id,
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
};

export const MasterSelect = {
  ...RegistrarMasterSelect,
  ...RegistrarMasterBranchSelect,
};

export const Descending_RegistrarMaster_CreatedAt = desc(
  registrarMasters.createdAt
);

export const Select_Master_Query = db
  .select(RegistrarMasterSelect)
  .from(registrarMasters);

export const Search_Query = (search: string) =>
  or(
    ilike(registrarMasters.registrar_name, `%${search}%`),
    ilike(registrarMasters.sebi_regn_id, `%${search}%`)
  );

export const Select_All_Master_Query = db
  .select(MasterSelect)
  .from(registrarMasters)
  .leftJoin(
    registrarMasterBranches,
    eq(registrarMasters.id, registrarMasterBranches.registrarMasterID)
  );
