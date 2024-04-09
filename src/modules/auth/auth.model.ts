import db from "../../db";
import { tokens } from "../../db/schema/token";
import { users } from "../../db/schema/user";

export const AuthSelect = {
  id: users.id,
  name: users.name,
  email: users.email,
  status: users.status,
  role: users.role,
  password: users.password,
  createdAt: users.createdAt,
};

export const AuthTokenSelect = {
  id: tokens.id,
  token: tokens.token,
  createdAt: tokens.createdAt,
};

export const Select_Auth_Query = db.select(AuthSelect).from(users);

export const Select_Auth_Token_Query = db.select(AuthTokenSelect).from(tokens);
