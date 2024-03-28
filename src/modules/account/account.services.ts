import { fastifyApp } from "../..";
import { updatePassword, updateProfile } from "./account.repository";
import { UpdatePasswordBody } from "./schemas/password.schema";
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

export async function updateCurrentPassword(
  user: UpdatePasswordBody,
  userId: number
): Promise<void> {
  const app = await fastifyApp;
  const hashedPassword = await app.bcrypt.hash(user.password);
  await updatePassword({ password: hashedPassword }, userId);
}
