import dotenv from "dotenv";

dotenv.config();

export const config = {
  REACT_URL: process.env.REACT_URL || "http://localhost:3000",
  SERVER_URL: process.env.SERVER_URL || "http://localhost:5000",
    // PORT: 5000,
    // JWT_SECRET: process.env.JWT_SECRET,
    // EMAIL: process.env.EMAIL || "",
    // PASSWORD: process.env.PASSWORD || "",
    // RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || "",
    // RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "",
    // RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || ""



  PORT:5000,
JWT_SECRET:"kdfajsdklf",
EMAIL:"rdxmohitkumar786@gmail.com",
PASSWORD:"asdjfklasdf",
RAZORPAY_KEY_ID:"rzp_test_ZcWkP5EHbqv3jK",
RAZORPAY_KEY_SECRET:"KtKSmTYfC9U5XMaJhGJiruoP",
RAZORPAY_WEBHOOK_SECRET:"webhook_secret"
};
