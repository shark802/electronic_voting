import { NextFunction, Request, Response } from "express";
import { DEPARTMENT } from "../../config/constants/BccDepartments";

export async function getDepartmentObject(req: Request, res: Response, next: NextFunction) {
    try {

        return res.status(200).json({ DEPARTMENT })
    } catch (error) {
        next(error)
    }
}