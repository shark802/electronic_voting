import { Request, Response, NextFunction } from "express";
import { Server } from "socket.io";

export function socketIO(io: Server) {
	return (req: Request, res: Response, next: NextFunction) => {
		res.locals.socket = io;
		next();
	};
}