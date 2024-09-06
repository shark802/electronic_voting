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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ja2V0SU8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWlkZGxld2FyZXMvc29ja2V0SU8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBR0EsU0FBZ0IsUUFBUSxDQUFDLEVBQVU7SUFDbEMsT0FBTyxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0IsRUFBRSxFQUFFO1FBQzFELEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUN2QixJQUFJLEVBQUUsQ0FBQztJQUNSLENBQUMsQ0FBQztBQUNILENBQUM7QUFMRCw0QkFLQztBQUVELDZDQUE2QztBQUM3Qyw2REFBNkQ7QUFFN0QsMkJBQTJCO0FBRTNCLGtFQUFrRTtBQUNsRSxxQ0FBcUM7QUFFckMsTUFBTSJ9