import { desc, ilike, or } from "drizzle-orm";
import { users } from "../../db/schema/user";
import db from "../../db";
import { WorksheetColumnsType } from "../../utils/excel";

export type UserExcelData = {
  name: string | undefined;
  email: string | undefined;
  password: string | undefined;
  confirm_password: string | undefined;
};

export const ExcelFailedUsersColumn: WorksheetColumnsType = [
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "password", header: "Password" },
  { key: "confirm_password", header: "Confirm Password" },
  { key: "error", header: "Error" },
];

export const ExcelUsersColumn: WorksheetColumnsType = [
  { key: "id", header: "ID" },
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "status", header: "Status" },
  { key: "role", header: "Role" },
  { key: "createdAt", header: "Created At" },
];

export const UserSelect = {
  id: users.id,
  name: users.name,
  email: users.email,
  status: users.status,
  role: users.role,
  createdAt: users.createdAt,
};

export const Descending_User_ID = desc(users.id);

export const Select_Query = db.select(UserSelect).from(users);

export const Search_Query = (search: string) =>
  or(ilike(users.name, `%${search}%`), ilike(users.email, `%${search}%`));
