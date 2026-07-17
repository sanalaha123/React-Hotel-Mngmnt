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
        //
        // On Choreo the backend sits behind a base path (e.g. /luxurystay/server/v1.0).
        // socket.io-client treats a path in the URL as a *namespace*, not a prefix,
        // so we split the origin from the base path and pass the base path (plus
        // /socket.io) via the `path` option. Locally this resolves to '/socket.io'.
        let target = SOCKET_URL;
        let path = '/socket.io';
        try {
            const url = new URL(SOCKET_URL, window.location.origin);
            target = url.origin;
            path = `${url.pathname.replace(/\/$/, '')}/socket.io`;
        } catch {
            // SOCKET_URL wasn't a full URL; fall back to defaults above.
        }

        const socketInstance = io(target, {
            path,
            withCredentials: true,
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5
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
 
