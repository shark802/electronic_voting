"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketIO = void 0;
function socketIO(io) {
    let clientUUID = {};
    io.on('connection', (socket) => {
        const uuid = socket.handshake.query.uuid;
        if (uuid) {
            clientUUID[socket.id] = uuid;
            io.emit('client-connected', clientUUID);
        }
        console.log(clientUUID);
        socket.on('disconnect', () => {
            io.emit('client-disconnected', clientUUID[socket.id]);
            delete clientUUID[socket.id];
        });
    });
    return (req, res, next) => {
        res.locals.io = io;
        next();
    };
}
exports.socketIO = socketIO;
