import dotenv from "dotenv";

dotenv.config();

export const config = {
    JWT_SECRET: "secret",
    PORT: 5000,
    REACT_URL: "http://localhost:3000",
    SERVER_URL: "http://localhost:5000",
    EMAIL: "kumarmohit08004@gmail.com",
    PASSWORD: "qzjq lbis ylof gyot",
    SESSION_KEY: "your-secret-key",
    NODE_ENV: "development",
    RAZORPAY_WEBHOOK_SECRET: "my_secret",
    RAZORPAY_KEY_ID: "rzp_test_7CveMu5u6Bc9PZ",
    RAZORPAY_KEY_SECRET: "l7dezZNHSTg18DOkK8KCvhmg",
    RAZORPAY_WEBHOOK_URL: "https://ce84-122-176-1-23.ngrok-free.app/api/payment/webhook",
}