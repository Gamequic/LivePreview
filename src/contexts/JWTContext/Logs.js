// project imports
import axios from 'utils/axios';

class LogsService {
    getLogs = async ( ) => {
        try {
            const response = await axios.get("/api/logs/structure");

            return response.data;
        } catch (error) {
            throw new Error(error);   
        }
    }

    getLog = async ( date ) => {
        try {
            const response = await axios.get("/api/logs/view/" + date);

            return response.data;
        } catch (error) {
            throw new Error(error);   
        }
    }

    getZipLog = async ( logsDir ) => {
        console.log(logsDir)
        try {
            const response = await axios.get("/api/logs/download?path=" + logsDir);

            return response.data;
        } catch (error) {
            throw new Error(error);   
        }
    }
}

export default LogsService;