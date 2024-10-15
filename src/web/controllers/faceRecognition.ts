import { NextFunction, Request, Response } from "express";

export async function faceRegisterPage(req: Request, res: Response, next: NextFunction) {
    try {

        res.render('face-recognition/face-register')

    } catch (error) {
        next(error)
    }
}