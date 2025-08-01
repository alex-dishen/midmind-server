declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ProcessEnv extends EnvVariableT {}
  }
}

export interface EnvVariableT {
  PORT: number;
  REDIS_URL: string;
  DATABASE_URL: string;
  ACCESS_SECRET: string;
  COOKIE_SECRET: string;
  REFRESH_SECRET: string;
  ACCESS_TOKEN_EXPIRY_TIME: string;
  REFRESH_TOKEN_EXPIRY_TIME: string;
  NODE_ENV: 'local' | 'dev' | 'stage' | 'prod';
}
