import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET + '/chats', {
    autoConnect: false,
    withCredentials: true,
});

export default socket;
