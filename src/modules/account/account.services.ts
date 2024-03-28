import { updateProfile } from "./account.repository";
import { UpdateProfileBody } from "./schemas/profile.schema";

export async function update(
  user: UpdateProfileBody,
  userId: number
): Promise<{
  name: string;
  email: string;
}> {
  return await updateProfile(user, userId);
}
