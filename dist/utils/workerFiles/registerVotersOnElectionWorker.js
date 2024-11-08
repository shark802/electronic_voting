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
const worker_threads_1 = require("worker_threads");
const database_1 = require("../../config/database");
const ulid_1 = require("ulid");
worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.on('message', (dataObject) => __awaiter(void 0, void 0, void 0, function* () {
    const { users, electionId } = dataObject;
    const connection = yield database_1.pool.getConnection();
    try {
        const BATCH_COUNT = 100;
        const userBatches = generateUserBatches(users, BATCH_COUNT);
        yield connection.beginTransaction();
        for (let i = 0; i < userBatches.length; i++) {
            const batch = userBatches[i];
            yield createVoterForElection(electionId, batch, connection);
        }
        ;
        yield connection.commit();
        worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage({ success: true });
    }
    catch (error) {
        yield connection.rollback();
        console.error('Error in worker:', error);
        worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage(worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage({ success: false, error: error }));
    }
    finally {
        yield connection.release();
    }
}));
// will iterate on array of userBatch to insert in voter table
function createVoterForElection(electionId, batch, connection) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let sqlQuery = `INSERT INTO voters (voter_id, id_number, election_id) VALUES `;
            const sqlQueryValues = batch.map((user) => {
                const voterId = (0, ulid_1.ulid)();
                return `('${voterId}', ${user.id_number}, '${electionId}')`;
            }).join(',');
            sqlQuery = sqlQuery + sqlQueryValues;
            return yield connection.query(sqlQuery);
        }
        catch (error) {
            throw error;
        }
    });
}
function generateUserBatches(users, batchCount) {
    const usersBatch = [];
    for (let i = 0; i < users.length; i += batchCount) {
        usersBatch.push(users.slice(i, Math.min(i + batchCount, users.length)));
    }
    return usersBatch;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXJWb3RlcnNPbkVsZWN0aW9uV29ya2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWxzL3dvcmtlckZpbGVzL3JlZ2lzdGVyVm90ZXJzT25FbGVjdGlvbldvcmtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLG1EQUE0QztBQUU1QyxvREFBNkM7QUFDN0MsK0JBQTRCO0FBUTVCLDJCQUFVLGFBQVYsMkJBQVUsdUJBQVYsMkJBQVUsQ0FBRSxFQUFFLENBQUMsU0FBUyxFQUFFLENBQU8sVUFBc0IsRUFBRSxFQUFFO0lBQ3ZELE1BQU0sRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLEdBQUcsVUFBVSxDQUFDO0lBQ3pDLE1BQU0sVUFBVSxHQUFHLE1BQU0sZUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBRTlDLElBQUksQ0FBQztRQUVELE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQztRQUN4QixNQUFNLFdBQVcsR0FBRyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFHNUQsTUFBTSxVQUFVLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUVwQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzFDLE1BQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QixNQUFNLHNCQUFzQixDQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUE7UUFDL0QsQ0FBQztRQUFBLENBQUM7UUFFRixNQUFNLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtRQUV6QiwyQkFBVSxhQUFWLDJCQUFVLHVCQUFWLDJCQUFVLENBQUUsV0FBVyxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFFL0MsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDYixNQUFNLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUMzQixPQUFPLENBQUMsS0FBSyxDQUFDLGtCQUFrQixFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3pDLDJCQUFVLGFBQVYsMkJBQVUsdUJBQVYsMkJBQVUsQ0FBRSxXQUFXLENBQUMsMkJBQVUsYUFBViwyQkFBVSx1QkFBViwyQkFBVSxDQUFFLFdBQVcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN2RixDQUFDO1lBQVMsQ0FBQztRQUNQLE1BQU0sVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQy9CLENBQUM7QUFDTCxDQUFDLENBQUEsQ0FBQyxDQUFDO0FBRUgsOERBQThEO0FBQzlELFNBQWUsc0JBQXNCLENBQUMsVUFBa0IsRUFBRSxLQUFhLEVBQUUsVUFBMEI7O1FBQy9GLElBQUksQ0FBQztZQUVELElBQUksUUFBUSxHQUFHLCtEQUErRCxDQUFDO1lBQy9FLE1BQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtnQkFDdEMsTUFBTSxPQUFPLEdBQUcsSUFBQSxXQUFJLEdBQUUsQ0FBQztnQkFDdkIsT0FBTyxLQUFLLE9BQU8sTUFBTSxJQUFJLENBQUMsU0FBUyxNQUFNLFVBQVUsSUFBSSxDQUFBO1lBQy9ELENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUViLFFBQVEsR0FBRyxRQUFRLEdBQUcsY0FBYyxDQUFDO1lBRXJDLE9BQU8sTUFBTSxVQUFVLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTVDLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsTUFBTSxLQUFLLENBQUM7UUFDaEIsQ0FBQztJQUNMLENBQUM7Q0FBQTtBQUVELFNBQVMsbUJBQW1CLENBQUMsS0FBYSxFQUFFLFVBQWtCO0lBQzFELE1BQU0sVUFBVSxHQUFhLEVBQUUsQ0FBQztJQUVoQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksVUFBVSxFQUFFLENBQUM7UUFDaEQsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxVQUFVLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBRUQsT0FBTyxVQUFVLENBQUM7QUFDdEIsQ0FBQyJ9