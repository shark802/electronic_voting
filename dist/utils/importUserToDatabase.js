"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importUsersToDatabase = void 0;
const path_1 = __importDefault(require("path"));
const worker_threads_1 = require("worker_threads");
const database_1 = require("../config/database");
const query_1 = require("../data_access/query");
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
function importUsersToDatabase(csvUsersData, importId, filename) {
    return new Promise((resolve, reject) => {
        const worker = new worker_threads_1.Worker(path_1.default.join(__dirname, './workerFiles/importUsersWorker.js'));
        worker.postMessage({ csvUsersData, filename });
        worker.on('message', (_a) => __awaiter(this, [_a], void 0, function* ({ importSize, importTimeInMinutes }) {
            yield (0, query_1.updateQuery)(database_1.pool, 'UPDATE users_import_records SET time_taken = ?, import_size = ?, status = ? WHERE id = ?', [importTimeInMinutes, importSize, 'Completed', importId]);
            resolve({
                importSize,
                importTimeInMinutes,
                importId
            });
        }));
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
