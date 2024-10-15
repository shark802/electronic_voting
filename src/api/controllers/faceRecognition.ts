import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv'
import { NotFoundError } from '../../utils/customErrors';
dotenv.config()

export async function getFaceRecognitionServiceDomain(req: Request, res: Response, next: NextFunction) {
    try {

        const faceServiceDomain = process.env.FACE_RECOGNITION_SERVICE_DOMAIN;
        if (!faceServiceDomain) throw new NotFoundError('Face recognition service domain not found!');

        res.status(200).json({ faceServiceDomain });
    } catch (error) {
        next(error)
    }
}