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
const path_1 = __importDefault(require("path"));
const database_1 = require("../config/database");
const query_1 = require("../data_access/query");
const globalEventEmitterInstance_1 = require("./globalEventEmitterInstance");
const worker_threads_1 = require("worker_threads");
globalEventEmitterInstance_1.eventEmitter.on('addCandidateEvent', (electionId) => __awaiter(void 0, void 0, void 0, function* () {
    const CURRENT_YEAR = new Date().getFullYear();
    const users = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM users WHERE year_active = ?', [CURRENT_YEAR]);
    const worker = new worker_threads_1.Worker(path_1.default.join(__dirname, '../utils/workerFiles/registerVotersOnElectionWorker.js'));
    worker.postMessage({ users, electionId });
    worker.on('message', (result) => {
        if (result.success === true) {
            console.log(`Successfully added voters for election ${electionId}`);
        }
        else if (result.error) {
            console.error(`Error adding voters for election ${electionId}:`, result.error);
        }
    });
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkVm90ZXJzT25FbGVjdGlvbkV2ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2V2ZW50cy9hZGRWb3RlcnNPbkVsZWN0aW9uRXZlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxnREFBd0I7QUFDeEIsaURBQTBDO0FBQzFDLGdEQUFtRDtBQUVuRCw2RUFBNEQ7QUFDNUQsbURBQXdDO0FBT3hDLHlDQUFZLENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFFLENBQU8sVUFBa0IsRUFBRSxFQUFFO0lBRTlELE1BQU0sWUFBWSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDOUMsTUFBTSxLQUFLLEdBQUcsTUFBTSxJQUFBLG1CQUFXLEVBQU8sZUFBSSxFQUFFLDJDQUEyQyxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUV6RyxNQUFNLE1BQU0sR0FBRyxJQUFJLHVCQUFNLENBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsd0RBQXdELENBQUMsQ0FBQyxDQUFDO0lBQzFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztJQUUxQyxNQUFNLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLE1BQXFCLEVBQUUsRUFBRTtRQUMzQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDMUIsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQ0FBMEMsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUN4RSxDQUFDO2FBQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDdEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxvQ0FBb0MsVUFBVSxHQUFHLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25GLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQTtBQUVOLENBQUMsQ0FBQSxDQUFDLENBQUEifQ==