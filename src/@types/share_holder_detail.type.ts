import { Prisma } from "@prisma/client";
import { prisma } from "../db";

export type ShareHolderDetailRepoCreateType = Prisma.Args<
  typeof prisma.shareHolderDetail,
  "create"
>["data"];
export type ShareHolderDetailRepoUpdateType = Prisma.Args<
  typeof prisma.shareHolderDetail,
  "update"
>["data"];
export type ShareHolderDetailType = Prisma.ShareHolderDetailGetPayload<{}>;
