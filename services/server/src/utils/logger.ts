import pino from 'pino';

const transport = process.env.DEV_STATUS === 'development'
  ? { target: 'pino-pretty', options: { colorize: true } }
  : undefined;

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: ['password', 'token', 'secret', 'authorization', 'confirmPassword'],
  transport,
});

export default logger;
