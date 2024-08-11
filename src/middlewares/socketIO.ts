import { Request, Response, NextFunction } from "express";
import { Server } from "socket.io";

export function socketIO(io: Server) {
	return (req: Request, res: Response, next: NextFunction) => {
		res.locals.socket = io;
		next();
	};
}

// import express, { Router } from "express";
// import { UnauthorizedError } from "../utils/customErrors";

// const router = Router();

// router.post("/socketRoute", (req, res, next: NextFunction) => {
// 	const io = req.app.get("socket");

// });
