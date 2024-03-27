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
