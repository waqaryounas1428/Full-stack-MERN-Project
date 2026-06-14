import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Connect to backend server
        const newSocket = io('http://localhost:5000', {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: Infinity,
            timeout: 20000,
            transports: ['websocket', 'polling'],
            upgrade: true,
            rememberUpgrade: true,
            autoConnect: true
        });

        newSocket.on('connect', () => {
            console.log('✅ Socket connected:', newSocket.id);
            setIsConnected(true);
        });

        newSocket.on('disconnect', (reason) => {
            console.log('❌ Socket disconnected:', reason);
            setIsConnected(false);
            
            if (reason === 'io server disconnect') {
                newSocket.connect();
            }
        });

        newSocket.on('connect_error', (error) => {
            console.error('🔴 Connection error:', error.message);
            setIsConnected(false);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        console.warn('useSocket must be used within SocketProvider');
    }
    return context;
};
