import { desc, ilike, or } from "drizzle-orm";
import { pincodes } from "../../db/schema/pincode";
import db from "../../db";
import { WorksheetColumnsType } from "../../utils/excel";

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

export const PincodeSelect = {
  id: pincodes.id,
  circle_name: pincodes.circle_name,
  region_name: pincodes.region_name,
  division_name: pincodes.division_name,
  office_name: pincodes.office_name,
  pincode: pincodes.pincode,
  office_type: pincodes.office_type,
  district: pincodes.district,
  state_name: pincodes.state_name,
  createdAt: pincodes.createdAt,
};

export const Descending_Pincode_ID = desc(pincodes.id);

export const Select_Query = db.select(PincodeSelect).from(pincodes);

export const Search_Query = (search: string) =>
  or(
    ilike(pincodes.circle_name, `%${search}%`),
    ilike(pincodes.region_name, `%${search}%`),
    ilike(pincodes.division_name, `%${search}%`),
    ilike(pincodes.office_name, `%${search}%`),
    ilike(pincodes.pincode, `%${search}%`),
    ilike(pincodes.office_type, `%${search}%`),
    ilike(pincodes.district, `%${search}%`),
    ilike(pincodes.state_name, `%${search}%`)
  );
