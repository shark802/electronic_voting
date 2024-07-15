import { Request, Response, NextFunction } from "express";

export async function creatUser(req: Request, res: Response, next: NextFunction) {
    try {
        
        const {} = req.body

    } catch (error) {
        next(error);
    }
}