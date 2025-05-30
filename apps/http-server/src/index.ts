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
import invitesRoutes from './modules/invites/invitesRoutes';
import paymentRoutes from './modules/payment/paymentController';
import utilityRoutes from './modules/utilities/utilityRoutes';
import { isAuthenticated } from './middleware/auth';
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
app.use('/api', isAuthenticated,utilityRoutes);
app.use('/api', isAuthenticated, vaultRoutes);
app.use('/api', isAuthenticated, secretRoutes);  //me wala route yaha par hai
app.use('/api/trash', isAuthenticated, trashRoutes);
app.use('/api/invites', isAuthenticated, invitesRoutes);
app.use('/api', isAuthenticated, paymentRoutes);

app.listen(config.PORT, () => {
  console.log(`Server running on ${config.SERVER_URL}`);
});

