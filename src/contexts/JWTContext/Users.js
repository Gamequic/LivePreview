// Nota
/*
    - Estructurar como hacer las peticiones que no sean auth
    - Poblar la tabla de usuarios, views/users/UserList.jsx
*/

// project imports
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from 'utils/axios';

class UsersService {
    getUsers = async () => {
        try {
            const response = await axios.get("/api/users/");

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

    updateUser = async (userId, body, profiles, uis, uos) => {
        try {
            const response = await axios.put("/api/users/" + userId, {
                matricula: Number(body.matricula),
                name: body.name,
                email: body.email,
                password: body.password,
                profiles,
                uis,
                uos
            });            
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

    exportUsers = async () => {
        try {
            const users = await this.getUsers(); // Get all users
            console.log(users);
    
            // Remove 'password' and 'user_type' fields from each user
            const usersWithoutPasswordAndUserType = users.map(({ password, user_type, ...user }) => user);
    
            // Create the user table, converting profiles and uis to ID strings
            const usersWithProfilesAndUIs = usersWithoutPasswordAndUserType.map((user) => {
                // Convert profiles and uis to a comma-separated list of IDs
                const profileIds = user.profiles ? user.profiles.map(profile => profile.profile_id).join(', ') : '';
                const uiIds = user.uis ? user.uis.map(ui => ui.ui_id).join(', ') : '';
    
                return {
                    ...user,
                    profiles: profileIds,  // Concatenate profile IDs
                    uis: uiIds             // Concatenate UI IDs
                };
            });
    
            // Create the user worksheet
            const userWorksheet = XLSX.utils.json_to_sheet(usersWithProfilesAndUIs);
    
            // Create the profiles and uis tables
            const profiles = [];
            const uis = [];
            users.forEach((user) => {
                if (user.profiles) {
                    user.profiles.forEach((profile) => {
                        profiles.push({
                            userId: user.id,
                            profileId: profile.profile_id,
                            profileName: profile.profile,
                            privCreate: profile.priv_create,
                            privExport: profile.priv_export,
                            privHardDelete: profile.priv_hard_delete,
                            privPrint: profile.priv_print,
                            privRead: profile.priv_read,
                            privSoftDelete: profile.priv_soft_delete,
                            privUpdate: profile.priv_update
                        });
                    });
                }
                if (user.uis) {
                    user.uis.forEach((ui) => {
                        uis.push({
                            userId: user.id,
                            uiId: ui.ui_id,
                            shortName: ui.short_name,
                            ui: ui.ui
                        });
                    });
                }
            });
    
            // Create worksheets for profiles and uis
            const profilesWorksheet = XLSX.utils.json_to_sheet(profiles);
            const uisWorksheet = XLSX.utils.json_to_sheet(uis);
    
            // Create the workbook
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, userWorksheet, "Users");
            XLSX.utils.book_append_sheet(workbook, profilesWorksheet, "Profiles");
            XLSX.utils.book_append_sheet(workbook, uisWorksheet, "UIs");
    
            // Generate the Excel file
            const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    
            // Save the file
            const data = new Blob([excelBuffer], { type: "application/octet-stream" });
            saveAs(data, "users.xlsx"); // Name of the Excel file
        } catch (error) {
            console.error("Error exporting users:", error);
            throw new Error(error);
        }
    };    
}

export default UsersService;