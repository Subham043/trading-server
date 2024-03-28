import { eq } from "drizzle-orm";
import { UserType } from "../../@types/user.type";
import db from "../../db";
import { users } from "../../db/schema/user";
import { ForgotPasswordBody } from "./schemas/forgot_password.schema";

export async function getByEmail(
  email: string
): Promise<(UserType & { password: string }) | null> {
  const data = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      status: users.status,
      role: users.role,
      password: users.password,
      createdAt: users.createdAt,
    })
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
