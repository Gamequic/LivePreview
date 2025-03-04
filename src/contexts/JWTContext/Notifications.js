// project imports
import axios from 'utils/axios';

class NotificationService {
    getNotificacions = async ( userID ) => {
        try {
            const response = await axios.get("/api/notifications/" + userID);

            // Darlas de reciente a la ultima
            return response.data.reverse();
        } catch (error) {
            throw new Error(error);   
        }
    }

    ReadMessage = async ( MessageId ) => {
        try {
            const response = await axios.get("/api/notifications/read/" + MessageId);

            return response.data
        } catch (error) {
            throw new Error(error);   
        }
    }

    // Conexion websocket que recibe los datos cuando llega una notificacion
    WebSocketNotifications = async ( UserID, handleOnNotification ) => {
        const socketUrl = `${import.meta.env.VITE_APP_API_WEBSOCKET}api/ws/notifications?userID=${UserID}`;
        const socket = new WebSocket(socketUrl);

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            handleOnNotification(data);
        }

        // Retornar una función de limpieza para cerrar el WebSocket
        const cleanup = () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.close();
                console.log("WebSocket cerrado correctamente.");
            }
        };

        return { socket, cleanup };
    }
}

export default NotificationService;