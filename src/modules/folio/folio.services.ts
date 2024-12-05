import {
  count,
  countAll,
  createFolio,
  getAll,
  getById,
  paginate,
  paginateAll,
  remove,
  removeMultiple,
  updateFolio,
} from "./folio.repository";
import { NotFoundError } from "../../utils/exceptions";
import {
  FolioCorporateMasterType,
  FolioCreateType,
  FolioDividendMasterType,
  FolioType,
  FolioUpdateType,
} from "../../@types/folio.type";
import { getPaginationKeys, getPaginationParams } from "../../utils/pagination";
import { PaginationType } from "../../@types/pagination.type";
import { GetIdParam, GetIdsBody } from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";
import { GetSearchQuery } from "../../common/schemas/search_query.schema";
import {
  ExcelBuffer,
  generateExcel,
  readExcel,
  storeExcel,
} from "../../utils/excel";
import {
  FolioExcelData,
  ExcelFolioesColumns,
  ExcelFailedFolioColumn,
  FolioExportExcelData,
} from "./folio.model";
import { PostExcelBody } from "../../common/schemas/excel.schema";
import {
  createFolioBodySchema,
  shareCertificateIdSchema,
} from "./schemas/create.schema";
import { ZodError } from "zod";
import { prisma } from "../../db";
import { CorporateMasterColumn } from "../corporate_master/corporate_master.model";
import { Prisma } from "@prisma/client";

/**
 * Create a new folio with the provided folio information.
 *
 * @param {FolioCreateType} folio - the folio information
 * @return {Promise<FolioType>} a promise that resolves with the created folio data
 */
export async function create(
  data: FolioCreateType,
  shareCertificateId: number
): Promise<FolioType> {
  return await createFolio({ ...data, shareCertificateId });
}

/**
 * Update FolioType information.
 *
 * @param {CreateFolioBody} FolioType - the FolioType information to be updated
 * @param {GetIdParam} param - the parameter used to identify the FolioType to be updated
 * @return {Promise<FolioType>} the updated FolioType information
 */
export async function update(
  data: FolioUpdateType,
  param: GetIdParam
): Promise<FolioType> {
  return await updateFolio(data, param.id);
}

/**
 * Find a folio by ID.
 *
 * @param {GetIdParam} params - the parameters for finding the folio
 * @return {Promise<FolioType>} the folio found by ID
 */
export async function findById(params: GetIdParam): Promise<FolioType> {
  const { id } = params;

  const folio = await getById(id);
  if (!folio) {
    throw new NotFoundError();
  }
  return folio;
}

/**
 * Find folio by pagination.
 *
 * @param {GetPaginationQuery} querystring - the parameters for finding the folio
 * @return {Promise<{folio:FolioType[]} & PaginationType>} the folio found by ID
 */
