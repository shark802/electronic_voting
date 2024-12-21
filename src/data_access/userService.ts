import { Connection } from "mysql2/promise";
import { pool } from "../config/database";
import { CsvUserObject } from "../utils/types/CsvUserObject";
import bcrypt from 'bcrypt'
import { QueryResult } from "mysql2";

export async function insertUsersInDatabase(csvUserObject: CsvUserObject[], connection: Connection) {
    return new Promise(async (resolve, reject) => {
        // const connection = await pool.getConnection();

        try {
            // await connection.beginTransaction();

            for (const user of csvUserObject) {
                const sqlQuery = `
                    INSERT INTO users (id_number, lastname, firstname, middlename, course, year_level, section, password, year_active, user_group, is_active)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                        lastname = VALUES(lastname),
                        firstname = VALUES(firstname),
                        middlename = VALUES(middlename),
                        course = VALUES(course),
                        year_level = VALUES(year_level),
                        section = VALUES(section),
                        password = VALUES(password),
                        year_active = VALUES(year_active),
                        user_group = VALUES(user_group),
                        is_active = VALUES(is_active)
                `;

                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(user.PASSWORD, salt);

                const year_active = new Date().getFullYear();

                await connection.execute(sqlQuery, [user["ID NUMBER"], user["LAS NAME"], user["FIRST NAME"], user["MIDDLE NAME"], user.COURSE, user.YEAR, user.SECTION, hashedPassword, year_active, 'STUDENT', 1]);

                const [userRole] = await connection.execute('SELECT * FROM roles WHERE id_number = ? LIMIT 1', [user["ID NUMBER"]]);
                if ((userRole as QueryResult[]).length === 0) {
                    await connection.execute('INSERT INTO roles (id_number, voter) VALUES (?, 1)', [user["ID NUMBER"]]);
                }
            }

            // await connection.commit();

            resolve({
                message: "All users inserted/updated successfully",
                totalUsersProcessed: csvUserObject.length
            });

        } catch (error) {
            // await connection.rollback();
            reject(error);
        }
    });
}
