import { NextFunction, Request, Response } from "express";
import { DEPARTMENT } from "../../config/constants/BccDepartments";
import { insertQuery, selectQuery, updateQuery } from "../../data_access/query";
import { pool } from "../../config/database";
import { User } from "../../utils/types/User";
import { Department } from "../../utils/types/Department";
import { BadRequestError, ConflictError, NotFoundError } from "../../utils/customErrors";

export async function addDepartment(req: Request, res: Response, next: NextFunction) {
    try {
        const { departmentCode } = req.body;

        if (!departmentCode || departmentCode === "") throw new BadRequestError("Department code is required");

        const department = await selectQuery<Department>(pool, 'SELECT * FROM departments WHERE department_code = ? AND deleted_at IS NULL', [departmentCode]);
        if (department.length > 0) throw new ConflictError(`${departmentCode} already exists`);

        await insertQuery(pool, 'INSERT INTO departments (department_code) VALUES (?)', [departmentCode]);
        return res.status(200).json({ message: "Department added successfully" })

    } catch (error) {
        next(error)
    }
}

export async function getAllDepartments(req: Request, res: Response, next: NextFunction) {
    try {
        const departments = await selectQuery<Department>(pool, 'SELECT * FROM departments WHERE deleted_at IS NULL');
        return res.status(200).json({ departments })
    } catch (error) {
        next(error)
    }
}

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

export async function removeDepartment(req: Request, res: Response, next: NextFunction) {
    try {
        const departmentId = req.params.id;

        if (!departmentId || departmentId === "") throw new BadRequestError("Department code is required");

        const sqlRemoveDepartment = await updateQuery(pool, 'UPDATE departments SET deleted_at = ? WHERE id = ?', [new Date(), departmentId]);
        if (sqlRemoveDepartment.affectedRows === 0) throw new NotFoundError(`Department ${departmentId} not found`);
        return res.status(200).json({ message: "Department removed successfully" })
    } catch (error) {
        next(error)
    }
}

export async function setDepartmentMaxSenatorVote(req: Request, res: Response, next: NextFunction) {
    try {
        const { departmentId, maxVote } = req.body;

        if (!departmentId) throw new BadRequestError("Department is required");
        if (!maxVote) throw new BadRequestError("Max vote is required");

        const sqlSetDepartmentMaxSenatorVote = await updateQuery(pool, 'UPDATE departments SET max_select_senator = ? WHERE id = ?', [maxVote, departmentId]);
        if (sqlSetDepartmentMaxSenatorVote.affectedRows === 0) throw new NotFoundError(`Department ${departmentId} not found`);

        return res.status(200).json({ message: "Department max senator vote set successfully" })
    } catch (error) {
        console.log(error);
        next(error)
    }
}
