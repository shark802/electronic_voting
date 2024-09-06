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
function importUsersWorker(csvUsersData) {
    return __awaiter(this, void 0, void 0, function* () {
        const BATCH_SIZE = 100;
        let userBatches = [];
        for (let i = 0; i < csvUsersData.length; i += BATCH_SIZE) {
            console.log('loop', i);
            userBatches.push(csvUsersData.slice(i, i + BATCH_SIZE));
        }
        return csvUsersData.length;
    });
}
exports.importUsersWorker = importUsersWorker;
worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.on('message', (csvUsersData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield importUsersWorker(csvUsersData);
    worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage(result);
}));
