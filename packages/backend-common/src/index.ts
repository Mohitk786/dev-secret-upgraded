import dotenv from "dotenv";

dotenv.config();

export const config = {
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
  RAZORPAY_WEBHOOK_URL: process.env.RAZORPAY_WEBHOOK_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT,
  REACT_URL: process.env.REACT_URL,
  SERVER_URL: process.env.SERVER_URL,
  EMAIL: process.env.EMAIL,
  PASSWORD: process.env.PASSWORD,
  SESSION_KEY: process.env.SESSION_KEY,
  NODE_ENV: process.env.NODE_ENV,
}

