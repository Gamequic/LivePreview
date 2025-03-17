// Nota
/*
    - Estructurar como hacer las peticiones que no sean auth
    - Poblar la tabla de usuarios, views/users/UserList.jsx
*/

// project imports
import axios from 'utils/axios';

class UsersService {
    getUsers = async () => {
        try {
            const response = await axios.get("/api/users/");


            response.data = response.data.map(obj => ({
                ...obj,
                id: obj.ID
            }));
              

            return response.data;
        } catch (error) {
            throw new Error(error);   
        }
    }

    getUser = async (userId) => {
        try {
            const response = await axios.get("/api/users/" + userId);

            return response.data;
        } catch (error) {
            throw new Error(error);   
        }
    }

    softDeleteUser = async (userId) => {
        try {
            const response = await axios.delete("/api/users/" + userId);

            return response.data;
        } catch (error) {
            throw new Error(error);   
        }
    }

    hardDeleteUser = async (userId) => {
        try {
            const response = await axios.delete("/api/users/delete_completely/" + userId);
            
            return response.data;
        } catch (error) {
            throw new Error(error);   
        }
    }

    updateUser = async (user) => {
        try {
            const response = await axios.put("/api/users/", user);            
        } catch (error) {
            throw new Error(error);
        }
    }

    createUser = async (body, profiles, uis, uos) => {
        try {
            const response = await axios.post("/api/users", {
                matricula: Number(body.matricula),
                name: body.name,
                email: body.email,
                password: body.password,
                profiles,
                uis,
                uos
            });
            return response.data;
        } catch (error) {
            if (error.response) {
                throw error.response.data;
            } else {
                throw { error: "An unexpected error occurred." };
            }
        }
    };
}

export default UsersService;