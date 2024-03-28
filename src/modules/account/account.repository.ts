import { eq } from "drizzle-orm";
import db from "../../db";
import { users } from "../../db/schema/user";
import { UpdateProfileBody } from "./schemas/profile.schema";

export async function updateProfile(
  data: UpdateProfileBody,
  id: number
): Promise<{
  name: string;
  email: string;
}> {
  const result = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning({
      name: users.name,
      email: users.email,
    });
  return result[0];
}

export async function getById(
  id: number
): Promise<{ id: number; password: string } | null> {
  const data = await db
    .select({
      id: users.id,
      password: users.password,
    })
    .from(users)
    .where(eq(users.id, id));
  if (data.length > 0) {
    return data[0];
  }
  return null;
}

export async function updatePassword(
  data: { password: string },
  id: number
): Promise<void> {
  await db.update(users).set(data).where(eq(users.id, id));
}
