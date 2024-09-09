import path from "path";
import { pool } from "../config/database";
import { selectQuery } from "../data_access/query";
import { User } from "../utils/types/User";
import { eventEmitter } from "./globalEventEmitterInstance";
import { Worker } from "worker_threads";

eventEmitter.on('addCandidateEvent', async (electionId: string) => {

    const CURRENT_YEAR = new Date().getFullYear();
    const users = await selectQuery<User>(pool, 'SELECT * FROM users WHERE year_active = ?', [CURRENT_YEAR]);

    const worker = new Worker(path.join(__dirname, '../utils/workerFiles/registerVotersOnElectionWorker.js'));
    worker.postMessage({ users, electionId });

    worker.on('message', (result) => {
        console.log(result);
    })

})