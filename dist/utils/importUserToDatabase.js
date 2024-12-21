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
exports.importUsersToDatabase = void 0;
const userService_1 = require("../data_access/userService");
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
function importUsersToDatabase(csvUsersData, importId, filename, connection) {
    return __awaiter(this, void 0, void 0, function* () {
        const BATCH_SIZE = 100;
        const importSize = csvUsersData.length;
        let userBatches = [];
        for (let i = 0; i < csvUsersData.length; i += BATCH_SIZE) {
            userBatches.push(csvUsersData.slice(i, i + BATCH_SIZE));
        }
        console.log(`Importing ${filename}`);
        const startTime = Date.now();
        for (let i = 0; i < userBatches.length; i++) {
            const userBatch = userBatches[i];
            try {
                const startTime = Date.now();
                yield (0, userService_1.insertUsersInDatabase)(userBatch, connection);
                const endTime = Date.now();
                const timeTaken = (endTime - startTime) / 1000;
                console.log(`Batch ${i + 1} inserted successfully. Time taken: ${timeTaken.toFixed(2)} seconds`);
            }
            catch (error) {
                console.error(`Error inserting batch ${i + 1}:`, error);
                throw error;
            }
        }
        const endTime = Date.now();
        const totalTimeInMilliseconds = endTime - startTime;
        const totalMinutes = Math.floor(totalTimeInMilliseconds / (1000 * 60));
        const remainingSeconds = Math.floor((totalTimeInMilliseconds % (1000 * 60)) / 1000);
        const importTimeInMinutes = `${totalMinutes}:${remainingSeconds} mins `;
        console.log(`Successfully processed ${importSize} users.\n Time taken: ${importTimeInMinutes}`);
        return {
            importSize,
            importTimeInMinutes
        };
    });
}
exports.importUsersToDatabase = importUsersToDatabase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0VXNlclRvRGF0YWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvaW1wb3J0VXNlclRvRGF0YWJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBTUEsNERBQW1FO0FBRW5FOzs7Ozs7Ozs7R0FTRztBQUNILFNBQXNCLHFCQUFxQixDQUFDLFlBQTZCLEVBQUUsUUFBZ0IsRUFBRSxRQUFnQixFQUFFLFVBQXNCOztRQUVqSSxNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUM7UUFDdkIsTUFBTSxVQUFVLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQztRQUV2QyxJQUFJLFdBQVcsR0FBc0IsRUFBRSxDQUFBO1FBQ3ZDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxVQUFVLEVBQUUsQ0FBQztZQUN2RCxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFBO1FBQzNELENBQUM7UUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUNyQyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFN0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUMxQyxNQUFNLFNBQVMsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFakMsSUFBSSxDQUFDO2dCQUNELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFFN0IsTUFBTSxJQUFBLG1DQUFxQixFQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFFbkQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUMzQixNQUFNLFNBQVMsR0FBRyxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUM7Z0JBRS9DLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyx1Q0FBdUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFckcsQ0FBQztZQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7Z0JBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUN4RCxNQUFNLEtBQUssQ0FBQTtZQUNmLENBQUM7UUFDTCxDQUFDO1FBRUQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRTNCLE1BQU0sdUJBQXVCLEdBQUcsT0FBTyxHQUFHLFNBQVMsQ0FBQztRQUNwRCxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLHVCQUF1QixHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdkUsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsdUJBQXVCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUVwRixNQUFNLG1CQUFtQixHQUFHLEdBQUcsWUFBWSxJQUFJLGdCQUFnQixRQUFRLENBQUM7UUFDeEUsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsVUFBVSx5QkFBeUIsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDO1FBRWhHLE9BQU87WUFDSCxVQUFVO1lBQ1YsbUJBQW1CO1NBQ3RCLENBQUE7SUFFTCxDQUFDO0NBQUE7QUE5Q0Qsc0RBOENDIn0=