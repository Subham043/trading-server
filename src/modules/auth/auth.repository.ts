import { eq } from "drizzle-orm";
import { UserType } from "../../@types/user.type";
import db from "../../db";
import { users } from "../../db/schema/user";

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
