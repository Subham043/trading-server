import fastify, { FastifyReply, FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import bcrypt from "fastify-bcrypt";
import jwt from "@fastify/jwt";
import cookie from "@fastify/cookie";
import auth from "@fastify/auth";
import multipartFileUpload from "fastify-file-upload";
import mailer from "fastify-mailer";
import fastifyRequestLogger from "@mgcrea/fastify-request-logger";
import { logger } from "./logger";
import { corsOptions } from "../constants/corsOptions";
import { helmetOptions } from "../constants/helmetOptions";
import { userRoutes } from "../modules/user/user.routes";
import { mailOptions } from "../constants/mailOptions";
import { FastifyMailer } from "../@types/mail.type";
import { authRoutes } from "../modules/auth/auth.routes";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import env from "../config/env";
import {
  PreHandlerHookDecoratorType,
  ServerErrorHandler,
  verifyJwtDecorator,
} from "./decorator";
import { AuthType } from "../@types/user.type";
import closeWithGrace from "close-with-grace";
import { accountRoutes } from "../modules/account/account.routes";
import { companyMasterRoutes } from "../modules/company_master/company_master.routes";
import { nameChangeMasterRoutes } from "../modules/name_change_master/name_change_master.routes";
import { uploadRoutes } from "../modules/upload/upload.routes";
import { registrarMasterRoutes } from "../modules/registrar_master/registrar_master.routes";
import { pincodeRoutes } from "../modules/pincodes/pincode.routes";
import { registrarMasterBranchRoutes } from "../modules/registrar_master_branch/registrar_master_branch.routes";
import { prisma } from "../db";
import { securityTypeMasterRoutes } from "../modules/security_type_master/security_type_master.routes";
import { shareCertificateMasterRoutes } from "../modules/share_certificate_master/share_certificate_master.routes";
import { folioRoutes } from "../modules/folio/folio.routes";
import { corporateMasterRoutes } from "../modules/corporate_master/corporate_master.routes";
import { projectRoutes } from "../modules/project/project.routes";
import { dividendMasterRoutes } from "../modules/dividend_master/dividend_master.routes";
import { shareHolderDetailRoutes } from "../modules/share_holder_detail/share_holder_detail.routes";
import { legalHeirDetailRoutes } from "../modules/legal_heir_detail/legal_heir_detail.routes";
import { caseRoutes } from "../modules/case/case.routes";
import { paymentTrackerRoutes } from "../modules/payment_tracker/payment_tracker.routes";
import { paymentTrackerStageRoutes } from "../modules/payment_tracker_stage/payment_tracker_stage.routes";
import { referralTrackerStageRoutes } from "../modules/referral_tracker_stage/referral_tracker_stage.routes";
import { stageNameRoutes } from "../modules/stage_name/stageName.routes";
import { stageTrackerRoutes } from "../modules/stage_tracker/stage_tracker.routes";
import { communicationTrackerRoutes } from "../modules/communication_tracker/communication_tracker.routes";
import { iepfTrackerRoutes } from "../modules/iepf_tracker/iepf_tracker.routes";
import { dashboardRoutes } from "../modules/dashboard/dashboard.routes";
import { suretyRoutes } from "../modules/surety/surety.routes";
import { nominationRoutes } from "../modules/nomination/nomination.routes";
import { certificateRoutes } from "../modules/certificate/certificate.routes";

declare module "fastify" {
  interface FastifyInstance {
    // mailer: FastifyMailType;
    mailer: FastifyMailer;
    verifyJwt: PreHandlerHookDecoratorType;
  }
  interface FastifyRequest {
    authenticatedUser: AuthType | undefined;
  }
}

export async function buildServer() {
  const server = await fastify({
    logger: logger,
    disableRequestLogging: env.NODE_ENV !== "production",
    ajv: {
      customOptions: {
        allErrors: true,
      },
      plugins: [require("ajv-errors")],
    },
  });

  await prisma.$connect();

  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);

  server.setErrorHandler((error, request, reply) =>
    ServerErrorHandler(error, request, reply)
  );

  await server.register(fastifyRequestLogger);

  await server.register(jwt, {
    secret: env.JWT_KEY,
  });

  await server.register(cookie, {
    secret: env.JWT_KEY,
  });
  await server
    .decorate(
      "verifyJwt",
      (request: FastifyRequest, reply: FastifyReply, done) =>
        verifyJwtDecorator(request, reply, done)
    )
    .register(auth);

  await server.register(mailer, mailOptions);

  await server.register(cors, corsOptions);

  await server.register(helmet, helmetOptions);

  await server.register(multipartFileUpload, {
    safeFileNames: true,
    uriDecodeFileNames: true,
    preserveExtension: false,
    useTempFiles: true,
    tempFileDir: "../../static/temp",
    parseNested: true,
    debug: false,
  });

  await server.register(bcrypt, {
    saltWorkFactor: 12,
  });

  await server.register(authRoutes, { prefix: "/api/auth" });
  await server.register(userRoutes, { prefix: "/api/users" });
  await server.register(accountRoutes, { prefix: "/api/account" });
  await server.register(pincodeRoutes, { prefix: "/api/pincodes" });
  await server.register(stageNameRoutes, { prefix: "/api/stage-names" });
  await server.register(uploadRoutes, { prefix: "/api/upload" });
  await server.register(registrarMasterBranchRoutes, {
    prefix: "/api/registrar-master-branches",
  });
  await server.register(companyMasterRoutes, {
    prefix: "/api/company-masters",
  });
  await server.register(nameChangeMasterRoutes, {
    prefix: "/api/name-change-masters",
  });
  await server.register(registrarMasterRoutes, {
    prefix: "/api/registrar-masters",
  });
  await server.register(securityTypeMasterRoutes, {
    prefix: "/api/security-type-masters",
  });
  await server.register(shareCertificateMasterRoutes, {
    prefix: "/api/share-certificate-masters",
  });
  await server.register(shareHolderDetailRoutes, {
    prefix: "/api/share-holder-details",
  });
  await server.register(legalHeirDetailRoutes, {
    prefix: "/api/legal-heir-details",
  });
  await server.register(folioRoutes, {
    prefix: "/api/folios",
  });
  await server.register(certificateRoutes, {
    prefix: "/api/certificates",
  });
  await server.register(corporateMasterRoutes, {
    prefix: "/api/corporate-masters",
  });
  await server.register(dividendMasterRoutes, {
    prefix: "/api/dividend-masters",
  });
  await server.register(projectRoutes, {
    prefix: "/api/projects",
  });
  await server.register(caseRoutes, {
    prefix: "/api/cases",
  });
  await server.register(stageTrackerRoutes, {
    prefix: "/api/stage-trackers",
  });
  await server.register(communicationTrackerRoutes, {
    prefix: "/api/communication-trackers",
  });
  await server.register(iepfTrackerRoutes, {
    prefix: "/api/iepf-trackers",
  });
  await server.register(suretyRoutes, {
    prefix: "/api/surety",
  });
  await server.register(nominationRoutes, {
    prefix: "/api/nomination",
  });
  await server.register(paymentTrackerRoutes, {
    prefix: "/api/payment-trackers",
  });
  await server.register(paymentTrackerStageRoutes, {
    prefix: "/api/payment-tracker-stages",
  });
  await server.register(referralTrackerStageRoutes, {
    prefix: "/api/referral-tracker-stages",
  });
  await server.register(dashboardRoutes, {
    prefix: "/api/dashboard",
  });

  // delay is the number of milliseconds for the graceful close to finish
  const closeListeners = closeWithGrace(
    { delay: env.CLOSE_GRACE_DELAY || 500 },
    async function ({ signal, err, manual }) {
      server.log.info("Closing server...");
      if (err) {
        server.log.error(err);
      }
      await prisma.$disconnect();
      await server.close();
    } as closeWithGrace.CloseWithGraceAsyncCallback
  );

  server.addHook("onClose", (instance, done) => {
    closeListeners.uninstall();
    done();
  });

  await server.ready();

  return server;
}
