"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketIO = void 0;
function socketIO(io) {
    let clientUUID = {};
    io.on('connection', (socket) => {
        const uuid = socket.handshake.query.uuid;
        if (uuid) {
            const uuidExist = Object.values(clientUUID).find((value) => {
                return value === uuid;
            });
            if (!uuidExist) {
                clientUUID[socket.id] = uuid;
                io.emit('client-connected', clientUUID);
            }
            socket.on('disconnect', () => {
                if (clientUUID[socket.id]) {
                    io.emit('client-disconnected', clientUUID[socket.id]);
                    delete clientUUID[socket.id];
                }
            });
        }
        ;
    });
    return (req, res, next) => {
        res.locals.io = io;
        next();
    };
}
exports.socketIO = socketIO;
