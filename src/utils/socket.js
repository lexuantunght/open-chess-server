const { Server } = require('socket.io');
const verifyToken = require('../middleware/socket-authorize');
const PlaySocketManager = require('./play-socket-manager');

const initSocket = (server, corsOptions) => {
    const io = new Server(server, { cors: corsOptions, transports: ['websocket'] });
    io.use(verifyToken).on('connection', (socket) => {
        console.log(`A user connected with id: ${socket.id}, userId: ${socket.userId}`);
        socket.on('disconnect', () => {
            console.log(`A user disconnected with id: ${socket.id}, userId: ${socket.userId}`);
        });
        PlaySocketManager.setupEvent(socket, io);
    });
};

module.exports = initSocket;