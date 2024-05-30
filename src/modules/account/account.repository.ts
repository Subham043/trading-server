import { accountModel } from "./account.model";
import { UpdateProfileBody } from "./schemas/profile.schema";

export async function updateProfile(
  data: UpdateProfileBody,
  id: number
): Promise<{
  name: string;
  email: string;
}> {
  return await accountModel.updateProfile(data, id);
}

export async function getById(
  id: number
): Promise<{ id: number; password: string } | null> {
  return await accountModel.findPasswordById(id);
}

export async function updatePassword(
  data: { password: string },
  id: number
): Promise<void> {
  await accountModel.updatePassword(data, id);
}
