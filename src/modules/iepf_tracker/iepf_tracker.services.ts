import {
  count,
  createIepfTracker,
  getAll,
  getById,
  paginate,
  remove,
  removeMultiple,
  updateIepfTracker,
} from "./iepf_tracker.repository";
import { NotFoundError } from "../../utils/exceptions";
import {
  IepfTrackerCreateType,
  IepfTrackerType,
  IepfTrackerUpdateType,
} from "../../@types/iepf_tracker.type";
import { getPaginationKeys, getPaginationParams } from "../../utils/pagination";
import { PaginationType } from "../../@types/pagination.type";
import { GetIdParam, GetIdsBody } from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";
import { GetSearchQuery } from "../../common/schemas/search_query.schema";
import {
  ExcelBuffer,
  generateExcel,
} from "../../utils/excel";
import {
  ExcelIepfTrackersColumns,
  ExcelIepfTrackersDocColumns,
} from "./iepf_tracker.model";
import { prisma } from "../../db";
import { ShareHolderDetailType } from "../../@types/share_holder_detail.type";
import { LegalHeirDetailType } from "../../@types/legal_heir_detail.type";

/**
 * Create a new iepfTracker with the provided iepfTracker information.
 *
 * @param {IepfTrackerCreateType} iepfTracker - the iepfTracker information
 * @return {Promise<IepfTrackerType>} a promise that resolves with the created iepfTracker data
 */
export async function create(
  data: IepfTrackerCreateType,
  projectID: number
): Promise<IepfTrackerType | null> {
  const iepfTracker = await createIepfTracker({
    ...data,
    projectID,
  });
  if(!iepfTracker){
    throw new NotFoundError();
  }
  return findById({ id: iepfTracker.id });
}

/**
 * Update IepfTrackerType information.
 *
 * @param {CreateIepfTrackerBody} IepfTrackerType - the IepfTrackerType information to be updated
 * @param {GetIdParam} param - the parameter used to identify the IepfTrackerType to be updated
 * @return {Promise<IepfTrackerType>} the updated IepfTrackerType information
 */
export async function update(
  data: IepfTrackerUpdateType,
  param: GetIdParam
): Promise<IepfTrackerType | null> {
  const iepfTracker = await updateIepfTracker(data, param.id);
  if (!iepfTracker) {
    throw new NotFoundError();
  }
  return findById({ id: iepfTracker.id });
}

/**
 * Find a iepfTracker by ID.
 *
 * @param {GetIdParam} params - the parameters for finding the iepfTracker
 * @return {Promise<IepfTrackerType>} the iepfTracker found by ID
 */
export async function findById(params: GetIdParam): Promise<
  IepfTrackerType & {
    shareHolderDetailSet: ShareHolderDetailType[];
    legalHeirDetailSet: LegalHeirDetailType[];
  }
> {
  const { id } = params;
  let shareHolderDetailSet: ShareHolderDetailType[] = [];
  let legalHeirDetailSet: LegalHeirDetailType[] = [];

  const iepfTracker = await getById(id);
  if (!iepfTracker) {
    throw new NotFoundError();
  }
  if (
    iepfTracker.shareHolderDetails &&
    iepfTracker.shareHolderDetails.split("_").length > 0
  ) {
    const inFolios = iepfTracker.shareHolderDetails
      .split("_")
      .map((folio) => (isNaN(Number(folio)) ? undefined : Number(folio)))
      .filter((folio) => folio !== undefined) as number[];
    if (inFolios.length > 0) {
      shareHolderDetailSet = await prisma.shareHolderDetail.findMany({
        where: {
          id: {
            in: inFolios,
          },
        },
      });
    }
  }
  if (
    iepfTracker.legalHeirDetails &&
    iepfTracker.legalHeirDetails.split("_").length > 0
  ) {
    const inFolios = iepfTracker.legalHeirDetails
      .split("_")
      .map((folio) => (isNaN(Number(folio)) ? undefined : Number(folio)))
      .filter((folio) => folio !== undefined) as number[];
    if (inFolios.length > 0) {
      legalHeirDetailSet = await prisma.legalHeirDetail.findMany({
        where: {
          id: {
            in: inFolios,
          },
        },
      });
    }
  }
  return {
    ...iepfTracker,
    shareHolderDetailSet,
    legalHeirDetailSet,
  };
}

/**
 * Find iepfTracker by pagination.
 *
 * @param {GetPaginationQuery} querystring - the parameters for finding the iepfTracker
 * @return {Promise<{iepfTracker:IepfTrackerType[]} & PaginationType>} the iepfTracker found by ID
 */
