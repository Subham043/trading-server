import { FastifyReply, FastifyRequest } from "fastify";
import { GetUuidParam } from "../../common/schemas/uuid_param.schema";
import fs from "fs";
import path from "path";
import { NotFoundError } from "../../utils/exceptions";
import {
  destroyFailedExcelByFileName,
  findFailedExcelById,
  listFailedExcel,
} from "./upload.services";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";
import { GetIdParam } from "../../common/schemas/id_param.schema";

export async function downloadFailedExcelByFileName(
  request: FastifyRequest<{
    Params: GetUuidParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const { id } = request.params;
    const filePath = path.resolve(
      __dirname,
      "../../../static/failed_excel",
      id
    );
    const fileStream = fs.createReadStream(filePath);
    reply
      .header("Content-Disposition", 'attachment; filename="FailedExcel.xlsx"')
      .send(fileStream);
    await destroyFailedExcelByFileName(id);
    return;
  } catch (error) {
    throw new NotFoundError("File not found");
  }
}

export async function downloadFailedExcelById(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const data = await findFailedExcelById(request.params);
  try {
    const filePath = path.resolve(
      __dirname,
      "../../../static/failed_excel",
      data.file_name
    );
    const fileStream = fs.createReadStream(filePath);
    reply
      .header("Content-Disposition", 'attachment; filename="FailedExcel.xlsx"')
      .send(fileStream);
    await destroyFailedExcelByFileName(data.file_name);
    return;
  } catch (error) {
    throw new NotFoundError("File not found");
  }
}

export async function listFailedExcels(
  request: FastifyRequest<{
    Querystring: GetPaginationQuery;
  }>,
  reply: FastifyReply
) {
  const result = await listFailedExcel(
    request.query,
    request.authenticatedUser!.id
  );
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Failed Excels Fetched",
    data: result,
  });
}

export async function sendImageStream(
  request: FastifyRequest<{
    Params: GetUuidParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const { id } = request.params;
    const filePath = path.resolve(__dirname, "../../../static/images", id);
    const fileStream = fs.createReadStream(filePath);
    return reply
      .header("Content-Disposition", 'attachment; filename="' + id + '"')
      .send(fileStream);
  } catch (error) {
    throw new NotFoundError("File not found");
  }
}
