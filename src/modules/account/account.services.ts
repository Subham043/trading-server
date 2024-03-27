import { CustomInputValidationError } from "../../utils/exceptions";
import { getByEmail } from "../user/user.repository";
import { updateProfile } from "./account.repository";
import { UpdateProfileBody } from "./schemas/profile.schema";

export async function update(
  user: UpdateProfileBody,
  userId: number
): Promise<{
  name: string;
  email: string;
}> {
  const userByEmail = await getByEmail(user.email);
  if (userByEmail && userByEmail.id !== userId) {
    throw new CustomInputValidationError({
      email: "Email is taken",
    });
  }
  return await updateProfile(user, userId);
}
