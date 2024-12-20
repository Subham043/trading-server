import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../db";
import {
 CaseRepoCreateType,
 CaseType,
} from "../../@types/case.type";

export class CaseModel {
 constructor(
  protected readonly prismaCase: PrismaClient["case"],
 ) { }

 searchQuery({
  shareCertificateID,
  search,
 }: {
  shareCertificateID?: number;
  search?: string;
 }): Prisma.CaseWhereInput {
  const whereShareCertificateID = shareCertificateID ? { shareCertificateID: shareCertificateID } : {};

  return search
   ? {
    ...whereShareCertificateID,
    OR: [
     {
      shareholderNameDeath: {
       contains: search,
      },
     },
     {
      guardianName: {
       contains: search,
      },
     },
     {
      guardianRelationship: {
       contains: search,
      },
     },
     {
      guardianPan: {
       contains: search,
      },
     },
     {
      taxStatus: {
       contains: search,
      },
     },
     {
      selectClaimant: {
       contains: search,
      },
     },
     {
      statusClaimant: {
       contains: search,
      },
     },
     {
      occupationClaimant: {
       contains: search,
      },
     },
    ],
   }
   : {
    ...whereShareCertificateID,
   };
 }

 // create a new user
 async store(
  data: CaseRepoCreateType
 ): Promise<CaseType | null> {
  // do some custom validation...
  const result = await this.prismaCase.create({
   data,
  });

  return await this.findById(result.id);
 }

 async updateById(
  data: any,
  id: number
 ): Promise<CaseType | null> {
  // do some custom validation...
  await this.prismaCase.update({
   where: { id },
   data,
  });

  return await this.findById(id);
 }

 async findById(id: number): Promise<CaseType | null> {
  // do some custom validation...
  const data = await this.prismaCase.findFirst({
    where: { id },
    include: {
      deadShareholder: true,
    },
  });

  return data;
 }

 async findInfoById(id: number): Promise<CaseType | null> {
  // do some custom validation...
  const data = await this.prismaCase.findFirst({
   where: { id },
   include: {
    deadShareholder: true
   }
  });

  return data;
 }

 async deleteById(id: number): Promise<CaseType | null> {
  // do some custom validation...
  const data = await this.prismaCase.delete({
   where: { id },
  });
  return data;
 }

 async deleteManyByIds(ids: number[]): Promise<void> {
  // do some custom validation...
  await this.prismaCase.deleteMany({
   where: { id: { in: ids } },
  });
  return;
 }

 async totalCount(params: {
  shareCertificateID?: number;
  search?: string;
 }): Promise<number> {
  // do some custom validation...
  return await this.prismaCase.count({
   where: this.searchQuery(params),
  });
 }

 async all(params: {
  shareCertificateID?: number;
  search?: string;
 }): Promise<CaseType[]> {
  // do some custom validation...
  const data = await this.prismaCase.findMany({
   where: this.searchQuery(params),
   orderBy: {
    id: "desc",
   },
  });
  return data;
 }

 async paginate(params: {
  limit: number;
  offset: number;
  shareCertificateID?: number;
  search?: string;
 }): Promise<CaseType[]> {
  // do some custom validation...
  const data = await this.prismaCase.findMany({
   skip: params.offset,
   take: params.limit,
   where: this.searchQuery({
    search: params.search,
    shareCertificateID: params.shareCertificateID,
   }),
   orderBy: {
    id: "desc",
   },
  });
  return data;
 }
}

export const caseModel = new CaseModel(
 prisma.case
);
