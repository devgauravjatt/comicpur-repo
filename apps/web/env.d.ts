// environment.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      API_URL: string;
      GOOGLE_REDIRECT_URI: string;
      AUTH_URL: string;
    }
  }
}
// Ensures the file is treated as a module
export {};
