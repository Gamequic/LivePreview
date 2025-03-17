// project imports
import axios from 'utils/axios';

class NotificationService {
    getNotificacions = async ( userID ) => {
        try {
            const response = await axios.get("/api/notifications/");

            // Darlas de reciente a la ultima
            return response.data.reverse();
        } catch (error) {
            throw new Error(error);   
        }
    }

    ReadMessage = async ( MessageId ) => {
        try {
            const response = await axios.put("/api/notifications/markAsSeen/" + MessageId);

            return response.data
        } catch (error) {
            throw new Error(error);   
        }
    }

    // Conexion websocket que recibe los datos cuando llega una notificacion
    WebSocketNotifications = async ( UserID, handleOnNotification ) => {
        const socketUrl = `${import.meta.env.VITE_APP_API_WEBSOCKET}api/notifications/live?userID=${UserID}`;
        const socket = new WebSocket(socketUrl);

        socket.onopen = () => {
            console.log('WebSocket connection opened');
            
            // Send the token as an authentication message after connection is established
            const token = localStorage.getItem('serviceToken');
            socket.send(JSON.stringify(token));
        
            socket.onclose = () => {
                console.log('WebSocket connection closed');
            };

            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                handleOnNotification(data);
            }
        };

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