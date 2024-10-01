import { Request, Response, NextFunction } from "express";

export function landingPage(req: Request, res: Response, next: NextFunction) {
    try {
        const user = req.session.user;

        res.render("landingPage", { user })
    } catch (error) {
        return next(error)
    }

}

export async function loginPage(req: Request, res: Response, next: NextFunction) {
    try {

        res.render('loginPage')
    } catch (error) {
        next(error)
    }
}