import { fastifyApp } from "../..";
import { AuthType } from "../../@types/user.type";
import { InvalidRequestError, NotFoundError } from "../../utils/exceptions";
import {
  forgotPassword,
  getByEmail,
  getByKey,
  insertToken,
  resetPassword,
} from "./auth.repository";
import { ForgotPasswordBody } from "./schemas/forgot_password.schema";
import { LoginBody } from "./schemas/login.schema";
import { v4 as uuidv4 } from "uuid";
import { ResetPasswordBody } from "./schemas/reset_password.schema";
import { logger } from "../../utils/logger";
import env from "../../config/env";

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
  await insertToken({ token, userId: userByEmail.id });
  return {
    ...data,
    access_token: token,
  };
}

export async function forgot_password(user: ForgotPasswordBody): Promise<void> {
  const app = await fastifyApp;
  const { email } = user;
  const key = uuidv4();
  await forgotPassword({ email, key });
  app.mailer.sendMail(
    {
      to: email,
      subject: "Reset your password - " + env.APP_NAME,
      html: `
        <strong>Hi,</strong>
        <h3>Reset your password</h3>
        <p>Click the link below to reset your password</p>
        <a href="${env.CLIENT_URL}/reset-password/${key}" target="_blank">Reset your password</a>
      `,
    },
    (errors, info) => {
      if (errors) {
        logger.error(errors);
      }
      if (info) {
        logger.info(info);
      }
    }
  );
}

export async function reset_password(
  user: ResetPasswordBody,
  key: string
): Promise<void> {
  const app = await fastifyApp;
  const { password } = user;

  const userByKey = await getByKey(key);
  if (!userByKey) {
    throw new NotFoundError();
  }
  const hashedPassword = await app.bcrypt.hash(password);
  const new_key = uuidv4();
  await resetPassword({ password: hashedPassword, key: new_key }, userByKey.id);
}
