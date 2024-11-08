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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0VXNlclRvRGF0YWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvaW1wb3J0VXNlclRvRGF0YWJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsZ0RBQXdCO0FBRXhCLG1EQUF3QztBQUV4Qzs7Ozs7Ozs7O0dBU0c7QUFDSCxTQUFnQixxQkFBcUIsQ0FBQyxZQUE2QjtJQUMvRCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ25DLE1BQU0sTUFBTSxHQUFHLElBQUksdUJBQU0sQ0FBQyxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxvQ0FBb0MsQ0FBQyxDQUFDLENBQUM7UUFDdEYsTUFBTSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUVqQyxNQUFNLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLE1BQWMsRUFBRSxFQUFFO1lBQ3BDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNwQixDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDekIsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUN2QixJQUFJLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQztnQkFDYixNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsaUNBQWlDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMvRCxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7QUFuQkQsc0RBbUJDIn0=