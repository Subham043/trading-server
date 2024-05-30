import { Prisma } from "@prisma/client";
import { prisma } from "../db";

export type RegistrarMasterType = {
  id: number;
  registrar_name: string;
  sebi_regn_id: string;
  createdAt?: Date | null;
};

export type RegistrarMasterAllType = {
  id: number;
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
  registrarMasterBranchId?: number | null | undefined;
  createdAt?: Date | null;
};

export interface RegistrarMasterCreateType
  extends Omit<RegistrarMasterType, "id" | "createdAt"> {}

export interface RegistrarMasterUpdateType extends RegistrarMasterCreateType {}

export type RegistrarMasterRepoCreateType = Prisma.Args<
  typeof prisma.registrarMaster,
  "create"
>["data"];
export type RegistrarMasterRepoUpdateType = Prisma.Args<
  typeof prisma.registrarMaster,
  "update"
>["data"];
