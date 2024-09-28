"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketIO = void 0;
function socketIO(io) {
    return (req, res, next) => {
        res.locals.socket = io;
        next();
    };
}
exports.socketIO = socketIO;
