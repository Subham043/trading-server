import { UserType } from "../../@types/user.type";
import { prisma } from "../../db";
import { ForgotPasswordBody } from "./schemas/forgot_password.schema";
import { authModel } from "./auth.model";
import { Prisma } from "@prisma/client";
import { tokensModel } from "./token.model";

export async function getByEmail(
  email: string
): Promise<(UserType & { password: string }) | null> {
  return await authModel.findByEmail(email);
}

export async function forgotPassword(
  data: ForgotPasswordBody & { key: string }
): Promise<void> {
  await authModel.forgotPassword(data);
}

export async function getByKey(key: string): Promise<{ id: number } | null> {
  return await authModel.findByKey(key);
}

export async function resetPassword(
  data: { password: string; key: string },
  id: number
): Promise<void> {
  await authModel.resetPassword(data, id);
}

export async function insertToken(
  data: Prisma.Args<typeof prisma.token, "create">["data"]
): Promise<void> {
  await tokensModel.store(data);
}

export async function getToken(data: {
  token: string;
  userId: number;
}): Promise<{ id: number; token: string }[]> {
  return await tokensModel.findManyByTokenAndUserId(data.token, data.userId);
}

export async function deleteToken(data: {
  token: string;
  userId: number;
}): Promise<{ id: number; token: string; createdAt: Date | null } | null> {
  return await tokensModel.deleteByTokenAndUserId(data.token, data.userId);
}
