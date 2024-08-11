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
// import express, { Router } from "express";
// import { UnauthorizedError } from "../utils/customErrors";
// const router = Router();
// router.post("/socketRoute", (req, res, next: NextFunction) => {
// 	const io = req.app.get("socket");
// });
