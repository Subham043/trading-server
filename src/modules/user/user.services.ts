import {
  count,
  createUser,
  getAll,
  getById,
  paginate,
  remove,
  removeMultiple,
  updateUser,
} from "./user.repository";
import { v4 as uuidv4 } from "uuid";
import { NotFoundError } from "../../utils/exceptions";
import { fastifyApp } from "../../index";
import {
  CreateUserBody,
  createUserBodySchema,
  createUserUniqueEmailSchema,
} from "./schemas/create.schema";
import { UserType } from "../../@types/user.type";
import { getPaginationKeys, getPaginationParams } from "../../utils/pagination";
import { PaginationType } from "../../@types/pagination.type";
import { logger } from "../../utils/logger";
import { GetIdParam, GetIdsBody } from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";
import { UpdateUserBody } from "./schemas/update.schema";
import env from "../../config/env";
import { GetSearchQuery } from "../../common/schemas/search_query.schema";
import {
  ExcelBuffer,
  generateExcel,
  readExcel,
  storeExcel,
} from "../../utils/excel";
import {
  ExcelFailedUsersColumn,
  ExcelUsersColumn,
  UserExcelData,
} from "./user.model";
import { PostExcelBody } from "../../common/schemas/excel.schema";
import { ZodError } from "zod";

/**
 * Create a new user with the provided user information.
 *
 * @param {CreateUserBody} user - the user information
 * @return {Promise<UserType>} a promise that resolves with the created user data
 */
export async function create(user: CreateUserBody): Promise<UserType> {
  const app = await fastifyApp;
  const { name, email, password } = user;
  const hashedPassword = await app.bcrypt.hash(password);
  const data = {
    name,
    email,
    password: hashedPassword,
    key: uuidv4(),
  };

  const userData = await createUser(data);
  app.mailer.sendMail(
    {
      to: userData.email,
      subject: `Welcome to ${env.APP_NAME}`,
      html: `
        <strong>Hi,</strong>
        <h3>Welcome to ${env.APP_NAME}</h3>
        <p>Your account has been created successfully</p>
        <p>This is your login credential</p>
        <p><b>Email</b>: ${userData.email}</p>
        <p><b>Password</b>: ${password}</p>
        <p>Click the link below to login to your account</p>
        <a href="${env.CLIENT_URL}/login" target="_blank">Login</a>
      `,
    },
    (errors, info) => {
      if (errors) {
        logger.error(errors);
      }
      if (info) {
        logger.info(info);
      }
    }
  );
  return userData;
}

/**
 * Update user information.
 *
 * @param {CreateUserBody} user - the user information to be updated
 * @param {GetIdParam} param - the parameter used to identify the user to be updated
 * @return {Promise<UserType>} the updated user information
 */
export async function update(
  user: UpdateUserBody,
  param: GetIdParam
): Promise<UserType> {
  const { name, email } = user;
  const data = {
    name,
    email,
  };

  return await updateUser(data, param.id);
}

/**
 * Find a user by ID.
 *
 * @param {GetIdParam} params - the parameters for finding the user
 * @return {Promise<User>} the user found by ID
 */
export async function findById(params: GetIdParam): Promise<UserType> {
  const { id } = params;

  const user = await getById(id);
  if (!user) {
    throw new NotFoundError();
  }
  return user;
}

/**
 * Find users by pagination.
 *
 * @param {GetPaginationQuery} querystring - the parameters for finding the user
 * @return {Promise<{user:UserType[]} & PaginationType>} the user found by ID
 */
export async function list(querystring: GetPaginationQuery): Promise<
  {
    user: UserType[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const user = await paginate(limit, offset, querystring.search);
  const userCount = await count(querystring.search);
  return {
    user,
    ...getPaginationKeys({
      count: userCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

/**
 * Export users by pagination.
 *
 * @param {GetSearchQuery} querystring - the parameters for finding the user
 * @return {Promise<{file: ExcelBuffer}>} the user found by ID
 */
export async function exportExcel(querystring: GetSearchQuery): Promise<{
  file: ExcelBuffer;
}> {
  const users = await getAll(querystring.search);

  const buffer = await generateExcel<UserType>(
    "Users",
    ExcelUsersColumn,
    users
  );

  return {
    file: buffer,
  };
}

/**
 * Destroys a user based on the provided parameters.
 *
 * @param {GetIdParam} params - the parameters for destroying the user
 * @return {Promise<User>} the destroyed user
 */
export async function destroy(params: GetIdParam): Promise<UserType> {
  const { id } = params;

  const user = await findById(params);
  await remove(id);
  return user;
}

export async function destroyMultiple(body: GetIdsBody): Promise<void> {
  const { id } = body;
  await removeMultiple(id);
}

export async function importExcel(
  data: PostExcelBody,
  createdBy: number
): Promise<{
  successCount: number;
  errorCount: number;
  fileName: string | null;
}> {
  let successCount = 0;
  let errorCount = 0;
  const userInsertData: UserExcelData[] = [];
  const failedUsersImport: (UserExcelData & { error: string })[] = [];
  const app = await fastifyApp;
  const worksheet = await readExcel(data.file);
  worksheet?.eachRow(function (row, rowNumber) {
    if (rowNumber > 1) {
      const userData = {
        name: row.getCell(1).isHyperlink
          ? row.getCell(1).toCsvString().replace("mailto:", "")
          : row.getCell(1).value?.toString(),
        email: row.getCell(2).isHyperlink
          ? row.getCell(2).toCsvString().replace("mailto:", "")
          : row.getCell(2).toCsvString(),
        password: row.getCell(3).isHyperlink
          ? row.getCell(3).toCsvString().replace("mailto:", "")
          : row.getCell(3).value?.toString(),
        confirm_password: row.getCell(4).isHyperlink
          ? row.getCell(4).toCsvString().replace("mailto:", "")
          : row.getCell(4).value?.toString(),
      };
      userInsertData.push(userData);
    }
  });
  for (let i = 0; i < userInsertData.length; i++) {
    try {
      await createUserBodySchema.parseAsync(userInsertData[i]);
      await createUserUniqueEmailSchema.parseAsync(userInsertData[i].email);
      const hashedPassword = await app.bcrypt.hash(
        userInsertData[i].password || ""
      );
      const validatedUserData = {
        name: userInsertData[i].name || "",
        email: userInsertData[i].email || "",
        password: hashedPassword,
        key: uuidv4(),
      };
      await createUser(validatedUserData);
      successCount = successCount + 1;
    } catch (error) {
      let errorData: unknown = error;
      if (error instanceof ZodError) {
        errorData = error.issues
          .map((issue) => issue.message)
          .join(", ")
          .replace('"', "");
      }
      failedUsersImport.push({
        ...userInsertData[i],
        error: JSON.stringify(errorData),
      });
      errorCount = errorCount + 1;
    }
  }
  if (failedUsersImport.length > 0 && errorCount > 0) {
    const fileName = await storeExcel<UserExcelData & { error: string }>(
      "Users",
      ExcelFailedUsersColumn,
      failedUsersImport,
      createdBy
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
