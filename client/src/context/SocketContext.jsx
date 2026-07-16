import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { SOCKET_URL } from '../utils/config';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Connect to the backend WebSocket. SOCKET_URL resolves from runtime
        // config / build env / local-dev default (see utils/config.js).
        const socketInstance = io(SOCKET_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        socketInstance.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        socketInstance.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
 
