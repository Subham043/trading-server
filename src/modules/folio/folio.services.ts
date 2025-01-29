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
  // FolioCorporateMasterType,
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
import { GetRightQuery } from "../../common/schemas/right_query.schema";
import { CorporateMasterType } from "../../@types/corporate_master.type";

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
      Folio: folio.Folio,
      shareholderName1ID: folio.shareholderName1ID,
      shareholderName1: folio.shareholderName1?.shareholderName,
      shareholderName2ID: folio.shareholderName2ID,
      shareholderName2: folio.shareholderName2?.shareholderName,
      shareholderName3ID: folio.shareholderName3ID,
      shareholderName3: folio.shareholderName3?.shareholderName,
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
        Folio: row.getCell(1).value?.toString() as string,
        shareholderName1ID: Number(row.getCell(2).value?.toString()),
        shareholderName2ID: Number(row.getCell(3).value?.toString()),
        shareholderName3ID: Number(row.getCell(4).value?.toString()),
        shareCertificateID: Number(row.getCell(5).value?.toString()),
      };
      folioInsertData.push(folioData);
    }
  });
  for (let i = 0; i < folioInsertData.length; i++) {
    try {
      await createFolioBodySchema.parseAsync(folioInsertData[i]);
      await shareCertificateIdSchema.parseAsync({
        shareCertificateId: folioInsertData[i].shareCertificateID,
        shareholderName1ID: folioInsertData[i].shareholderName1ID,
        shareholderName2ID: folioInsertData[i].shareholderName2ID,
        shareholderName3ID: folioInsertData[i].shareholderName3ID,
      });
      await createFolio({
        ...folioInsertData[i],
        shareholderName1ID: folioInsertData[i].shareholderName1ID,
        shareholderName2ID: folioInsertData[i].shareholderName2ID,
        shareholderName3ID: folioInsertData[i].shareholderName3ID,
        shareCertificateId: folioInsertData[i].shareCertificateID,
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

type OutputRow = {
  serialNo: number;
  date: Date;
  type: string;
  numerator: string | null;
  denominator: string | null;
  originalHolding: number;
  exchange: number;
  consolidatedHolding: number;
};

export async function getCorporateMaster(params: GetIdParam, querystring: GetRightQuery): Promise<OutputRow[]> {
  const folio = await findById(params);
  const rights = querystring.rights ? querystring.rights.split(";").map(i => Number(i)) : []; 
  const certificates = await prisma.certificate.findMany({
    where: {
      folioID: params.id,
    },
    orderBy: {
      dateOfAction: "asc",
    },
  });
  if (folio.shareCertificateID && certificates.length > 0) {
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
          },
          select: {
            ...CorporateMasterColumn,
          },
          orderBy: {
            date: "asc",
          },
        });
        let corporateMasterDataMain: CorporateMasterType[] = [
          ...corporateMasterData,
        ];

        if(rights.length>0){
          const excludedRightsCorporateMasterData = corporateMasterDataMain.filter(i => i.type !== "Rights");
          corporateMasterDataMain = [
            ...excludedRightsCorporateMasterData,
            ...corporateMasterDataMain.filter((i) => i.type==="Rights" && rights.includes(i.id)),
          ];
        }

        const combinedData = [
          ...certificates.map((cert) => ({
            date: cert.dateOfAction,
            type: cert.equityType,
            noOfShares: cert.noOfShares ? Number(cert.noOfShares) : Number(0),
            numerator: Number(0),
            denominator: Number(0),
          })),
          ...corporateMasterDataMain.map((corp) => ({
            date: corp.date,
            type: corp.type,
            noOfShares: Number(0),
            numerator: corp.numerator ? Number(corp.numerator) : Number(0),
            denominator: corp.denominator
              ? Number(corp.denominator)
              : Number(0),
          })),
        ];

        // Merge entries with the same date and type
        const mergedData = combinedData.reduce((acc, entry) => {
          const existingEntry = acc.find(
            (e) =>
              e.date?.getTime() === entry.date?.getTime() &&
              e.type === entry.type
          );

          if (
            existingEntry &&
            (existingEntry.type === "Bonus" ||
              existingEntry.type === "Splits" ||
              existingEntry.type === "Rights")
          ) {
            // existingEntry.noOfShares = existingEntry.noOfShares.add(
            //   entry.noOfShares
            // );
            existingEntry.numerator =
              entry.numerator || existingEntry.numerator;
            existingEntry.denominator =
              entry.denominator || existingEntry.denominator;
          } else {
            acc.push(entry);
          }

          return acc;
        }, [] as typeof combinedData);

        // Sort merged data by date
        mergedData.sort((a, b) =>
          a.date && b.date ? a.date.getTime() - b.date.getTime() : 0
        );

        const output: OutputRow[] = [];
        let consolidatedHolding = Number(0);

        mergedData.forEach((entry, index) => {
          const originalHolding =
            index === 0 ? entry.noOfShares : consolidatedHolding;
          const exchange =
            entry.type==="ShareBought" ? entry.noOfShares : (entry.numerator && entry.denominator
              ? parseInt((originalHolding * (entry.numerator / entry.denominator)).toString())
              : Number(0));
          consolidatedHolding =
            entry.type === "Splits" ? exchange : originalHolding + exchange;

          output.push({
            serialNo: index + 1,
            date: entry.date!,
            type: entry.type,
            numerator: entry.numerator?.toString() || '0',
            denominator: entry.denominator?.toString() || '0',
            originalHolding: originalHolding,
            exchange: exchange,
            consolidatedHolding: consolidatedHolding,
          });
        });
        return output;
      }
    }
  }
  return [];
}

