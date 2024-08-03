import { Request, Response, NextFunction } from "express";
import { BadRequestError, UnauthorizedError } from "../../utils/customErrors";
import { TechnopalApiObject } from "../../utils/types/TechnopalApiObject";
import { convertApiObjectToUser } from "../../utils/convertApiObjectToUser";
import { pool } from "../../config/database";
import { createUser } from "../../utils/createUser";
import { Role } from "../../utils/types/Role";
import { selectQuery } from "../../data_access/query";
import { RowDataPacket } from 'mysql2/promise';

export async function loginFunction(req: Request, res: Response, next: NextFunction) {
    try {
        const { id_number, password } = req.body;
        if (!id_number || !password) throw new BadRequestError("Missing credentials!");

        const response = await fetch(`https://bagocitycollege.com/BCCWeb/TPLoginAPI?txtUserName=${id_number}&txtPassword=${password}`);
        const apiResponseObject: TechnopalApiObject = await response.json();

        if (apiResponseObject.is_valid === false) throw new UnauthorizedError("Login Failed!");

        // Login successful
        const user = convertApiObjectToUser(apiResponseObject);
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            await createUser(connection, user); // save user info in database.
            const [rowResult] = await connection.execute<RowDataPacket[]>("SELECT * FROM roles WHERE id_number = ?", [user.id_number]);

            // If user dont have role yet, add role
            if (rowResult.length < 1) {
                const voterRole = apiResponseObject.user_group === "STUDENT" ? 1 : 0; // assign the voter role if the user is student.
                await connection.execute("INSERT INTO roles (voter, id_number) VALUES (?, ?)", [voterRole, user.id_number]);
            };
            connection.commit();

        } catch (error) {
            connection.rollback()
            return next(error);
        }

        // attach this role result to user session
        const [userRoleRow] = await selectQuery<Role>(pool, "SELECT * FROM roles WHERE id_number = ?", [user.id_number]);
        req.session.user = {
            user_id: user.id_number,
            roles: {
                admin: userRoleRow.admin,
                program_head: userRoleRow.program_head,
                voter: userRoleRow.voter
            }
        }

        return res.status(200).json({
            roles: {
                admin: userRoleRow.admin,
                program_head: userRoleRow.program_head,
                voter: userRoleRow.voter
            }
        });

    } catch (error) {
        next(error);
    }
};

export async function logoutFunction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.session) return next(new Error('No session found'));

        req.session.destroy((error) => {
            if (error) {
                return next(error);
            }

            res.clearCookie("connect.sid");
            res.status(200).json({ message: 'Logged out successfully' });
        });
    } catch (error) {
        console.error('Unexpected error during logout:', error);
        next(error);
    }
}
