// assets
import ListIcon from '@mui/icons-material/List';
import { IconUsers } from '@tabler/icons-react/';
import DnsIcon from '@mui/icons-material/Dns';
import ArticleIcon from '@mui/icons-material/Article';
import MemoryIcon from '@mui/icons-material/Memory';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import NotificationsIcon from '@mui/icons-material/Notifications';

// ==============================|| MENU ITEMS - Administracion ||============================== //

const Administracion = {
    id: 'Administracion',
    title: <>Administración</>,
    type: 'group',
    permission: 'all',
    children: [
        {
            id: 'Catalogo',
            title: 'Catalogo',
            type: 'collapse',
            icon: ListIcon,
            permission: 'all',
            children: [
                {
                    id: 'Usuarios',
                    title: 'Usuarios',
                    icon: IconUsers,
                    type: 'item',
                    url: '/users',
                    permission: [1, 2, 4],
                }
            ]
        },
        {
            id: 'Servidor',
            title: 'Servidor',
            type: 'collapse',
            icon: DnsIcon,
            permission: [1, 2, 5, 6],
            children: [
                {
                    id: 'Rendimiento',
                    title: 'Rendimiento',
                    icon: MemoryIcon,
                    type: 'item',
                    url: '/servidor/rendimiento',
                    permission: [1, 2, 5],
                },
                {
                    id: 'Logs',
                    title: 'Logs',
                    icon: ArticleIcon,
                    type: 'item',
                    url: '/servidor/logs',
                    permission: [1, 2, 6],
                }
            ]
        },
        {
            id: 'Administracion',
            title: 'Administración',
            type: 'collapse',
            icon: SupervisorAccountIcon,
            permission: [1, 2],
            children: [
                {
                    id: 'Notificaciones',
                    title: 'Notificaciones',
                    icon: NotificationsIcon,
                    type: 'item',
                    url: '/administracion/notificaciones',
                    permission: [1],
                }
            ]
        }
    ]
};

export default Administracion;
