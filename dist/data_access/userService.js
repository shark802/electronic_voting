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
exports.insertUsersInDatabase = void 0;
const database_1 = require("../config/database");
const bcrypt_1 = __importDefault(require("bcrypt"));
function insertUsersInDatabase(csvUserObject) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = yield database_1.pool.getConnection();
            try {
                yield connection.beginTransaction();
                for (const user of csvUserObject) {
                    const sqlQuery = `
                    INSERT INTO users (id_number, lastname, firstname, middlename, course, year_level, section, password, year_active, user_group)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                        lastname = VALUES(lastname),
                        firstname = VALUES(firstname),
                        middlename = VALUES(middlename),
                        course = VALUES(course),
                        year_level = VALUES(year_level),
                        section = VALUES(section),
                        password = VALUES(password),
                        year_active = VALUES(year_active),
                        user_group = VALUES(user_group)
                `;
                    const salt = yield bcrypt_1.default.genSalt(10);
                    const hashedPassword = yield bcrypt_1.default.hash(user.PASSWORD, salt);
                    const year_active = new Date().getFullYear();
                    yield connection.execute(sqlQuery, [user["ID NUMBER"], user["LAS NAME"], user["FIRST NAME"], user["MIDDLE NAME"], user.COURSE, user.YEAR, user.SECTION, hashedPassword, year_active, 'STUDENT']);
                    const [userRole] = yield connection.execute('SELECT * FROM roles WHERE id_number = ? LIMIT 1', [user["ID NUMBER"]]);
                    if (userRole.length === 0) {
                        yield connection.execute('INSERT INTO roles (id_number, voter) VALUES (?, 1)', [user["ID NUMBER"]]);
                    }
                }
                yield connection.commit();
                resolve({
                    message: "All users inserted/updated successfully",
                    totalUsersProcessed: csvUserObject.length
                });
            }
            catch (error) {
                yield connection.rollback();
                reject(error);
            }
            finally {
                yield connection.release();
            }
        }));
    });
}
exports.insertUsersInDatabase = insertUsersInDatabase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlclNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZGF0YV9hY2Nlc3MvdXNlclNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaURBQTBDO0FBRTFDLG9EQUEyQjtBQUczQixTQUFzQixxQkFBcUIsQ0FBQyxhQUE4Qjs7UUFDdEUsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFPLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUN6QyxNQUFNLFVBQVUsR0FBRyxNQUFNLGVBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUU5QyxJQUFJLENBQUM7Z0JBQ0QsTUFBTSxVQUFVLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztnQkFFcEMsS0FBSyxNQUFNLElBQUksSUFBSSxhQUFhLEVBQUUsQ0FBQztvQkFDL0IsTUFBTSxRQUFRLEdBQUc7Ozs7Ozs7Ozs7Ozs7aUJBYWhCLENBQUM7b0JBRUYsTUFBTSxJQUFJLEdBQUcsTUFBTSxnQkFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDdEMsTUFBTSxjQUFjLEdBQUcsTUFBTSxnQkFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUU5RCxNQUFNLFdBQVcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO29CQUU3QyxNQUFNLFVBQVUsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFFak0sTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLE1BQU0sVUFBVSxDQUFDLE9BQU8sQ0FBQyxpREFBaUQsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BILElBQUssUUFBMEIsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7d0JBQzNDLE1BQU0sVUFBVSxDQUFDLE9BQU8sQ0FBQyxvREFBb0QsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3hHLENBQUM7Z0JBQ0wsQ0FBQztnQkFFRCxNQUFNLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFFMUIsT0FBTyxDQUFDO29CQUNKLE9BQU8sRUFBRSx5Q0FBeUM7b0JBQ2xELG1CQUFtQixFQUFFLGFBQWEsQ0FBQyxNQUFNO2lCQUM1QyxDQUFDLENBQUM7WUFFUCxDQUFDO1lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztnQkFDYixNQUFNLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDNUIsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2xCLENBQUM7b0JBQVMsQ0FBQztnQkFDUCxNQUFNLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUMvQixDQUFDO1FBQ0wsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FBQTtBQWxERCxzREFrREMifQ==