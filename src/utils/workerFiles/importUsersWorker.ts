// importUsersWorker.ts
import { parentPort } from 'worker_threads';
import { CsvUserObject } from '../types/CsvUserObject';
import { insertUsersInDatabase } from '../../data_access/userService';

export async function importUsersWorker(csvUsersData: CsvUserObject[]): Promise<number> {
    const BATCH_SIZE = 100;

    let userBatches: CsvUserObject[][] = []
    for (let i = 0; i < csvUsersData.length; i += BATCH_SIZE) {
        userBatches.push(csvUsersData.slice(i, i + BATCH_SIZE))
    }

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

    return csvUsersData.length;
}

parentPort?.on('message', async (csvUsersData: CsvUserObject[]) => {
    const result = await importUsersWorker(csvUsersData);
    parentPort?.postMessage(result);
});
