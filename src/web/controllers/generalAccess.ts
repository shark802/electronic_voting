import { Request, Response, NextFunction } from "express";

export function landingPage(req: Request, res: Response, next: NextFunction) {
    try {
        res.render("landingPage")
    } catch (error) {
        return next(error)
    }

}