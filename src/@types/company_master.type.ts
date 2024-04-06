export type CompanyMasterType = {
  id: number;
  NSE?: string | null;
  BSE?: string | null;
  newName?: string | null;
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
};

export type CompanyMasterCreateType = Omit<
  CompanyMasterType,
  "id" | "createdAt"
>;

export interface CompanyMasterUpdateType extends CompanyMasterCreateType {}
