import { lazy } from 'react';

// project imports
import AuthGuard from 'utils/route-guard/AuthGuard';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// sample page routing
const Home = Loadable(lazy(() => import('views/home')));
const UserList = Loadable(lazy(() => import('views/users/Read')));
const UserUpdate = Loadable(lazy(() => import('views/users/Update')));
const UserCreate = Loadable(lazy(() => import('views/users/Create')));

// Servidor
const Logs = Loadable(lazy(() => import('views/servidor/logs')));
const Rendimiento = Loadable(lazy(() => import('views/servidor/Rendimiento')));

// Administracion
const Notificaciones = Loadable(lazy(() => import('views/Administracion/Notificaciones')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: '/',
            element: <Home />
        },
        {
            path: '/home',
            element: <Home />
        },
        {
            path: '/users',
            element: <UserList />
        },
        {
            path: '/users/update/:userId',
            element: <UserUpdate />
        },
        {
            path: '/users/create/',
            element: <UserCreate />
        },
        {
            path: '/servidor/logs',
            element: <Logs />
        },
        {
            path: '/servidor/rendimiento',
            element: <Rendimiento />
        },
        {
            path: '/administracion/notificaciones',
            element: <Notificaciones />
        },
    ]
};

export default MainRoutes;
