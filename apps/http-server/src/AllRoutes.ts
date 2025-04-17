import SecretRoutes from './modules/secret/secretRoutes';
import AuthRoutes from './modules/auth/authRoutes';


import { isAuthenticated } from './middleware/auth';


const initializeRoutes = (app: any) => {
    app.use('/api', AuthRoutes);
    app.use('/api', isAuthenticated, SecretRoutes);
}



export default initializeRoutes;