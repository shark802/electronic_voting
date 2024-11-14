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
