// Logger utility para producción
// Evita exponer logs de debug en producción

const isDev = process.env.NODE_ENV === 'development';

type LogArgs = unknown[];

export const logger = {
  log: (...args: LogArgs) => {
    if (isDev) {
      console.log(...args);
    }
  },
  info: (...args: LogArgs) => {
    if (isDev) {
      console.info(...args);
    }
  },
  warn: (...args: LogArgs) => {
    console.warn(...args);
  },
  error: (...args: LogArgs) => {
    console.error(...args);
  },
  debug: (...args: LogArgs) => {
    if (isDev) {
      console.debug(...args);
    }
  },
};
