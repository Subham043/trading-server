export type RegistrarMasterBranchType = {
  id: number;
  registrar_name?: string | null;
  sebi_regn_id?: string | null;
  address?: string | null | undefined;
  city?: string | null | undefined;
  state?: string | null | undefined;
  pincode?: string | null | undefined;
  telephone1?: string | null | undefined;
  telephone2?: string | null | undefined;
  email?: string | null | undefined;
  website?: string | null | undefined;
  nameContactPerson?: string | null | undefined;
  designationContactPerson?: string | null | undefined;
  emailContactPerson?: string | null | undefined;
  phoneContactPerson?: string | null | undefined;
  officerAssigned?: string | null | undefined;
  branch: string | null | undefined;
  createdAt?: Date | null;
  registrarMasterId?: number | null | undefined;
};

export interface RegistrarMasterBranchCreateType
  extends Omit<
    RegistrarMasterBranchType,
    "id" | "createdAt" | "registrar_name" | "sebi_regn_id" | "registrarMasterId"
  > {}

export interface RegistrarMasterBranchUpdateType
  extends RegistrarMasterBranchCreateType {}
