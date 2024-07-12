import { Request, Response, NextFunction } from "express";

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if(!req.session.user && !req.session) {
        return res.redirect("/landingPage");
    };

    return next();
}