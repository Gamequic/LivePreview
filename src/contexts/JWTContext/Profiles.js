// project imports
import axios from 'utils/axios';

class ProfilesService {
    getProfiles = async () => {
        try {
            const response = await axios.get("/api/profiles/");
            return response.data;
        } catch (error) {
            throw new Error(error);   
        }
    }
}

export default ProfilesService;