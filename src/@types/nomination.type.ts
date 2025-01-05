import { Prisma } from "@prisma/client";
import { prisma } from "../db";

export type NominationType = Prisma.NominationGetPayload<{}>;

export type NominationCreateType = Omit<
  NominationType,
  "id" | "createdAt" | "projectID"
>;

export interface NominationUpdateType
  extends NominationCreateType {}

export type NominationRepoCreateType = Prisma.Args<
  typeof prisma.nomination,
  "create"
>["data"];
export type NominationRepoUpdateType = Prisma.Args<
  typeof prisma.nomination,
  "update"
>["data"];
