// importUsersWorker.ts
import { parentPort } from 'worker_threads';
import { CsvUserObject } from '../types/CsvUserObject';

export async function importUsersWorker(csvUsersData: CsvUserObject[]): Promise<number> {
    const BATCH_SIZE = 100;

    let userBatches: CsvUserObject[][] = []
    for (let i = 0; i < csvUsersData.length; i += BATCH_SIZE) {
        console.log('loop', i);
        userBatches.push(csvUsersData.slice(i, i + BATCH_SIZE))
    }

    return csvUsersData.length;
}

parentPort?.on('message', async (csvUsersData: CsvUserObject[]) => {
    const result = await importUsersWorker(csvUsersData);
    parentPort?.postMessage(result);
});
