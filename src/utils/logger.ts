import pino from 'pino';

export const logger = pino({
  redact: ['DATABASE_CONNECTION'],
  level: 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      colorizeObjects: true,
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname,plugin',
    },
  },
});
