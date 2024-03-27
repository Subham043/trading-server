import env from '../config/env';
import { FastifyCorsOptions } from '@fastify/cors';

export const corsOptions: FastifyCorsOptions = {
  methods: ['GET', 'PUT', 'POST', 'HEAD', 'PATCH', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Accept', 'Authorization', 'Content-Type'],
  exposedHeaders: 'Content-Length',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  preflight: true,
  origin: (origin, callback) => {
    if (env.NODE_ENV === 'development') {
      callback(null, true);
      return;
    }
    const whitelist = ['http://127.0.0.1:3000', 'http://localhost:3000', process.env.CLIENT_URL];
    if (origin) {
      if (whitelist.includes(origin)) {
        callback(null, true);
        return;
      } else {
        callback(new Error('Not allowed by CORS'), false);
        return;
      }
    } else {
      callback(new Error('Not allowed by CORS'), false);
      return;
    }
  },
};
