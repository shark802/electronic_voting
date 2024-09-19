import path from "path";
import { pool } from "../config/database";
import { selectQuery } from "../data_access/query";
import { User } from "../utils/types/User";
import { eventEmitter } from "./globalEventEmitterInstance";
import { Worker } from "worker_threads";

interface WorkerMessage {
    success?: boolean;
    error?: string;
}

eventEmitter.on('addCandidateEvent', async (electionId: string) => {

    const CURRENT_YEAR = new Date().getFullYear();
    const users = await selectQuery<User>(pool, 'SELECT * FROM users WHERE year_active = ?', [CURRENT_YEAR]);

    const worker = new Worker(path.join(__dirname, '../utils/workerFiles/registerVotersOnElectionWorker.js'));
    worker.postMessage({ users, electionId });

    worker.on('message', (result: WorkerMessage) => {
        if (result.success === true) {
            console.log(`Successfully added voters for election ${electionId}`);
        } else if (result.error) {
            console.error(`Error adding voters for election ${electionId}:`, result.error);
        }
    })

})