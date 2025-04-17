import dotenv from "dotenv";

dotenv.config();

export const config = {
    JWT_SECRET: "secret",
    PORT: 5000,
    REACT_URL: "http://localhost:3000",
    SERVER_URL: "http://localhost:5000",
    ENCRYPTION_KEY: "2ea44d1a4985273bc84780d7cb88e4ab028e839e2d5a77b5546a0dc722c9afb5",
    IV_LENGTH: 16,
    EMAIL: "kumarmohit08004@gmail.com",
    PASSWORD: "qzjq lbis ylof gyot",
    SESSION_KEY: "your-secret-key",
    NODE_ENV: "development",
}