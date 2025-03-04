// This is example of menu item without group for horizontal layout. There will be no children.

// assets
import { IconBrandChrome } from '@tabler/icons-react';

// ==============================|| MENU ITEMS - HOME ||============================== //

const icons = {
    IconBrandChrome
};
const home = {
    id: 'Panel principal',
    title: <>Panel principal</>,
    icon: icons.IconBrandChrome,
    type: 'group',
    url: '/home',
    permission: 'all'
};

export default home;
