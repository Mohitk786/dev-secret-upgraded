import dotenv from "dotenv";

dotenv.config();

export const config = {
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    REACT_URL: process.env.REACT_URL,
    SERVER_URL: process.env.SERVER_URL,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    IV_LENGTH: process.env.IV_LENGTH,
    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD,
    SESSION_KEY: process.env.SESSION_KEY,
    NODE_ENV: process.env.NODE_ENV,
}