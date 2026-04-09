import 'dotenv/config';

const appEnv = {
  NODE_ENV: process.env.NODE_ENV,
  API_URL: process.env.API_URL,
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
  AUTH_URL: process.env.AUTH_URL,
};

export default appEnv;
