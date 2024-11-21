import { Prisma, PrismaClient } from "@prisma/client";
import { WorksheetColumnsType } from "../../utils/excel";
import { PincodeRepoCreateType, PincodeType } from "../../@types/pincode.type";
import { UpdatePincodeBody } from "./schemas/update.schema";
import { prisma } from "../../db";

export const ExcelPincodesColumn: WorksheetColumnsType = [
  { key: "id", header: "ID" },
  { key: "circle_name", header: "Circle Name" },
  { key: "region_name", header: "Region Name" },
  { key: "division_name", header: "Division Name" },
  { key: "office_name", header: "Office Name" },
  { key: "pincode", header: "Pincode" },
  { key: "office_type", header: "Office Type" },
  { key: "district", header: "District" },
  { key: "state_name", header: "State Name" },
  { key: "createdAt", header: "Created At" },
];

export const PincodeColumn = {
  id: true,
  region_name: true,
  circle_name: true,
  division_name: true,
  office_name: true,
  pincode: true,
  office_type: true,
  district: true,
  state_name: true,
  createdAt: true,
};

export class PincodesModel {
  constructor(protected readonly prismaPincode: PrismaClient["pincode"]) {}

  searchQuery(search?: string): Prisma.PincodeWhereInput {
    return search
      ? {
          OR: [
            {
              region_name: {
                contains: search,
              },
            },
            {
              circle_name: {
                contains: search,
              },
            },
            {
              division_name: {
                contains: search,
              },
            },
            {
              office_name: {
                contains: search,
              },
            },
            {
              pincode: {
                contains: search,
              },
            },
            {
              office_type: {
                contains: search,
              },
            },
            {
              district: {
                contains: search,
              },
            },
            {
              state_name: {
                contains: search,
              },
            },
          ],
        }
      : {};
  }

  // create a new user
  async store(data: PincodeRepoCreateType): Promise<PincodeType> {
    // do some custom validation...
    return await this.prismaPincode.create({
      data,
      select: PincodeColumn,
    });
  }

  async updateById(
    data: Omit<UpdatePincodeBody, "id" | "createdAt">,
    id: number
  ): Promise<PincodeType> {
    // do some custom validation...
    return await this.prismaPincode.update({
      where: { id },
      data,
      select: PincodeColumn,
    });
  }

  async findById(id: number): Promise<PincodeType | null> {
    // do some custom validation...
    return await this.prismaPincode.findFirst({
      where: { id },
      select: PincodeColumn,
    });
  }

  async findByPincode(pincode: string): Promise<PincodeType | null> {
    return await this.prismaPincode.findFirst({
      where: { pincode },
      select: PincodeColumn,
    });
  }

  async deleteById(id: number): Promise<PincodeType> {
    // do some custom validation...
    return await this.prismaPincode.delete({
      where: { id },
      select: PincodeColumn,
    });
  }

  async deleteManyByIds(ids: number[]): Promise<Prisma.BatchPayload> {
    // do some custom validation...
    return await this.prismaPincode.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async totalCount(search?: string): Promise<number> {
    // do some custom validation...
    return await this.prismaPincode.count({
      where: this.searchQuery(search),
    });
  }

  async all(search?: string): Promise<PincodeType[]> {
    // do some custom validation...
    return await this.prismaPincode.findMany({
      where: this.searchQuery(search),
      select: PincodeColumn,
      orderBy: {
        id: "desc",
      },
    });
  }

  async allDistinctPincodes(search?: string): Promise<
    {
      id: number;
      pincode: string;
      state_name: string;
    }[]
  > {
    return await this.prismaPincode.findMany({
      where: this.searchQuery(search),
      distinct: ["pincode"],
      select: {
        id: true,
        pincode: true,
        state_name: true,
      },
      orderBy: {
        id: "desc",
      },
    });
  }

  async paginate(
    limit: number,
    offset: number,
    search?: string
  ): Promise<PincodeType[]> {
    // do some custom validation...
    return await this.prismaPincode.findMany({
      skip: offset,
      take: limit,
      where: this.searchQuery(search),
      select: PincodeColumn,
      orderBy: {
        id: "desc",
      },
    });
  }
}

export const pincodesModel = new PincodesModel(prisma.pincode);
