// assets
import { IconKey, IconBug } from '@tabler/icons-react';

// constant
const icons = { IconKey, IconBug };

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
    id: 'pages',
    title: <>pages</>,
    caption: <>pages-caption</>,
    icon: icons.IconKey,
    type: 'group',
    permission: 'all',
    children: [
        {
            id: 'maintenance',
            title: <>maintenance</>,
            type: 'collapse',
            icon: icons.IconBug,
            permission: 'all',
            children: [
                {
                    id: 'error',
                    title: <>error-404</>,
                    type: 'item',
                    url: '/pages/error',
                    target: true,
                    permission: 'all',
                },
                {
                    id: 'error-500',
                    title: <>error-500</>,
                    type: 'item',
                    url: '/pages/500',
                    target: true,
                    permission: 'all',
                },
                {
                    id: 'coming-soon',
                    title: <>coming-soon</>,
                    type: 'collapse',
                    permission: 'all',
                    children: [
                        {
                            id: 'coming-soon1',
                            title: (
                                <>
                                    <>coming-soon</> 01
                                </>
                            ),
                            type: 'item',
                            url: '/pages/coming-soon1',
                            target: true,
                            permission: 'all',
                        },
                        {
                            id: 'coming-soon2',
                            title: (
                                <>
                                    <>coming-soon</> 02
                                </>
                            ),
                            type: 'item',
                            url: '/pages/coming-soon2',
                            target: true,
                            permission: 'all',
                        }
                    ]
                },
                {
                    id: 'under-construction',
                    title: <>under-construction</>,
                    type: 'item',
                    url: '/pages/under-construction',
                    target: true,
                    permission: 'all',
                }
            ]
        }
    ]
};

export default pages;
