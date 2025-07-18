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
  CORS_ORIGIN: string;
  DATABASE_URL: string;
  COOKIE_SECRET: string;
  GEMINI_API_KEY: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRY_TIME: string;
  REFRESH_TOKEN_EXPIRY_TIME: string;
  NODE_ENV: 'local' | 'dev' | 'stage' | 'prod';
}
