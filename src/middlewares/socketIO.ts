import { Request, Response, NextFunction } from "express";
import { Server } from "socket.io";

export function socketIO(io: Server) {

	let clientUUID: Record<string, string> = {};

	io.on('connection', (socket) => {

		const uuid = socket.handshake.query.uuid;
		if (uuid) {

			const uuidExist = Object.values(clientUUID).find((value) => {
				return value === uuid
			});

			if (!uuidExist) {
				clientUUID[socket.id] = uuid as string;

				io.emit('client-connected', clientUUID);
			}

			socket.on('disconnect', () => {
				if (clientUUID[socket.id]) {
					io.emit('client-disconnected', clientUUID[socket.id]);
					delete clientUUID[socket.id];
				}
			});
		};
	});

	return (req: Request, res: Response, next: NextFunction) => {
		res.locals.io = io;
		next();
	};
}
