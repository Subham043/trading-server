import path from "path";
import fs from "fs";
import { count, getById, paginate, removeByFileName } from "./excel.repository";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";
import { PaginationType } from "../../@types/pagination.type";
import { getPaginationParams, getPaginationKeys } from "../../utils/pagination";
import { GetIdParam } from "../../common/schemas/id_param.schema";
import { NotFoundError } from "../../utils/exceptions";
import { FailedExcel } from "./failedExcel.model";

export async function destroyFailedExcelByFileName(
  file_name: string
): Promise<FailedExcel | null> {
  const data = await removeByFileName(file_name);
  fs.unlinkSync(
    path.resolve(__dirname, `../../../static/failed_excel/${file_name}`)
  );
  return data;
}

export async function listFailedExcel(
  querystring: GetPaginationQuery,
  userId: number
): Promise<
  {
    failedExcel: FailedExcel[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const failedExcel = await paginate(userId, limit, offset, querystring.search);
  const failedExcelCount = await count(userId, querystring.search);
  return {
    failedExcel,
    ...getPaginationKeys({
      count: failedExcelCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

export async function findFailedExcelById(
  params: GetIdParam
): Promise<FailedExcel> {
  const { id } = params;

  const user = await getById(id);
  if (!user) {
    throw new NotFoundError();
  }
  return user;
}
