import path from "path";
import { CsvUserObject } from "./types/CsvUserObject";
import { Worker } from "worker_threads";

/**
 * Processes and inserts user data into the database in batches using a worker thread.
 * 
 * This function accepts an array of user objects (parsed from a CSV file) and offloads
 * the task of inserting this data into the database to a worker thread.
 * 
 * @param csvUsersFile - An array of user objects parsed from a CSV file.
 * @returns {Promise<number>} - A promise that resolves with the number of successfully processed users.
 *                              If an error occurs, the promise is rejected with the error.
 */
export function importUsersToDatabase(csvUsersFile: CsvUserObject[]) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.join(__dirname, './workerFiles/importUsersWorker.js'));

        worker.postMessage(csvUsersFile);

        worker.on('message', (result: number) => {
            resolve(result);
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