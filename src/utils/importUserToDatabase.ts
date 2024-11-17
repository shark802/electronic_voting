import path from "path";
import { CsvUserObject } from "./types/CsvUserObject";
import { Worker } from "worker_threads";
import { pool } from "../config/database";
import { updateQuery } from "../data_access/query";

/**
 * Processes and inserts user data into the database in batches using a worker thread.
 * 
 * This function accepts an array of user objects (parsed from a CSV file) and offloads
 * the task of inserting this data into the database to a worker thread.
 * 
 * @param csvUsersData - An array of user objects parsed from a CSV file.
 * @returns {Promise<number>} - A promise that resolves with the number of successfully processed users.
 *                              If an error occurs, the promise is rejected with the error.
 */
export function importUsersToDatabase(csvUsersData: CsvUserObject[], importId: string, filename: string) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.join(__dirname, './workerFiles/importUsersWorker.js'));
        worker.postMessage({ csvUsersData, filename });

        worker.on('message', async ({ importSize, importTimeInMinutes }) => {
            await updateQuery(pool, 'UPDATE users_import_records SET time_taken = ?, import_size = ?, status = ? WHERE id = ?', [importTimeInMinutes, importSize, 'Completed', importId])

            resolve({
                importSize,
                importTimeInMinutes,
                importId
            });

        });

        worker.on('error', (error) => {
            reject(error);
        });

        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
            }
        });
    });
}