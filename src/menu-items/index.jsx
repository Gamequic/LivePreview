import home from './home';
import Administracion from './Administracion';
import pages from './pages';

// ==============================|| MENU ITEMS ||============================== //

function processMenuItems(menuItems, profilesId, depth = 0, maxDepth = 3) {
    if (depth >= maxDepth) return;

    let processedMenuItems = []

    menuItems.forEach( menuItem => {
        if (menuItem.permission === 'all') {
            processedMenuItems.push(menuItem);
        } else {
            menuItem.permission.forEach(permissionId => {
                if (profilesId.includes(permissionId)) {    // Check is the users has access
                    // If the menuItem is not already in the processedMenuItems array, add it
                    if (!processedMenuItems.some(item => JSON.stringify(item) === JSON.stringify(menuItem))) {
                        processedMenuItems.push(menuItem);
                    }
                }
            });
        }

        // Check if is has children property and contitue recursively
        if (menuItem.children && Array.isArray(menuItem.children)) {
            menuItem.children = processMenuItems(menuItem.children, profilesId, menuItems, depth + 1, maxDepth);
        }
    })

    return processedMenuItems;
}

const generateMenuItems = (user) => {
    if (user && user?.Profiles) {
        const menuItems = {
            items: processMenuItems([home, Administracion, pages], user.Profiles)
        };

        return menuItems;
    }

    return {
        items: []
    }
};

export default generateMenuItems;
