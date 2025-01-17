import {
  count,
  createCommunicationTracker,
  getAll,
  getById,
  paginate,
  remove,
  removeMultiple,
  updateCommunicationTracker,
} from "./communication_tracker.repository";
import { NotFoundError } from "../../utils/exceptions";
import {
  CommunicationTrackerCreateType,
  CommunicationTrackerFolioType,
  CommunicationTrackerType,
  CommunicationTrackerUpdateType,
} from "../../@types/communication_tracker.type";
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
  ExcelCommunicationTrackersColumns,
} from "./communication_tracker.model";
import { prisma } from "../../db";

/**
 * Create a new communicationTracker with the provided communicationTracker information.
 *
 * @param {CommunicationTrackerCreateType} communicationTracker - the communicationTracker information
 * @return {Promise<CommunicationTrackerType>} a promise that resolves with the created communicationTracker data
 */
export async function create(
  data: CommunicationTrackerCreateType,
  projectID: number
): Promise<CommunicationTrackerType | null> {
  const communicationTracker = await createCommunicationTracker({
    ...data,
    projectID,
  });
  if(!communicationTracker){
    throw new NotFoundError();
  }
  return findById({ id: communicationTracker.id });
}

/**
 * Update CommunicationTrackerType information.
 *
 * @param {CreateCommunicationTrackerBody} CommunicationTrackerType - the CommunicationTrackerType information to be updated
 * @param {GetIdParam} param - the parameter used to identify the CommunicationTrackerType to be updated
 * @return {Promise<CommunicationTrackerType>} the updated CommunicationTrackerType information
 */
export async function update(
  data: CommunicationTrackerUpdateType,
  param: GetIdParam
): Promise<CommunicationTrackerType | null> {
  const communicationTracker = await updateCommunicationTracker(data, param.id);
  if (!communicationTracker) {
    throw new NotFoundError();
  }
  return findById({ id: communicationTracker.id });
}

/**
 * Find a communicationTracker by ID.
 *
 * @param {GetIdParam} params - the parameters for finding the communicationTracker
 * @return {Promise<CommunicationTrackerType>} the communicationTracker found by ID
 */
export async function findById(params: GetIdParam): Promise<
  CommunicationTrackerType & {
    foliosSet: (CommunicationTrackerFolioType & {
      currentNameChangeMasters: {
        currentName: string | null;
      } | null;
    })[];
  }
> {
  const { id } = params;
  let foliosSet: CommunicationTrackerFolioType[] = [];

  const communicationTracker = await getById(id);
  if (!communicationTracker) {
    throw new NotFoundError();
  }
  if (
    communicationTracker.folios &&
    communicationTracker.folios.split("_").length > 0
  ) {
    const inFolios = communicationTracker.folios
      .split("_")
      .map((folio) => (isNaN(Number(folio)) ? undefined : Number(folio)))
      .filter((folio) => folio !== undefined) as number[];
    if (inFolios.length > 0) {
      foliosSet = await prisma.folio.findMany({
        where: {
          id: {
            in: inFolios,
          },
        },
        select: {
          id: true,
          Folio: true,
          shareCertificateMaster: {
            select: {
              companyMaster: {
                select: {
                  nameChangeMasters: {
                    select: {
                      currentName: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    }
  }
  return {
    ...communicationTracker,
    foliosSet: foliosSet.map((folio) => ({
      ...folio,
      currentNameChangeMasters:
        folio.shareCertificateMaster?.companyMaster?.nameChangeMasters[0] ??
        null,
    })),
  };
}

/**
 * Find communicationTracker by pagination.
 *
 * @param {GetPaginationQuery} querystring - the parameters for finding the communicationTracker
 * @return {Promise<{communicationTracker:CommunicationTrackerType[]} & PaginationType>} the communicationTracker found by ID
 */
export async function list(
  querystring: GetPaginationQuery,
  projectID: number
): Promise<
  {
    communicationTracker: (CommunicationTrackerType &  {
    foliosSet: (CommunicationTrackerFolioType & {
      currentNameChangeMasters: {
        currentName: string | null;
      } | null;
    })[];
  })[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const communicationTrackerData = await paginate(
    limit,
    offset,
    projectID,
    querystring.search
  );
  const communicationTracker = await Promise.all(
    communicationTrackerData.map(async (communicationTracker) => {
      let foliosSet: CommunicationTrackerFolioType[] = [];
      if (
        communicationTracker.folios &&
        communicationTracker.folios.split("_").length > 0
      ) {
        const inFolios = communicationTracker.folios
          .split("_")
          .map((folio) => (isNaN(Number(folio)) ? undefined : Number(folio)))
          .filter((folio) => folio !== undefined) as number[];
        if (inFolios.length > 0) {
          foliosSet = await prisma.folio.findMany({
            where: {
              id: {
                in: inFolios,
              },
            },
            select: {
              id: true,
              Folio: true,
              shareCertificateMaster: {
                select: {
                  companyMaster: {
                    select: {
                      nameChangeMasters: {
                        select: {
                          currentName: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          });
        }
      }
      return {
        ...communicationTracker,
        foliosSet: foliosSet.map((folio) => ({
          ...folio,
          currentNameChangeMasters:
            folio.shareCertificateMaster?.companyMaster?.nameChangeMasters[0] ??
            null,
        })),
      };
    })
  );
  const communicationTrackerCount = await count(
    projectID,
    querystring.search
  );
  return {
    communicationTracker,
    ...getPaginationKeys({
      count: communicationTrackerCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

/**
 * Export communicationTracker by pagination.
 *
 * @param {GetSearchQuery} querystring - the parameters for finding the communicationTracker
 * @return {Promise<{file: ExcelBuffer}>} the communicationTracker found by ID
 */
export async function exportExcel(
  querystring: GetSearchQuery,
  projectID: number
): Promise<{
  file: ExcelBuffer;
}> {
  const communicationTrackers = await getAll(projectID, querystring.search);

  const buffer = await generateExcel<CommunicationTrackerType>(
    "Communication Trackers",
    ExcelCommunicationTrackersColumns,
    communicationTrackers
  );

  return {
    file: buffer,
  };
}

/**
 * Destroys a communicationTracker based on the provided parameters.
 *
 * @param {GetIdParam} params - the parameters for destroying the communicationTracker
 * @return {Promise<CommunicationTrackerType>} the destroyed communicationTracker
 */
export async function destroy(
  params: GetIdParam
): Promise<CommunicationTrackerType | null> {
  const { id } = params;
  return await remove(id);
}

export async function destroyMultiple(body: GetIdsBody): Promise<void> {
  const { id } = body;

  await removeMultiple(id);
}
