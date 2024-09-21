import { NextFunction, Request, Response } from "express";
import { DEPARTMENT } from "../../config/constants/BccDepartments";
import { selectQuery } from "../../data_access/query";
import { pool } from "../../config/database";
import { User } from "../../utils/types/User";

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

export async function getProgramSection(req: Request, res: Response, next: NextFunction) {
    try {

        const program = req.query.program;
        const currentYear = new Date().getFullYear();

        const sqlSectionResult = await selectQuery<Pick<User, 'section'>[]>(pool, 'SELECT DISTINCT section FROM users WHERE course = ? AND (year_active = ? OR is_active = 1) ORDER BY section', [program, currentYear]);
        const sections = sqlSectionResult.map(section => Object.values(section)).flat();

        return res.status(200).json({ sections })

    } catch (error) {
        next(error)
    }
}