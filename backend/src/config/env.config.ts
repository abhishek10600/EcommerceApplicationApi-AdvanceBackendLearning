import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

export const NODE_ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT || 4001;
export const DATABASE_URL = process.env.DATABASE_URL;
export const FRONTEND_URL = process.env.FRONTEND_URL;
