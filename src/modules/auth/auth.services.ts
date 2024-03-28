import { fastifyApp } from "../..";
import { AuthType } from "../../@types/user.type";
import { InvalidRequestError } from "../../utils/exceptions";
import { getByEmail } from "./auth.repository";
import { LoginBody } from "./schemas/login.schema";

export async function signin(user: LoginBody): Promise<AuthType> {
  const app = await fastifyApp;
  const { email, password } = user;

  const userByEmail = await getByEmail(email);
  if (!userByEmail) {
    throw new InvalidRequestError("Invalid credentials");
  }
  const isPasswordValid = await app.bcrypt.compare(
    password,
    userByEmail.password
  );
  if (!isPasswordValid) {
    throw new InvalidRequestError("Invalid credentials");
  }

  const data = {
    id: userByEmail.id,
    name: userByEmail.name,
    email: userByEmail.email,
    role: userByEmail.role,
    status: userByEmail.status,
    createdAt: userByEmail.createdAt,
  };

  const token = app.jwt.sign({ ...data }, { expiresIn: "7d" });
  return {
    ...data,
    access_token: token,
  };
}
