import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const DEV_DB_URL = process.env.DEV_DB_URL;
export const PROD_DB_URL = process.env.PROD_DB_URL;
export const JWT_SECRET = process.env.JWT_SECRET || "xnxx";
export const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME || "1d";
export const MAIL_ID = process.env.MAIL_ID;
 export const MAIL_PASSWORD = process.env.MAIL_PASSWORD;