// /apps/media-service/src/utils/logger.ts

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

const levels: { [key: string]: number } = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const currentLevel = levels[LOG_LEVEL] || 2;

function log(level: string, ...args: any[]) {
  if (levels[level] <= currentLevel) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level.toUpperCase()}]`, ...args);
  }
}

export const logger = {
  error: (...args: any[]) => log('error', ...args),
  warn: (...args: any[]) => log('warn', ...args),
  info: (...args: any[]) => log('info', ...args),
  debug: (...args: any[]) => log('debug', ...args)
};
