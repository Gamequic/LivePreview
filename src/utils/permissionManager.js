// proyect imports

import useAuth from 'hooks/useAuth';

const permissionManager = ({ profiles = [] }) => {
    const { user } = useAuth();

    if (user) {
        let isAllowTo = false;

        profiles.forEach(profileIdAllow => {
            let profile = user.Profiles.filter(profile => profile.profile_id === profileIdAllow)[0]
            if (profile != undefined) {
                // Check if has the profile
                if (permission === "exist") { 
                    isAllowTo = true;
                }
            }
        })

        return isAllowTo;
    }

    return false;
}

export default permissionManager;
