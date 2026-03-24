// Logger utility para producción
// Evita exponer logs de debug en producción

const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args: any[]) => {
    if (isDev) {
      console.log(...args);
    }
  },
  info: (...args: any[]) => {
    if (isDev) {
      console.info(...args);
    }
  },
  warn: (...args: any[]) => {
    console.warn(...args); // Siempre mostrar warnings
  },
  error: (...args: any[]) => {
    console.error(...args); // Siempre mostrar errores
  },
  debug: (...args: any[]) => {
    if (isDev) {
      console.debug(...args);
    }
  },
};
