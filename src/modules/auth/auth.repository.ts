import { InferInsertModel, and, eq } from "drizzle-orm";
import { UserType } from "../../@types/user.type";
import db from "../../db";
import { users } from "../../db/schema/user";
import { ForgotPasswordBody } from "./schemas/forgot_password.schema";
import { tokens } from "../../db/schema/token";
import { AuthSelect, AuthTokenSelect } from "./auth.model";

export async function getByEmail(
  email: string
): Promise<(UserType & { password: string }) | null> {
  const data = await db
    .select(AuthSelect)
    .from(users)
    .where(eq(users.email, email));
  if (data.length > 0) {
    return data[0];
  }
  return null;
}

export async function forgotPassword(
  data: ForgotPasswordBody & { key: string }
): Promise<void> {
  await db
    .update(users)
    .set({
      key: data.key,
    })
    .where(eq(users.email, data.email));
}

export async function getByKey(key: string): Promise<{ id: number } | null> {
  const data = await db
    .select({
      id: users.id,
    })
    .from(users)
    .where(eq(users.key, key));
  if (data.length > 0) {
    return data[0];
  }
  return null;
}

export async function resetPassword(
  data: { password: string; key: string },
  id: number
): Promise<void> {
  await db.update(users).set(data).where(eq(users.id, id));
}

export async function insertToken(
  data: InferInsertModel<typeof tokens>
): Promise<void> {
  await db.insert(tokens).values(data).onConflictDoNothing();
}

export async function getToken(data: {
  token: string;
  userId: number;
}): Promise<{ id: number; token: string }[]> {
  const result = await db
    .select(AuthTokenSelect)
    .from(tokens)
    .where(and(eq(tokens.token, data.token), eq(tokens.userId, data.userId)));
  return result;
}

export async function deleteToken(data: {
  token: string;
  userId: number;
}): Promise<{ id: number; token: string; createdAt: Date | null }> {
  const result = await db
    .delete(tokens)
    .where(and(eq(tokens.token, data.token), eq(tokens.userId, data.userId)))
    .returning(AuthTokenSelect);
  return result[0];
}
