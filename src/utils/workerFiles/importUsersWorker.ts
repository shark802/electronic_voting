// importUsersWorker.ts
import { parentPort } from 'worker_threads';
import { CsvUserObject } from '../types/CsvUserObject';
import { insertUsersInDatabase } from '../../data_access/userService';

export async function importUsersWorker(csvUsersData: CsvUserObject[], filename: string) {
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

            await insertUsersInDatabase(userBatch);

            const endTime = Date.now();
            const timeTaken = (endTime - startTime) / 1000;

            console.log(`Batch ${i + 1} inserted successfully. Time taken: ${timeTaken.toFixed(2)} seconds`);

        } catch (error) {
            console.error(`Error inserting batch ${i + 1}:`, error);
        }
    }

    const endTime = Date.now();
    const importTimeInMinutes = `${((endTime - startTime) / (1000 * 60)).toFixed(2)} mins `;
    console.log(`Successfully processed ${importSize} users. \n Time taken: ${importTimeInMinutes} mins.`);


    return {
        importSize,
        importTimeInMinutes
    }
}

parentPort?.on('message', async ({ csvUsersData, filename }) => {

    const result = await importUsersWorker(csvUsersData as CsvUserObject[], filename as string);
    parentPort?.postMessage(result);
});
