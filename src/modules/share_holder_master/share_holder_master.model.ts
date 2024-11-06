// import { Prisma, PrismaClient } from "@prisma/client";
// import { prisma } from "../../db";
// import {
//   ShareHolderMasterMainType,
//   ShareHolderMasterRepoCreateType,
//   ShareHolderMasterRepoUpdateType,
//   ShareHolderMasterType,
// } from "../../@types/share_holder_master.type";

// export type ShareHolderMasterExcelData = {
//   caseType:
//     | "Claim"
//     | "ClaimIssueDuplicate"
//     | "ClaimTransposition"
//     | "Transmission"
//     | "TransmissionIssueDuplicate"
//     | "TransmissionIssueDuplicateTransposition"
//     | "Deletion"
//     | "DeletionIssueDuplicate"
//     | "DeletionIssueDuplicateTransposition";
//   noOfLegalHeir?: string | null;
//   noOfShareHolder?: string | null;
//   projectID: number;
// };

// export const ShareHolderMasterColumn = {
//   id: true,
//   caseType: true,
//   noOfLegalHeir: true,
//   noOfShareHolder: true,
//   transpositionOrder: true,
//   projectID: true,
//   createdAt: true,
// };

// export class ShareHolderMasterModel {
//   constructor(
//     protected readonly prismaShareHolderMaster: PrismaClient["shareHolderMaster"],
//   ) {}

//   searchQuery({
//     projectID,
//     search,
//   }: {
//     projectID?: number;
//     search?: string;
//   }): Prisma.ShareHolderMasterWhereInput {
//     const whereProjectID = projectID ? { projectID: projectID } : {};

//     return search
//       ? {
//           ...whereProjectID,
//           OR: [
//             {
//               noOfLegalHeir: {
//                 contains: search,
//                 mode: "insensitive",
//               },
//               noOfShareHolder: {
//                 contains: search,
//                 mode: "insensitive",
//               },
//             },
//           ],
//         }
//       : {
//           ...whereProjectID,
//         };
//   }

//   // create a new user
//   async store(
//     data: ShareHolderMasterRepoCreateType
//   ): Promise<ShareHolderMasterType | null> {
//     // do some custom validation...
//     const result = await this.prismaShareHolderMaster.create({
//       data,
//       select: ShareHolderMasterColumn,
//     });

//     return await this.findById(result.id);
//   }

//   async updateById(
//     data: ShareHolderMasterRepoUpdateType,
//     id: number
//   ): Promise<ShareHolderMasterType | null> {
//     // do some custom validation...
//     await this.prismaShareHolderMaster.update({
//       where: { id },
//       data,
//     });

//     return await this.findById(id);
//   }

//   async findById(id: number): Promise<ShareHolderMasterType | null> {
//     // do some custom validation...
//     const data = await this.prismaShareHolderMaster.findFirst({
//       where: { id },
//       select: {
//         ...ShareHolderMasterColumn,
//       },
//     });

//     return data;
//   }

//   async findInfoById(id: number): Promise<ShareHolderMasterMainType | null> {
//     // do some custom validation...
//     const data = await this.prismaShareHolderMaster.findFirst({
//       where: { id },
//       select: {
//         ...ShareHolderMasterColumn,
//         shareHolderDetails: true,
//         legalHeirDetails: true
//       },
//     });

//     return data;
//   }

//   async deleteById(id: number): Promise<ShareHolderMasterType | null> {
//     // do some custom validation...
//     const data = await this.prismaShareHolderMaster.delete({
//       where: { id },
//       select: {
//         ...ShareHolderMasterColumn,
//       },
//     });
//     return data;
//   }

//   async deleteManyByIds(ids: number[]): Promise<void> {
//     // do some custom validation...
//     await this.prismaShareHolderMaster.deleteMany({
//       where: { id: { in: ids } },
//     });
//     return;
//   }

//   async totalCount(params: {
//     projectID?: number;
//     search?: string;
//   }): Promise<number> {
//     // do some custom validation...
//     return await this.prismaShareHolderMaster.count({
//       where: this.searchQuery(params),
//     });
//   }

//   async all(params: {
//     projectID?: number;
//     search?: string;
//   }): Promise<ShareHolderMasterType[]> {
//     // do some custom validation...
//     const data = await this.prismaShareHolderMaster.findMany({
//       where: this.searchQuery(params),
//       select: {
//         ...ShareHolderMasterColumn,
//       },
//       orderBy: {
//         id: "desc",
//       },
//     });
//     return data;
//   }

//   async paginate(params: {
//     limit: number;
//     offset: number;
//     projectID?: number;
//     search?: string;
//   }): Promise<ShareHolderMasterType[]> {
//     // do some custom validation...
//     const data = await this.prismaShareHolderMaster.findMany({
//       skip: params.offset,
//       take: params.limit,
//       where: this.searchQuery({
//         search: params.search,
//         projectID: params.projectID,
//       }),
//       select: {
//         ...ShareHolderMasterColumn,
//       },
//       orderBy: {
//         id: "desc",
//       },
//     });
//     return data;
//   }
// }

// export const shareHolderMasterModel = new ShareHolderMasterModel(
//   prisma.shareHolderMaster
// );
