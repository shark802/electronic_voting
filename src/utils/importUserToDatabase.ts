import path from "path";
import { CsvUserObject } from "./types/CsvUserObject";
import { Worker } from "worker_threads";
import { pool } from "../config/database";
import { updateQuery } from "../data_access/query";
import { Connection } from "mysql2/promise";
import { insertUsersInDatabase } from "../data_access/userService";

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
export async function importUsersToDatabase(csvUsersData: CsvUserObject[], importId: string, filename: string, connection: Connection) {

    const BATCH_SIZE = 100;
    const importSize = csvUsersData.length;

    let userBatches: CsvUserObject[][] = []
    for (let i = 0; i < csvUsersData.length; i += BATCH_SIZE) {
        userBatches.push(csvUsersData.slice(i, i + BATCH_SIZE))
    }

    console.log(`Importing ${filename}`);
    const startTime = Date.now();

    for (let i = 0; i < userBatches.length; i++) {
        const userBatch = userBatches[i];

        try {
            const startTime = Date.now();

            await insertUsersInDatabase(userBatch, connection);

            const endTime = Date.now();
            const timeTaken = (endTime - startTime) / 1000;

            console.log(`Batch ${i + 1} inserted successfully. Time taken: ${timeTaken.toFixed(2)} seconds`);

        } catch (error) {
            console.error(`Error inserting batch ${i + 1}:`, error);
            throw error
        }
    }

    const endTime = Date.now();

    const totalTimeInMilliseconds = endTime - startTime;
    const totalMinutes = Math.floor(totalTimeInMilliseconds / (1000 * 60));
    const remainingSeconds = Math.floor((totalTimeInMilliseconds % (1000 * 60)) / 1000);

    const importTimeInMinutes = `${totalMinutes}:${remainingSeconds} mins `;
    console.log(`Successfully processed ${importSize} users.\n Time taken: ${importTimeInMinutes}`);

    return {
        importSize,
        importTimeInMinutes
    }

}