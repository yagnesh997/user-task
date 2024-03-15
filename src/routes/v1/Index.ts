import express from 'express'
const router = express.Router();
import AuthRoute from './AuthRoute'

const defaultRoutes = [
    {
        path: '/auth',
        route: AuthRoute
    }
];

router.get('/', (_, res) => {
    res.send({ message: `Server is running..` })
});

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
