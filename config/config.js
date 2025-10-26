import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 8000,
  apiKey: process.env.API_KEY,
  capitalOneBaseUrl: process.env.CAPITAL_ONE_BASE_URL
};