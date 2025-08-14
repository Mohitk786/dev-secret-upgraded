import dotenv from "dotenv";
import path from "path";

// Load environment variables from the root 
const envPath = path.resolve(process.cwd(), '../../.env');
dotenv.config({ path: envPath });

if (!process.env.PORT) {
  dotenv.config();
}

export const config = {
  REACT_URL: process.env.REACT_URL,
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || "default_jwt_secret",
  EMAIL: process.env.EMAIL || "",
  PASSWORD: process.env.PASSWORD || "",
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || "",
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "",
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "",
};

