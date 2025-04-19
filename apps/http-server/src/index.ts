import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from '@secret-vault/backend-common/config';
import cookieParser from 'cookie-parser';
import authRoutes from './modules/auth/authRoutes';
import secretRoutes from './modules/secret/secretRoutes';
import vaultRoutes from './modules/vault/vaultRoutes';
import trashRoutes from './modules/trash/trashRoutes';
dotenv.config();

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: config.REACT_URL,
    credentials: true,
}));

app.use('/api', authRoutes);
app.use('/api', vaultRoutes);
app.use('/api', secretRoutes);  
app.use('/api/trash', trashRoutes);

app.listen(config.PORT, () => {
  console.log(`Server running on http://${config.SERVER_URL}:${config.PORT}`);
});

