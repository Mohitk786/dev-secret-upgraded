import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from '@secret-vault/backend-common/config';

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: config.REACT_URL,
    credentials: true,
}));

app.use(session({
    secret: config.SESSION_KEY || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
    secure: config.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, 
    },
  }));


app.listen(config.PORT, () => {
  console.log(`Server running on http://localhost:${config.PORT}`);
});
