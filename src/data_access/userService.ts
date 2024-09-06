import { resolve } from "path";
import { pool } from "../config/database";
import { CsvUserObject } from "../utils/types/CsvUserObject";
import { rejects } from "assert";

export async function insertUsersInDatabase(csvUserObject: CsvUserObject[]) {
    return new Promise(async (resolve, reject) => {

        const connection = await pool.getConnection();

        try {

        } catch (error) {
            reject(error);
        } finally {
            await connection.release();
        }
    })
}