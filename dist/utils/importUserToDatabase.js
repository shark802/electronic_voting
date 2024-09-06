"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importUsersToDatabase = void 0;
const path_1 = __importDefault(require("path"));
const worker_threads_1 = require("worker_threads");
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
function importUsersToDatabase(csvUsersFile) {
    return new Promise((resolve, reject) => {
        const worker = new worker_threads_1.Worker(path_1.default.join(__dirname, './workerFiles/importUsersWorker.js'));
        worker.postMessage(csvUsersFile);
        worker.on('message', (result) => {
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
exports.importUsersToDatabase = importUsersToDatabase;
