import dotenv from "dotenv";

dotenv.config();

export const config = {
   EMAIL: process.env.EMAIL,
   PASSWORD: process.env.PASSWORD,
   REACT_URL: process.env.REACT_URL,    
   SERVER_URL: process.env.SERVER_URL,
   JWT_SECRET: process.env.JWT_SECRET,
   PORT: process.env.PORT,
   NODE_ENV: process.env.NODE_ENV,
   SESSION_KEY: process.env.SESSION_KEY,
}