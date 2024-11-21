import { Decimal } from "@prisma/client/runtime/library";

export type CompanyMasterQueryType = {
  id: number;
  registrarMasterBranch: {
    branch: string | null;
    city: string | null;
    pincode: string | null;
    state: string | null;
    id: number;
    registrarMaster: {
      id: number;
      registrar_name: string;
      sebi_regn_id: string;
    } | null;
  } | null;
  nameChangeMasters: {
    id: number;
    NSE: string | null;
    BSE: string | null;
    dateNameChange: Date | null;
    currentName: string | null;
    previousName: string | null;
  }[];
  currentNameChangeMasters: {
    id: number;
    NSE: string | null;
    BSE: string | null;
    dateNameChange: Date | null;
    currentName: string | null;
    previousName: string | null;
  } | null;
  CIN: string | null;
  ISIN: string | null;
  faceValue: Decimal | null;
  closingPriceNSE: Decimal | null;
  closingPriceBSE: Decimal | null;
  registeredOffice: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  telephone: string | null;
  fax: string | null;
  email: string | null;
  website: string | null;
  nameContactPerson: string | null;
  designationContactPerson: string | null;
  emailContactPerson: string | null;
  phoneContactPerson: string | null;
  createdAt: Date | null;
};

export type CompanyMasterType = {
  id: number;
  NSE?: string | null;
  BSE?: string | null;
  currentName?: string | null;
  CIN?: string | null | undefined;
  ISIN?: string | null | undefined;
  faceValue?: number | null | undefined;
  closingPriceNSE?: number | null | undefined;
  closingPriceBSE?: number | null | undefined;
  registeredOffice?: string | null | undefined;
  city?: string | null | undefined;
  state?: string | null | undefined;
  pincode?: string | null | undefined;
  telephone?: string | null | undefined;
  fax?: string | null | undefined;
  email?: string | null | undefined;
  website?: string | null | undefined;
  nameContactPerson?: string | null | undefined;
  designationContactPerson?: string | null | undefined;
  emailContactPerson?: string | null | undefined;
  phoneContactPerson?: string | null | undefined;
  createdAt?: Date | null;
  nameChangeMasterId?: number | null | undefined;
  registrar_branch: string | null | undefined;
  registrar_city: string | null | undefined;
  registrar_pincodes: string | null | undefined;
  registrar_state: string | null | undefined;
  registrarMasterBranchId?: number | null | undefined;
  registrarMasterId: number | null | undefined;
  registrar_name: string | null | undefined;
  sebi_regn_id: string | null | undefined;
};

export type CompanyMasterCreateType = Omit<
  CompanyMasterType,
  | "id"
  | "createdAt"
  | "nameChangeMasterId"
  | "registrarMasterId"
  | "registrar_branch"
  | "registrar_city"
  | "registrar_pincodes"
  | "registrar_state"
  | "registrar_name"
  | "sebi_regn_id"
>;

export interface CompanyMasterUpdateType extends CompanyMasterCreateType {}
