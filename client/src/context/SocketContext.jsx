import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Connect to backend URL
        // In development, Vite proxy handles /api, but socket.io needs explicit URL if ports differ
        // Or we can rely on relative path if proxy is set up for websockets too
        // For simplicity in this setup, we'll point to the backend port directly
        const socketInstance = io('http://localhost:5001', {
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
 
