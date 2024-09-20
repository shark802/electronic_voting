import { NextFunction, Request, Response } from "express";
import { DEPARTMENT } from "../../config/constants/BccDepartments";

export async function getDepartmentObject(req: Request, res: Response, next: NextFunction) {
    try {

        return res.status(200).json({ DEPARTMENT })
    } catch (error) {
        next(error)
    }
}

export async function getDepartmentPrograms(req: Request, res: Response, next: NextFunction) {
    try {
        const department = req.query.department;

        const programs = Object.values(DEPARTMENT[(department as keyof typeof DEPARTMENT)]);

        return res.status(200).json({ programs })

    } catch (error) {
        next(error)
    }
}