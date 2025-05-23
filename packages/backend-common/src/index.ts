import dotenv from "dotenv";

dotenv.config();

export const config = {
    REACT_URL: process.env.REACT_URL || "http://localhost:3000",
    SERVER_URL: process.env.SERVER_URL || "http://localhost:8080",
    PORT: process.env.PORT || 8080,
    JWT_SECRET: process.env.JWT_SECRET || 'mysecret',
    EMAIL:"rdxmohitkumar786@gmail.com",
    PASSWORD:"ebmk qlqj cbya tvhl",
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "rzp_test_8x1v0j2c4lq3gk",
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "6a0b2e3f1c4d5e7f8a9b0c1d2e3f4g5h",
    RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || "6a0b2e3f1c4d5e7f8a9b0c1d2e3f4g5h",    
    
   
}
