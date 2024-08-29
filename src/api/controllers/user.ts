import { NextFunction, Request, Response } from "express";
import { BadRequestError, ConflictError, NotFoundError } from "../../utils/customErrors";
import { insertQuery, selectQuery, updateQuery } from "../../data_access/query";
import { User } from "../../utils/types/User";
import { pool } from "../../config/database";


export async function newUserFunction(req: Request, res: Response, next: NextFunction) {
    try {

        const { idNumber, course, firstname, lastname } = req.body;

        if (!idNumber) throw new BadRequestError('Missing Id number');
        if (!course) throw new BadRequestError('Missing course');
        if (!firstname) throw new BadRequestError('Missing firstname');
        if (!lastname) throw new BadRequestError('Missing lastname');

        const [user] = await selectQuery<User>(pool, 'SELECT * FROM users WHERE id_number = ? LIMIT 1', [idNumber]);
        if (user) throw new ConflictError(`User ${idNumber} already created`);

        const result = await insertQuery(pool, 'INSERT INTO users (id_number, firstname, lastname, course) VALUES(?, ?, ?, ?)', [idNumber, firstname, lastname, course]);
        if (result.affectedRows < 1) throw new Error("Adding user failed");

        return res.status(200).json({ message: 'Succesfully added new user' });
    } catch (error) {
        next(error)
    }
}

export async function updateUserFunction(req: Request, res: Response, next: NextFunction) {
    try {

        const { idNumber, userObject, userRoles } = req.body;

        if (!idNumber) throw new BadRequestError('User id number is missing');
        if (!userObject) throw new BadRequestError('User data need for update is missing');
        if (!userRoles) throw new BadRequestError('User roles object is missing');

        const userUpdateResult = await updateQuery(pool, 'UPDATE users SET = ? WHERE id_number = ?', [userObject, idNumber]);
        const userRolesUpdateResult = await updateQuery(pool, 'UPDATE roles SET = ? WHERE id_number = ?', [userRoles, idNumber]);

        if (userUpdateResult.affectedRows <= 0 || userRolesUpdateResult.affectedRows <= 0) throw new NotFoundError('No user updated, please check if user exist');

        return res.status(200).json({ messasge: 'Update successfull' });
    } catch (error) {
        next(error)
    }
}