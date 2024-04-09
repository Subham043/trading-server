import {
  count,
  createCompanyMaster,
  getAll,
  getById,
  paginate,
  remove,
  updateCompanyMaster,
} from "./company_master.repository";
import { NotFoundError } from "../../utils/exceptions";
import {
  CompanyMasterCreateType,
  CompanyMasterType,
  CompanyMasterUpdateType,
} from "../../@types/company_master.type";
import { getPaginationKeys, getPaginationParams } from "../../utils/pagination";
import { PaginationType } from "../../@types/pagination.type";
import { GetIdParam } from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";
import { GetSearchQuery } from "../../common/schemas/search_query.schema";
import Excel from "exceljs";

/**
 * Create a new companyMaster with the provided companyMaster information.
 *
 * @param {CompanyMasterCreateType} companyMaster - the companyMaster information
 * @return {Promise<CompanyMasterType>} a promise that resolves with the created companyMaster data
 */
export async function create(
  data: CompanyMasterCreateType,
  userId: number
): Promise<CompanyMasterType> {
  return await createCompanyMaster({ ...data, createdBy: userId });
}

/**
 * Update CompanyMasterType information.
 *
 * @param {CreateCompanyMasterBody} CompanyMasterType - the CompanyMasterType information to be updated
 * @param {GetIdParam} param - the parameter used to identify the CompanyMasterType to be updated
 * @return {Promise<CompanyMasterType>} the updated CompanyMasterType information
 */
export async function update(
  data: CompanyMasterUpdateType,
  param: GetIdParam
): Promise<CompanyMasterType> {
  return await updateCompanyMaster(data, param.id);
}

/**
 * Find a companyMaster by ID.
 *
 * @param {GetIdParam} params - the parameters for finding the companyMaster
 * @return {Promise<CompanyMasterType>} the companyMaster found by ID
 */
export async function findById(params: GetIdParam): Promise<CompanyMasterType> {
  const { id } = params;

  const companyMaster = await getById(id);
  if (!companyMaster) {
    throw new NotFoundError();
  }
  return companyMaster;
}

/**
 * Find companyMaster by pagination.
 *
 * @param {GetPaginationQuery} querystring - the parameters for finding the companyMaster
 * @return {Promise<{companyMaster:CompanyMasterType[]} & PaginationType>} the companyMaster found by ID
 */
export async function list(querystring: GetPaginationQuery): Promise<
  {
    companyMaster: CompanyMasterType[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const companyMaster = await paginate(limit, offset, querystring.search);
  const companyMasterCount = await count(querystring.search);
  return {
    companyMaster,
    ...getPaginationKeys({
      count: companyMasterCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

/**
 * Export companyMaster by pagination.
 *
 * @param {GetSearchQuery} querystring - the parameters for finding the companyMaster
 * @return {Promise<{file: Excel.Buffer}>} the companyMaster found by ID
 */
export async function exportExcel(querystring: GetSearchQuery): Promise<{
  file: Excel.Buffer;
}> {
  const companyMasters = await getAll(querystring.search);
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet("Company Masters List");
  const companyMastersColumns = [
    { key: "id", header: "ID" },
    { key: "NSE", header: "NSE" },
    { key: "BSE", header: "BSE" },
    { key: "newName", header: "Name of the Company(as per certificate)" },
    { key: "currentName", header: "Current Name of the Company" },
    { key: "ISIN", header: "ISIN" },
    { key: "CIN", header: "CIN" },
    { key: "faceValue", header: "Face Value" },
    { key: "closingPriceNSE", header: "Closing Price in NSE" },
    { key: "closingPriceBSE", header: "Closing Price in BSE" },
    { key: "registeredOffice", header: "Registered Office" },
    { key: "city", header: "City" },
    { key: "state", header: "State" },
    { key: "pincode", header: "Pincode" },
    { key: "telephone", header: "Telephone" },
    { key: "fax", header: "Fax" },
    { key: "email", header: "Email" },
    { key: "website", header: "Website" },
    { key: "nameContactPerson", header: "Name of Contact Person" },
    { key: "emailContactPerson", header: "Email of Contact Person" },
    { key: "phoneContactPerson", header: "Phone of Contact Person" },
    {
      key: "designationContactPerson",
      header: "Designation of Contact Person",
    },
    { key: "nameChangeMasterId", header: "Name Change Master Id" },
    { key: "createdAt", header: "Created At" },
  ];

  worksheet.columns = companyMastersColumns;
  companyMasters.forEach((companyMaster) => {
    worksheet.addRow(companyMaster);
  });
  const buffer = await workbook.xlsx.writeBuffer();

  return {
    file: buffer,
  };
}

/**
 * Destroys a companyMaster based on the provided parameters.
 *
 * @param {GetIdParam} params - the parameters for destroying the companyMaster
 * @return {Promise<CompanyMasterType>} the destroyed companyMaster
 */
export async function destroy(params: GetIdParam): Promise<CompanyMasterType> {
  const { id } = params;

  const companyMaster = await findById(params);
  await remove(id);
  return companyMaster;
}
