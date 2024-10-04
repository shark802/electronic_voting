import { Request, Response, NextFunction } from "express";
// import { publicIp, publicIpv4, publicIpv6 } from 'public-ip';

export async function landingPage(req: Request, res: Response, next: NextFunction) {
    try {
        const user = req.session.user;

        console.log('req.ip: ', req.ip);

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