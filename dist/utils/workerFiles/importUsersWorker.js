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
Object.defineProperty(exports, "__esModule", { value: true });
exports.importUsersWorker = void 0;
// importUsersWorker.ts
const worker_threads_1 = require("worker_threads");
const userService_1 = require("../../data_access/userService");
function importUsersWorker(csvUsersData) {
    return __awaiter(this, void 0, void 0, function* () {
        const BATCH_SIZE = 100;
        let userBatches = [];
        for (let i = 0; i < csvUsersData.length; i += BATCH_SIZE) {
            userBatches.push(csvUsersData.slice(i, i + BATCH_SIZE));
        }
        for (let i = 0; i < userBatches.length; i++) {
            const userBatch = userBatches[i];
            try {
                const startTime = Date.now();
                yield (0, userService_1.insertUsersInDatabase)(userBatch);
                const endTime = Date.now();
                const timeTaken = (endTime - startTime) / 1000;
                console.log(`Batch ${i + 1} inserted successfully. Time taken: ${timeTaken.toFixed(2)} seconds`);
            }
            catch (error) {
                console.error(`Error inserting batch ${i + 1}:`, error);
            }
        }
        return csvUsersData.length;
    });
}
exports.importUsersWorker = importUsersWorker;
worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.on('message', (csvUsersData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield importUsersWorker(csvUsersData);
    worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage(result);
}));
