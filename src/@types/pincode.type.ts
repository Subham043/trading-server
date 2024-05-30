import { Prisma } from "@prisma/client";
import { prisma } from "../db";

export type PincodeType = {
  id: number;
  circle_name: string;
  region_name: string;
  division_name: string;
  office_name: string;
  pincode: string;
  office_type: string;
  district: string;
  state_name: string;
  createdAt: Date | null;
};

export interface PincodeCreateType
  extends Omit<PincodeType, "id" | "createdAt"> {}

export interface PincodeUpdateType extends PincodeCreateType {}

export type PincodeRepoCreateType = Prisma.Args<
  typeof prisma.pincode,
  "create"
>["data"];
export type PincodeRepoUpdateType = Prisma.Args<
  typeof prisma.pincode,
  "update"
>["data"];
