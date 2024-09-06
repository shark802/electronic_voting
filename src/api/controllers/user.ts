import { NextFunction, Request, Response } from "express";
import { BadRequestError, ConflictError, NotFoundError } from "../../utils/customErrors";
import { insertQuery, selectQuery, updateQuery } from "../../data_access/query";
import { User } from "../../utils/types/User";
import { pool } from "../../config/database";
import { ResultSetHeader } from "mysql2";
import csv from 'csvtojson';
import fs from "fs";
import { CsvUserObject } from "../../utils/types/CsvUserObject";
import { Worker } from "worker_threads";
import path from "path";
import { importUsersToDatabase } from "../../utils/importUserToDatabase";

export async function newUserFunction(req: Request, res: Response, next: NextFunction) {
    try {
        const { userObject, userRoles } = req.body;
        if (!userObject) throw new BadRequestError('Missing object of user data');
        if (!userRoles) throw new BadRequestError('Missing object of user roles');

        Object.keys(userObject).forEach(key => {
            if (typeof userObject[key] === 'string') {
                userObject[key] = userObject[key].toUpperCase();
            }
        });

        const { id_number, firstname, lastname, course } = userObject;
        const { voter, program_head, admin } = userRoles

        if (!id_number) throw new BadRequestError('Missing user id number');
        if (!firstname) throw new BadRequestError('Missing user firstname');
        if (!lastname) throw new BadRequestError('Missing user lastname');
        if (!course) throw new BadRequestError('Missing user course');
        if (!('voter' in userRoles)) throw new BadRequestError('Missing user voter role');
        if (!('program_head' in userRoles)) throw new BadRequestError('Missing user program head role');
        if (!('admin' in userRoles)) throw new BadRequestError('Missing user admin role');


        const [user] = await selectQuery<User>(pool, 'SELECT * FROM users WHERE id_number = ? LIMIT 1', [id_number]);
        if (user) throw new ConflictError(`${userObject.id_number} already exist`);

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            await connection.execute('INSERT INTO users (id_number, firstname, lastname, course) VALUES(?, ?, ?, ?)', [id_number, firstname, lastname, course]);
            await connection.execute('INSERT INTO roles (id_number, voter, program_head, admin) VALUES(?, ?, ?, ?)', [id_number, voter, program_head, admin]);
            await connection.commit();

            return res.status(200).json({ message: 'Succesfully added new user' });
        } catch (error) {
            await connection.rollback();
        } finally {
            await connection.release();
        }

    } catch (error) {
        next(error)
    }
}

export async function updateUserFunction(req: Request, res: Response, next: NextFunction) {
    try {
        const idNumber = req.params.id;
        const { userObject, userRoles } = req.body;
        if (!userObject) throw new BadRequestError('Missing object of user data');
        if (!userRoles) throw new BadRequestError('Missing object of user roles');

        Object.keys(userObject).forEach(key => {
            if (typeof userObject[key] === 'string') {
                userObject[key] = userObject[key].toUpperCase();
            }
        });

        const { id_number, firstname, lastname, course } = userObject;
        const { voter, program_head, admin } = userRoles

        if (!id_number) throw new BadRequestError('Missing user id number');
        if (!firstname) throw new BadRequestError('Missing user firstname');
        if (!lastname) throw new BadRequestError('Missing user lastname');
        if (!course) throw new BadRequestError('Missing user course');
        if (!('voter' in userRoles)) throw new BadRequestError('Missing user voter role');
        if (!('program_head' in userRoles)) throw new BadRequestError('Missing user program head role');
        if (!('admin' in userRoles)) throw new BadRequestError('Missing user admin role');

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const [userUpdateResult] = await connection.execute<ResultSetHeader>('UPDATE users SET firstname = ?, lastname = ?, course = ? WHERE id_number = ?', [firstname, lastname, course, idNumber]);
            const [userRolesUpdateResult] = await connection.execute<ResultSetHeader>('UPDATE roles SET voter = ?, program_head = ?, admin = ? WHERE id_number = ?', [voter, program_head, admin, idNumber]);
            await connection.commit();

            if (userUpdateResult.affectedRows <= 0 || userRolesUpdateResult.affectedRows <= 0) throw new NotFoundError('No user updated, please check if user exist');

            return res.status(200).json({ message: 'Update successfull' });
        } catch (error) {
            await connection.rollback();
        } finally {
            await connection.release();
        }

        // const userUpdateResult = await updateQuery(pool, 'UPDATE users SET firstname = ?, lastname = ?, course = ? WHERE id_number = ?', [firstname, lastname, course, idNumber]);
        // const userRolesUpdateResult = await updateQuery(pool, 'UPDATE roles SET voter = ?, program_head = ?, admin = ? WHERE id_number = ?', [voter, program_head, admin, idNumber]);


    } catch (error) {
        next(error)
    }
}

export async function getUserByIdNumber(req: Request, res: Response, next: NextFunction) {
    try {
        const idNumber = req.params.id;
        if (!idNumber) throw new BadRequestError('Id number is missing');

        const sqlQuery = 'SELECT * FROM users JOIN roles ON users.id_number = roles.id_number WHERE users.id_number = ? LIMIT 1'
        const [user] = await selectQuery<User>(pool, sqlQuery, [idNumber]);
        return res.status(200).json({ user });
    } catch (error) {
        next(error)
    }
}

export async function importUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const usersFile = req.file;
        if (!usersFile) throw new BadRequestError('Users data file is not provided');

        const userCsvFile: CsvUserObject[] = await csv().fromFile(usersFile.path);
        fs.unlinkSync(usersFile.path);

        const importProcessResult = await importUsersToDatabase(userCsvFile);


        res.status(200).json({ message: `Successfully processed ${importProcessResult} users.` })

    } catch (error) {
        next(error);
    }
}