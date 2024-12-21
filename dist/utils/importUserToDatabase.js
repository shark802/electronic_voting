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
function importUsersToDatabase(csvUsersData, importId, filename, connection, socket) {
    return __awaiter(this, void 0, void 0, function* () {
        const importSize = csvUsersData.length;
        console.log(`Importing ${filename}`);
        const startTime = Date.now();
        for (let i = 0; i < csvUsersData.length; i++) {
            const user = csvUsersData[i];
            try {
                yield (0, userService_1.insertUsersInDatabase)([user], connection);
                const percentageInserted = ((i + 1) / importSize) * 100;
                socket.emit('user-import-update', {
                    percentage: percentageInserted,
                    status: 'PENDING',
                    currentInserted: i + 1
                });
            }
            catch (error) {
                console.error(`Error inserting user ${i + 1}:`, error);
                socket.emit('user-import-update', {
                    status: 'FAILED',
                    userIndex: i + 1,
                    errorMessage: error.message // Send the error message
                });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0VXNlclRvRGF0YWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvaW1wb3J0VXNlclRvRGF0YWJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBTUEsNERBQW1FO0FBR25FOzs7Ozs7Ozs7R0FTRztBQUNILFNBQXNCLHFCQUFxQixDQUFDLFlBQTZCLEVBQUUsUUFBZ0IsRUFBRSxRQUFnQixFQUFFLFVBQXNCLEVBQUUsTUFBYzs7UUFFakosTUFBTSxVQUFVLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQztRQUV2QyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUNyQyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFN0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUMzQyxNQUFNLElBQUksR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFN0IsSUFBSSxDQUFDO2dCQUVELE1BQU0sSUFBQSxtQ0FBcUIsRUFBQyxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUNoRCxNQUFNLGtCQUFrQixHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLEdBQUcsR0FBRyxDQUFDO2dCQUN4RCxNQUFNLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFO29CQUM5QixVQUFVLEVBQUUsa0JBQWtCO29CQUM5QixNQUFNLEVBQUUsU0FBUztvQkFDakIsZUFBZSxFQUFFLENBQUMsR0FBRyxDQUFDO2lCQUN6QixDQUFDLENBQUM7WUFHUCxDQUFDO1lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztnQkFDYixPQUFPLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ3ZELE1BQU0sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUU7b0JBQzlCLE1BQU0sRUFBRSxRQUFRO29CQUNoQixTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUM7b0JBQ2hCLFlBQVksRUFBRyxLQUFlLENBQUMsT0FBTyxDQUFDLHlCQUF5QjtpQkFDbkUsQ0FBQyxDQUFDO2dCQUNILE1BQU0sS0FBSyxDQUFDO1lBQ2hCLENBQUM7UUFDTCxDQUFDO1FBRUQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRTNCLE1BQU0sdUJBQXVCLEdBQUcsT0FBTyxHQUFHLFNBQVMsQ0FBQztRQUNwRCxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLHVCQUF1QixHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdkUsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsdUJBQXVCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUVwRixNQUFNLG1CQUFtQixHQUFHLEdBQUcsWUFBWSxJQUFJLGdCQUFnQixRQUFRLENBQUM7UUFDeEUsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsVUFBVSx5QkFBeUIsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDO1FBRWhHLE9BQU87WUFDSCxVQUFVO1lBQ1YsbUJBQW1CO1NBQ3RCLENBQUM7SUFDTixDQUFDO0NBQUE7QUE3Q0Qsc0RBNkNDIn0=