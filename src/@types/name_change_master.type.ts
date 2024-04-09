export type NameChangeMasterType = {
  id: number;
  NSE?: string | null;
  BSE?: string | null;
  previousName?: string | null;
  currentName?: string | null;
  dateNameChange?: Date | null;
  // oldSecuritySymbol?: string | null;
  // newSecuritySymbol?: string | null;
  // dateSecurityChange?: Date | null;
  // previousRTA?: string | null;
  // newRTA?: string | null;
  // dateRTAChange?: Date | null;
  companyId?: number | null;
  createdAt?: Date | null;
};

export type NameChangeMasterCreateType = Omit<
  NameChangeMasterType,
  "id" | "createdAt"
>;

export interface NameChangeMasterUpdateType
  extends NameChangeMasterCreateType {}
