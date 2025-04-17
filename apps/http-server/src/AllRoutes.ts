import SecretRoutes from './modules/secret/secretRoutes';


import { isAuthenticated } from './middleware/auth';


const initializeRoutes = (app: any) => {
    app.use('/api', isAuthenticated, SecretRoutes);
}



export default initializeRoutes;