export async function list(
  shareCertificateId: number,
  querystring: GetPaginationQuery
): Promise<
  {
    folio: (FolioType & { consolidatedHolding: string; totalMarketValue: number })[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const folioData = await paginate(
    shareCertificateId,
    limit,
    offset,
    querystring.search
  );
  const company_master = await getCompanyMaster(shareCertificateId);
  const folio = await Promise.all(
    folioData.map(async (data) => {
      const consolidatedHolding = await getConsolidatedHolding(data);
      const totalMarketValue =
        Number(consolidatedHolding) * Number(company_master?.closingPriceNSE ?? 0);
      return {
        ...data,
        consolidatedHolding,
        totalMarketValue,
      };
    })
  );
  const folioCount = await count(shareCertificateId, querystring.search);
  return {
    folio,
    ...getPaginationKeys({
      count: folioCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

export async function listAll(querystring: GetPaginationQuery): Promise<
  {
    folio: FolioType[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const folio = await paginateAll(limit, offset, querystring.search);
  const folioCount = await countAll(querystring.search);
  return {
    folio,
    ...getPaginationKeys({
      count: folioCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

/**
 * Export folio by pagination.
 *
 * @param {GetSearchQuery} querystring - the parameters for finding the folio
 * @return {Promise<{file: ExcelBuffer}>} the folio found by ID
 */
export async function exportExcel(
  shareCertificateId: number,
  querystring: GetSearchQuery
): Promise<{
  file: ExcelBuffer;
}> {
  const folios = await getAll(shareCertificateId, querystring.search);

  const excelData = folios.map((folio) => {
    return {
      id: folio.id,
      instrumentType: folio.shareCertificateMaster?.instrumentType,
      equityType: folio.equityType,
      Folio: folio.Folio,
      certificateNumber: folio.certificateNumber,
      certificateSerialNumber: folio.certificateSerialNumber,
      shareholderName1ID: folio.shareholderName1ID,
      shareholderName1: folio.shareholderName1?.shareholderName,
      shareholderName2ID: folio.shareholderName2ID,
      shareholderName2: folio.shareholderName2?.shareholderName,
      shareholderName3ID: folio.shareholderName3ID,
      shareholderName3: folio.shareholderName3?.shareholderName,
      noOfShares: folio.noOfShares,
      noOfSharesWords: folio.noOfSharesWords,
      dateOfAllotment: folio.dateOfAllotment,
      faceValue: folio.faceValue,
      distinctiveNosFrom: folio.distinctiveNosFrom,
      distinctiveNosTo: folio.distinctiveNosTo,
      endorsement: folio.endorsement,
      endorsementFolio: folio.endorsementFolio,
      endorsementDate: folio.endorsementDate,
      endorsementShareholderName1ID: folio.endorsementShareholderName1ID,
      endorsementShareholderName1: folio.endorsementShareholderName1?.shareholderName,
      endorsementShareholderName2ID: folio.endorsementShareholderName2ID,
      endorsementShareholderName2: folio.endorsementShareholderName2?.shareholderName,
      endorsementShareholderName3ID: folio.endorsementShareholderName3ID,
      endorsementShareholderName3: folio.endorsementShareholderName3?.shareholderName,
      createdAt: folio.createdAt,
      shareCertificateID: folio.shareCertificateID,
    };
  });

  const buffer = await generateExcel<FolioExportExcelData>(
    "Folios",
    ExcelFolioesColumns,
    excelData
  );

  return {
    file: buffer,
  };
}

/**
 * Destroys a folio based on the provided parameters.
 *
 * @param {GetIdParam} params - the parameters for destroying the folio
 * @return {Promise<FolioType>} the destroyed folio
 */
export async function destroy(params: GetIdParam): Promise<FolioType> {
  const { id } = params;

  const folio = await findById(params);
  await remove(id);
  return folio;
}

export async function destroyMultiple(body: GetIdsBody): Promise<void> {
  const { id } = body;
  await removeMultiple(id);
}

export async function importExcel(
  data: PostExcelBody,
  userId: number
): Promise<{
  successCount: number;
  errorCount: number;
  fileName: string | null;
}> {
  let successCount = 0;
  let errorCount = 0;
  const folioInsertData: FolioExcelData[] = [];
  const failedFolioImport: (FolioExcelData & {
    error: string;
  })[] = [];
  const worksheet = await readExcel(data.file);
  worksheet?.eachRow(async function (row, rowNumber) {
    if (rowNumber > 1) {
      const folioData = {
        faceValue: isNaN(Number(row.getCell(10).value?.toString()))
          ? undefined
          : Number(row.getCell(11).value?.toString()),
        equityType: row.getCell(1).value?.toString() as
          | "Bonus"
          | "Shares"
          | "Splits"
          | "Rights",
        Folio: row.getCell(2).value?.toString() as string,
        certificateNumber: row.getCell(3).value?.toString(),
        certificateSerialNumber: row.getCell(4).value?.toString(),
        shareholderName1: Number(row.getCell(5).value?.toString()),
        shareholderName2: Number(row.getCell(6).value?.toString()),
        shareholderName3: Number(row.getCell(7).value?.toString()),
        noOfShares: row.getCell(8).value?.toString(),
        noOfSharesWords: row.getCell(9).value?.toString(),
        dateOfAllotment: (
          row.getCell(10).value as Date | undefined
        )?.toISOString(),
        distinctiveNosFrom: row.getCell(12).value?.toString(),
        distinctiveNosTo: row.getCell(13).value?.toString(),
        endorsement: row.getCell(14).value?.toString() as "Yes" | "No",
        endorsementFolio: row.getCell(15).value?.toString(),
        endorsementDate: (
          row.getCell(16).value as Date | undefined
        )?.toISOString(),
        endorsementShareholderName1: Number(row.getCell(17).value?.toString()),
        endorsementShareholderName2: Number(row.getCell(18).value?.toString()),
        endorsementShareholderName3: Number(row.getCell(19).value?.toString()),
        shareCertificateID: Number(row.getCell(20).value?.toString()),
      };
      folioInsertData.push(folioData);
    }
  });
  for (let i = 0; i < folioInsertData.length; i++) {
    try {
      await createFolioBodySchema.parseAsync(folioInsertData[i]);
      await shareCertificateIdSchema.parseAsync({
        shareCertificateId: folioInsertData[i].shareCertificateID,
      });
      await createFolio({
        ...folioInsertData[i],
        faceValue: folioInsertData[i].faceValue as any,
        shareCertificateId: folioInsertData[i].shareCertificateID,
        endorsement: folioInsertData[i].endorsement,
        endorsementFolio: folioInsertData[i].endorsementFolio,
        endorsementDate:
          folioInsertData[i].endorsementDate !== undefined
            ? new Date(folioInsertData[i].endorsementDate as string)
            : undefined,
        endorsementShareholderName1ID:
          folioInsertData[i].endorsementShareholderName1,
        endorsementShareholderName2ID:
          folioInsertData[i].endorsementShareholderName2,
        endorsementShareholderName3ID:
          folioInsertData[i].endorsementShareholderName3,
      });
      successCount = successCount + 1;
    } catch (error) {
      let errorData: unknown = error;
      if (error instanceof ZodError) {
        errorData = error.issues
          .map((issue) => issue.message)
          .join(", ")
          .replace('"', "");
      }
      failedFolioImport.push({
        ...folioInsertData[i],
        error: JSON.stringify(errorData),
      });
      errorCount = errorCount + 1;
    }
  }
  if (failedFolioImport.length > 0 && errorCount > 0) {
    const fileName = await storeExcel<FolioExcelData & { error: string }>(
      "Folio",
      ExcelFailedFolioColumn,
      failedFolioImport,
      userId
    );
    return {
      successCount,
      errorCount,
      fileName,
    };
  }
  return {
    successCount,
    errorCount,
    fileName: null,
  };
}

export async function getCorporateMaster(
  params: GetIdParam
): Promise<FolioCorporateMasterType[]> {
  const folio = await findById(params);
  if (folio.shareCertificateID) {
    const shareCertificateMaster =
      await prisma.shareCertificateMaster.findUnique({
        where: {
          id: folio.shareCertificateID,
        },
      });
    if (shareCertificateMaster) {
      if (shareCertificateMaster.companyID) {
        const corporateMasterData = await prisma.corporateMaster.findMany({
          where: {
            companyID: shareCertificateMaster.companyID,
            date: folio.dateOfAllotment
              ? {
                  gte: folio.dateOfAllotment,
                }
              : undefined,
          },
          select: {
            ...CorporateMasterColumn,
          },
          orderBy: {
            date: "asc",
          },
        });
        const test: FolioCorporateMasterType[] = [];
        corporateMasterData.map((corporateMaster, i) => {
          if (i === 0) {
            const originalHolding = folio.noOfShares;
            const exchange = Math.floor(
              Number(corporateMaster.numerator) !== 0 &&
                Number(corporateMaster.denominator) !== 0
                ? (Number(originalHolding ?? 0) *
                    Number(corporateMaster.numerator ?? 0)) /
                    Number(corporateMaster.denominator ?? 0)
                : 0
            );
            const consolidatedHolding =
              corporateMaster.type === "Splits"
                ? exchange
                : Number(originalHolding) + exchange;
            test.push({
              type: corporateMaster.type,
              date: corporateMaster.date,
              numerator: corporateMaster.numerator,
              denominator: corporateMaster.denominator,
              originalHolding,
              exchange: exchange.toString(),
              consolidatedHolding: consolidatedHolding.toString(),
            });
          } else {
            const originalHolding = test[i - 1].consolidatedHolding;
            const exchange = Math.floor(
              Number(corporateMaster.numerator) !== 0 &&
                Number(corporateMaster.denominator) !== 0
                ? (Number(originalHolding ?? 0) *
                    Number(corporateMaster.numerator ?? 0)) /
                    Number(corporateMaster.denominator ?? 0)
                : 0
            );
            const consolidatedHolding =
              corporateMaster.type==="Splits" ? exchange : Number(originalHolding) + exchange;
            test.push({
              type: corporateMaster.type,
              date: corporateMaster.date,
              numerator: corporateMaster.numerator,
              denominator: corporateMaster.denominator,
              originalHolding,
              exchange: exchange.toString(),
              consolidatedHolding: consolidatedHolding.toString(),
            });
          }
        });
        return [
          {
            type:
              folio.equityType === "Shares" ? "ShareBought" : folio.equityType,
            date: folio.dateOfAllotment ?? new Date(),
            numerator: "0",
            denominator: "0",
            originalHolding: folio.noOfShares ?? "0",
            exchange: "0",
            consolidatedHolding: folio.noOfShares ?? "0",
          },
          ...test,
        ];
      }
    }
  }
  return [];
}

export async function getDividendMaster(
  params: GetIdParam
): Promise<FolioDividendMasterType[]> {
  const folio = await findById(params);
  if(folio && folio.dateOfAllotment && folio.shareCertificateID) {
    const shareCertificateMaster =
      await prisma.shareCertificateMaster.findUnique({
        where: {
          id: folio.shareCertificateID,
        },
      });
    if (shareCertificateMaster){
      const folios: { year: string; total_shares: string }[] =
        await prisma.$queryRaw`SELECT EXTRACT(YEAR FROM "dateOfAllotment") as year, SUM(NULLIF("noOfShares", '')::INTEGER)::text as total_shares FROM public."Folio" WHERE "dateOfAllotment" >= ${folio.dateOfAllotment} AND "shareCertificateID" = ${shareCertificateMaster.id} GROUP BY EXTRACT(YEAR FROM "dateOfAllotment") ORDER BY EXTRACT(YEAR FROM "dateOfAllotment") ASC`;
      if(folios.length > 0) {
        const folio_collection = folios.reduce((acc, obj) => {
          const { year, total_shares } = obj;
          acc[year] = total_shares;
          return acc;
        }, {});
        const folio_year = folios.map((folio) => "'" +folio.year+"'" ).join(",");
        const query = `
          SELECT "recorded_date", EXTRACT(YEAR FROM "recorded_date") as recorded_year, "financial_year", "dividend_per_share"
          FROM public."DividendMaster"
          WHERE EXTRACT(YEAR FROM "recorded_date") IN (${folio_year}) AND "companyID" = ${shareCertificateMaster.companyID}
          ORDER BY "recorded_date" ASC;
        `;
        const dividend_master: FolioDividendMasterType[] = await prisma.$queryRawUnsafe(
          query,
          folio_year
        );
        const test: FolioDividendMasterType[] = [];
        dividend_master.map((dividendMaster, i) => {
          if (i === 0) {
            const no_of_shares = Number(
              folio_collection[dividendMaster.recorded_year] ?? 0
            );
            const total_dividend = Math.floor(
              no_of_shares * Number(dividendMaster.dividend_per_share ?? 0)
            );
            const cumulative_dividend = total_dividend;
            test.push({
              recorded_date: dividendMaster.recorded_date,
              recorded_year: dividendMaster.recorded_year,
              financial_year: dividendMaster.financial_year,
              dividend_per_share: dividendMaster.dividend_per_share,
              no_of_shares: no_of_shares.toString(),
              total_dividend: total_dividend.toString(),
              cumulative_dividend: cumulative_dividend.toString(),
            });
          } else {
            const old_cumulative_dividend = Number(test[i - 1].cumulative_dividend ?? 0);
            const no_of_shares = Number(
              folio_collection[dividendMaster.recorded_year] ?? 0
            );
            const total_dividend = Math.floor(
              no_of_shares * Number(dividendMaster.dividend_per_share ?? 0)
            );
            const cumulative_dividend = total_dividend + old_cumulative_dividend;
            test.push({
              recorded_date: dividendMaster.recorded_date,
              recorded_year: dividendMaster.recorded_year,
              financial_year: dividendMaster.financial_year,
              dividend_per_share: dividendMaster.dividend_per_share,
              no_of_shares: no_of_shares.toString(),
              total_dividend: total_dividend.toString(),
              cumulative_dividend: cumulative_dividend.toString(),
            });
          }
        });
        return [
          ...test,
        ];
      }
    }
  }
  return [];
}


export async function getConsolidatedHolding(
  folio: FolioType
): Promise<string> {
  const shareCertificateMaster = await prisma.shareCertificateMaster.findUnique(
    {
      where: {
        id: folio.shareCertificateID ?? 0,
      },
    }
  );
  if (shareCertificateMaster) {
    if (shareCertificateMaster.companyID) {
      const corporateMasterData = await prisma.corporateMaster.findMany({
        where: {
          companyID: shareCertificateMaster.companyID,
          date: folio.dateOfAllotment
            ? {
                gte: folio.dateOfAllotment,
              }
            : undefined,
        },
        select: {
          ...CorporateMasterColumn,
        },
        orderBy: {
          date: "asc",
        },
      });
      const test = corporateMasterData.reduce(
        (acc, corporateMaster, i) => {
          const originalHolding =
            i === 0 ? folio.noOfShares : acc[i - 1].consolidatedHolding;

          const exchange = Math.floor(
            Number(corporateMaster.numerator) !== 0 &&
              Number(corporateMaster.denominator) !== 0
              ? (Number(originalHolding ?? 0) *
                  Number(corporateMaster.numerator ?? 0)) /
                  Number(corporateMaster.denominator ?? 0)
              : 0
          );

          const consolidatedHolding =
            corporateMaster.type === "Splits" ? exchange : Number(originalHolding) + exchange;

          acc.push({
            type: corporateMaster.type,
            date: corporateMaster.date,
            numerator: corporateMaster.numerator,
            denominator: corporateMaster.denominator,
            originalHolding,
            exchange: exchange.toString(),
            consolidatedHolding: consolidatedHolding.toString(),
          });

          return acc;
        },
        [] as Array<{
          type: string;
          date: Date;
          numerator: string | null | undefined;
          denominator: string | null | undefined;
          originalHolding: string | null | undefined;
          exchange: string;
          consolidatedHolding: string;
        }>
      );

      // Final consolidated holding
      const finalConsolidatedHolding =
        test[test.length - 1]?.consolidatedHolding;
      return finalConsolidatedHolding;
    }
  }
  return "0";
}

export async function getCompanyMaster(
  shareCertificateId: number
): Promise<
  Prisma.Args<typeof prisma.companyMaster, "create">["data"] | null
> {
  const shareCertificateMaster = await prisma.shareCertificateMaster.findUnique(
    {
      where: {
        id: shareCertificateId,
      },
    }
  );
  if (shareCertificateMaster && shareCertificateMaster.companyID) {
    const companyMaster = await prisma.companyMaster.findUnique({
      where: {
        id: shareCertificateMaster.companyID,
      },
    });
    return companyMaster;
  }
  return null;
};