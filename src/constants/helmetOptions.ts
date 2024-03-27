import env from '../config/env';
import { FastifyHelmetOptions } from '@fastify/helmet';

export const helmetOptions: FastifyHelmetOptions = {
  global: true,
  enableCSPNonces: true,
  contentSecurityPolicy: {
    directives: {
      'default-src': ["'self'"],
      'style-src': ["'self'"],
      'script-src': ["'self'"],
      'font-src': ["'self'"],
      'object-src': ["'self'"],
      'img-src': ["'self'", env.CLIENT_URL],
      'frame-src': ["'self'", env.CLIENT_URL],
      'frame-ancestors': ["'self'", env.CLIENT_URL],
      'connect-src': ["'self'", env.CLIENT_URL],
      'form-action': ["'self'"],
    },
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  frameguard: {
    action: 'sameorigin',
  },
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  referrerPolicy: { policy: 'no-referrer' },
  hidePoweredBy: true,
  hsts: {
    maxAge: 15552000,
    includeSubDomains: true,
    preload: true,
  },
  xssFilter: true,
};