export async function list(
  querystring: GetPaginationQuery,
  projectID: number
): Promise<
  {
    iepfTracker: (IepfTrackerType &  {
    shareHolderDetailSet: ShareHolderDetailType[];
    legalHeirDetailSet: LegalHeirDetailType[];
  })[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const iepfTrackerData = await paginate(
    limit,
    offset,
    projectID,
    querystring.search
  );
  const iepfTracker = await Promise.all(
    iepfTrackerData.map(async (iepfTracker) => {
      let shareHolderDetailSet: ShareHolderDetailType[] = [];
      let legalHeirDetailSet: LegalHeirDetailType[] = [];
      if (
        iepfTracker.shareHolderDetails &&
        iepfTracker.shareHolderDetails.split("_").length > 0
      ) {
        const inFolios = iepfTracker.shareHolderDetails
          .split("_")
          .map((folio) => (isNaN(Number(folio)) ? undefined : Number(folio)))
          .filter((folio) => folio !== undefined) as number[];
        if (inFolios.length > 0) {
          shareHolderDetailSet = await prisma.shareHolderDetail.findMany({
            where: {
              id: {
                in: inFolios,
              },
            },
          });
        }
      }
      if (
        iepfTracker.legalHeirDetails &&
        iepfTracker.legalHeirDetails.split("_").length > 0
      ) {
        const inFolios = iepfTracker.legalHeirDetails
          .split("_")
          .map((folio) => (isNaN(Number(folio)) ? undefined : Number(folio)))
          .filter((folio) => folio !== undefined) as number[];
        if (inFolios.length > 0) {
          legalHeirDetailSet = await prisma.legalHeirDetail.findMany({
            where: {
              id: {
                in: inFolios,
              },
            },
          });
        }
      }
      return {
        ...iepfTracker,
        shareHolderDetailSet,
        legalHeirDetailSet,
      };
    })
  );
  const iepfTrackerCount = await count(
    projectID,
    querystring.search
  );
  return {
    iepfTracker,
    ...getPaginationKeys({
      count: iepfTrackerCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

/**
 * Export iepfTracker by pagination.
 *
 * @param {GetSearchQuery} querystring - the parameters for finding the iepfTracker
 * @return {Promise<{file: ExcelBuffer}>} the iepfTracker found by ID
 */
export async function exportExcel(
  querystring: GetSearchQuery,
  projectID: number
): Promise<{
  file: ExcelBuffer;
}> {
  const iepfTrackers = await getAll(projectID, querystring.search);

  const buffer = await generateExcel<IepfTrackerType>(
    "Iepf Trackers",
    ExcelIepfTrackersColumns,
    iepfTrackers
  );

  return {
    file: buffer,
  };
}

/**
 * Destroys a iepfTracker based on the provided parameters.
 *
 * @param {GetIdParam} params - the parameters for destroying the iepfTracker
 * @return {Promise<IepfTrackerType>} the destroyed iepfTracker
 */
export async function destroy(
  params: GetIdParam
): Promise<IepfTrackerType | null> {
  const { id } = params;
  return await remove(id);
}

export async function destroyMultiple(body: GetIdsBody): Promise<void> {
  const { id } = body;

  await removeMultiple(id);
}

export async function generateDoc(params: GetIdParam): Promise<{
  file: ExcelBuffer;
}> {
  const { id } = params;
  let shareHolderDetailSet: ShareHolderDetailType[] = [];
  let legalHeirDetailSet: LegalHeirDetailType[] = [];

  const iepfTracker = await getById(id);
  if (!iepfTracker) {
    throw new NotFoundError();
  }
  if (
    iepfTracker.shareHolderDetails &&
    iepfTracker.shareHolderDetails.split("_").length > 0
  ) {
    const inFolios = iepfTracker.shareHolderDetails
      .split("_")
      .map((folio) => (isNaN(Number(folio)) ? undefined : Number(folio)))
      .filter((folio) => folio !== undefined) as number[];
    if (inFolios.length > 0) {
      shareHolderDetailSet = await prisma.shareHolderDetail.findMany({
        where: {
          id: {
            in: inFolios,
          },
        },
      });
    }
  }
  if (
    iepfTracker.legalHeirDetails &&
    iepfTracker.legalHeirDetails.split("_").length > 0
  ) {
    const inFolios = iepfTracker.legalHeirDetails
      .split("_")
      .map((folio) => (isNaN(Number(folio)) ? undefined : Number(folio)))
      .filter((folio) => folio !== undefined) as number[];
    if (inFolios.length > 0) {
      legalHeirDetailSet = await prisma.legalHeirDetail.findMany({
        where: {
          id: {
            in: inFolios,
          },
        },
      });
    }
  }
  const excelData = [...legalHeirDetailSet, ...shareHolderDetailSet];
  const buffer = await generateExcel<
    ShareHolderDetailType | LegalHeirDetailType
  >("Iepf Trackers", ExcelIepfTrackersDocColumns, excelData);

  return {
    file: buffer,
  };
}