export async function getCorporateMasterRights(
  params: GetIdParam,
  querystring: GetPaginationQuery
): Promise<
  {
    rights: any[];
  } & PaginationType
> {
  const folio = await findById(params);
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
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
          skip: offset,
          take: limit,
          where: {
            companyID: shareCertificateMaster.companyID,
            type: "Rights",
          },
          select: {
            ...CorporateMasterColumn,
          },
          orderBy: {
            date: "asc",
          },
        });
        const corporateMasterDataCount = await prisma.corporateMaster.count({
          where: {
            companyID: shareCertificateMaster.companyID,
            type: "Rights",
          },
        });
        return {
          rights: corporateMasterData,
          ...getPaginationKeys({
            count: corporateMasterDataCount,
            page: querystring.page,
            size: querystring.limit,
          }),
        };
      }
    }
  }
  return {
    rights: [],
    ...getPaginationKeys({
      count: 0,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

export async function getDividendMaster(
  params: GetIdParam
): Promise<FolioDividendMasterType[]> {
  const folio = await findById(params);
  if(folio && folio.shareCertificateID) {
    const shareCertificateMaster =
      await prisma.shareCertificateMaster.findUnique({
        where: {
          id: folio.shareCertificateID,
        },
      });
    if (shareCertificateMaster){
      const certificates: { year: string; total_shares: string }[] =
        await prisma.$queryRaw`
          SELECT 
            YEAR(dateOfAction) AS year, 
            CAST(SUM(NULLIF(noOfShares, '') * 1) AS CHAR) AS total_shares 
          FROM Certificate 
          WHERE folioID = ${folio.id} 
          GROUP BY YEAR(dateOfAction) 
          ORDER BY YEAR(dateOfAction) ASC
      `;
      if (certificates.length > 0) {
        const folio_collection = certificates.reduce((acc, obj) => {
          const { year, total_shares } = obj;
          acc[year] = total_shares;
          return acc;
        }, {});
        const certificate_year = certificates
          .map((certificate) => certificate.year)
        const dividend_master: FolioDividendMasterType[] =
          await prisma.$queryRaw`
          SELECT 
            recorded_date, 
            YEAR(recorded_date) AS recorded_year, 
            financial_year, 
            dividend_per_share
          FROM DividendMaster
          WHERE YEAR(recorded_date) IN (${Prisma.join(certificate_year)}) 
            AND companyID = ${shareCertificateMaster.companyID}
          ORDER BY recorded_date ASC;
        `;
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
              const old_cumulative_dividend = Number(
                test[i - 1].cumulative_dividend ?? 0
              );
              const no_of_shares = Number(
                folio_collection[dividendMaster.recorded_year] ?? 0
              );
              const total_dividend = Math.floor(
                no_of_shares * Number(dividendMaster.dividend_per_share ?? 0)
              );
              const cumulative_dividend =
                total_dividend + old_cumulative_dividend;
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
        return [...test];
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
  const certificates = await prisma.certificate.findMany({
    where: {
      folioID: folio.id,
    },
    orderBy: {
      dateOfAction: "asc",
    },
  });
  if (shareCertificateMaster && certificates.length > 0) {
    if (shareCertificateMaster.companyID) {
      const corporateMasterData = await prisma.corporateMaster.findMany({
        where: {
          companyID: shareCertificateMaster.companyID,
          // date: folio.dateOfAllotment
          //   ? {
          //       gte: folio.dateOfAllotment,
          //     }
          //   : undefined,
        },
        select: {
          ...CorporateMasterColumn,
        },
        orderBy: {
          date: "asc",
        },
      });
      const combinedData = [
        ...certificates.map((cert) => ({
          date: cert.dateOfAction,
          type: cert.equityType,
          noOfShares: cert.noOfShares ? Number(cert.noOfShares) : Number(0),
          numerator: Number(0),
          denominator: Number(0),
        })),
        ...corporateMasterData.map((corp) => ({
          date: corp.date,
          type: corp.type,
          noOfShares: Number(0),
          numerator: corp.numerator ? Number(corp.numerator) : Number(0),
          denominator: corp.denominator ? Number(corp.denominator) : Number(0),
        })),
      ];

      // Merge entries with the same date and type
      const mergedData = combinedData.reduce((acc, entry) => {
        const existingEntry = acc.find(
          (e) =>
            e.date?.getTime() === entry.date?.getTime() && e.type === entry.type
        );

        if (
          existingEntry &&
          (existingEntry.type === "Bonus" ||
            existingEntry.type === "Splits" ||
            existingEntry.type === "Rights")
        ) {
          // existingEntry.noOfShares = existingEntry.noOfShares.add(
          //   entry.noOfShares
          // );
          existingEntry.numerator = entry.numerator || existingEntry.numerator;
          existingEntry.denominator =
            entry.denominator || existingEntry.denominator;
        } else {
          acc.push(entry);
        }

        return acc;
      }, [] as typeof combinedData);

      // Sort merged data by date
      mergedData.sort((a, b) =>
        a.date && b.date ? a.date.getTime() - b.date.getTime() : 0
      );

      const output: OutputRow[] = [];
      let consolidatedHolding = Number(0);

      mergedData.forEach((entry, index) => {
        const originalHolding =
          index === 0 ? entry.noOfShares : consolidatedHolding;
        const exchange =
          entry.type === "ShareBought"
            ? entry.noOfShares
            : entry.numerator && entry.denominator
            ? parseInt(
                (
                  originalHolding *
                  (entry.numerator / entry.denominator)
                ).toString()
              )
            : Number(0);
        consolidatedHolding =
          entry.type === "Splits" ? exchange : originalHolding + exchange;

        output.push({
          serialNo: index + 1,
          date: entry.date!,
          type: entry.type,
          numerator: entry.numerator?.toString() || "0",
          denominator: entry.denominator?.toString() || "0",
          originalHolding: originalHolding,
          exchange: exchange,
          consolidatedHolding: consolidatedHolding,
        });
      });
      // return output;
      // const test = corporateMasterData.reduce(
      //   (acc, corporateMaster, i) => {
      //     const originalHolding = "0";
      //     // const originalHolding =
      //     //   i === 0 ? folio.noOfShares : acc[i - 1].consolidatedHolding;

      //     const exchange = Math.floor(
      //       Number(corporateMaster.numerator) !== 0 &&
      //         Number(corporateMaster.denominator) !== 0
      //         ? (Number(originalHolding ?? 0) *
      //             Number(corporateMaster.numerator ?? 0)) /
      //             Number(corporateMaster.denominator ?? 0)
      //         : 0
      //     );

      //     const consolidatedHolding =
      //       corporateMaster.type === "Splits"
      //         ? exchange
      //         : Number(originalHolding) + exchange;

      //     acc.push({
      //       type: corporateMaster.type,
      //       date: corporateMaster.date,
      //       numerator: corporateMaster.numerator,
      //       denominator: corporateMaster.denominator,
      //       originalHolding,
      //       exchange: exchange.toString(),
      //       consolidatedHolding: consolidatedHolding.toString(),
      //     });

      //     return acc;
      //   },
      //   [] as Array<{
      //     type: string;
      //     date: Date;
      //     numerator: string | null | undefined;
      //     denominator: string | null | undefined;
      //     originalHolding: string | null | undefined;
      //     exchange: string;
      //     consolidatedHolding: string;
      //   }>
      // );

      // Final consolidated holding
      const finalConsolidatedHolding =
        output[output.length - 1]?.consolidatedHolding;
      return finalConsolidatedHolding.toString();
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