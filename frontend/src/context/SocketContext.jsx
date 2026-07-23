import { createContext, useMemo, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

// The socket.io server is mounted at the API host root, not under /api/v1,
// so strip the API path suffix to get the socket origin.
const SOCKET_URL =
    (import.meta.env.VITE_BACKEND_API_URL || '').replace(/\/api\/v1\/?$/, '') ||
    'http://localhost:3000';

export const JOIN_CHANNEL_EVENT = 'join_channel';
export const NEW_MESSAGE_EVENT = 'newMessage';

export const SocketContextProvider = ({ children }) => {
    const [currentChannel, setCurrentChannel] = useState(null);

    // Create a single long-lived connection for the app.
    const socket = useMemo(() => io(SOCKET_URL, { autoConnect: true }), []);

    async function joinChannel(channelId) {
        socket.emit(JOIN_CHANNEL_EVENT, { channelId }, (data) => {
            console.log('Joined channel room', data);
        });
        setCurrentChannel(channelId);
        return channelId;
    }

    return (
        <SocketContext.Provider
            value={{ socket, currentChannel, setCurrentChannel, joinChannel }}
        >
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;
