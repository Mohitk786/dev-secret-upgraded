import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from '@secret-vault/backend-common/config';
import initializeRoutes from './AllRoutes';
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

console.log(config.REACT_URL);

app.use(cors({
    origin: config.REACT_URL,
    credentials: true,
}));

initializeRoutes(app)


app.listen(config.PORT, () => {
  console.log(`Server running on http://localhost:${config.PORT}`);
});
