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
exports.createUser = void 0;
/**
 *
 * @param connection
 * @param user
 * @returns
 */
function createUser(connection, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const insertUserQuery = `
        INSERT INTO users (id_number, firstname, lastname, middlename, email, cp_number, course, year_level, section, program_description, is_active, user_group)
        VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            middlename = VALUES(middlename),
            email = VALUES(email),
            cp_number = VALUES(cp_number),
            year_level = VALUES(year_level),
            section = VALUES(section),
            program_description = VALUES(program_description),
            is_active = VALUES(is_active),
            user_group = VALUES(user_group)`;
        const insertUserValues = [user.id_number, user.firstname, user.lastname, user.middlename, user.email, user.cp_number, user.course, user.year_level, user.section, user.program_description, user.is_active, user.user_group];
        const [insertUserResult] = yield connection.execute(insertUserQuery, insertUserValues); // -Insert a new User or update some user columns if the user is already exist
        return insertUserResult;
    });
}
exports.createUser = createUser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlVXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9jcmVhdGVVc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUlBOzs7OztHQUtHO0FBQ0gsU0FBc0IsVUFBVSxDQUFDLFVBQTBCLEVBQUUsSUFBbUI7O1FBRTVFLE1BQU0sZUFBZSxHQUFHOzs7Ozs7Ozs7Ozs0Q0FXZ0IsQ0FBQztRQUN6QyxNQUFNLGdCQUFnQixHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRTdOLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLE1BQU0sVUFBVSxDQUFDLE9BQU8sQ0FBa0IsZUFBZSxFQUFFLGdCQUFnQixDQUFDLENBQUMsQ0FBQyw4RUFBOEU7UUFDdkwsT0FBTyxnQkFBZ0IsQ0FBQztJQUM1QixDQUFDO0NBQUE7QUFsQkQsZ0NBa0JDIn0=