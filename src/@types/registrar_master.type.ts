export type RegistrarMasterType = {
  id: number;
  newName?: string | null;
  currentName?: string | null;
  registrar_name: string;
  sebi_regn_id: string;
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
  branch?: string | null | undefined;
  createdAt?: Date | null;
  companyId?: number | null | undefined;
};

export interface RegistrarMasterCreateType
  extends Omit<
    RegistrarMasterType,
    "id" | "createdAt" | "newName" | "currentName" | "companyId"
  > {
  companyId: number;
}

export interface RegistrarMasterUpdateType extends RegistrarMasterCreateType {}
