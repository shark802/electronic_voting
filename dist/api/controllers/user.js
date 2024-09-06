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
exports.importUsers = exports.getUserByIdNumber = exports.updateUserFunction = exports.newUserFunction = void 0;
const customErrors_1 = require("../../utils/customErrors");
const query_1 = require("../../data_access/query");
const database_1 = require("../../config/database");
const csvtojson_1 = __importDefault(require("csvtojson"));
const fs_1 = __importDefault(require("fs"));
const importUserToDatabase_1 = require("../../utils/importUserToDatabase");
function newUserFunction(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userObject, userRoles } = req.body;
            if (!userObject)
                throw new customErrors_1.BadRequestError('Missing object of user data');
            if (!userRoles)
                throw new customErrors_1.BadRequestError('Missing object of user roles');
            Object.keys(userObject).forEach(key => {
                if (typeof userObject[key] === 'string') {
                    userObject[key] = userObject[key].toUpperCase();
                }
            });
            const { id_number, firstname, lastname, course } = userObject;
            const { voter, program_head, admin } = userRoles;
            if (!id_number)
                throw new customErrors_1.BadRequestError('Missing user id number');
            if (!firstname)
                throw new customErrors_1.BadRequestError('Missing user firstname');
            if (!lastname)
                throw new customErrors_1.BadRequestError('Missing user lastname');
            if (!course)
                throw new customErrors_1.BadRequestError('Missing user course');
            if (!('voter' in userRoles))
                throw new customErrors_1.BadRequestError('Missing user voter role');
            if (!('program_head' in userRoles))
                throw new customErrors_1.BadRequestError('Missing user program head role');
            if (!('admin' in userRoles))
                throw new customErrors_1.BadRequestError('Missing user admin role');
            const [user] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM users WHERE id_number = ? LIMIT 1', [id_number]);
            if (user)
                throw new customErrors_1.ConflictError(`${userObject.id_number} already exist`);
            const connection = yield database_1.pool.getConnection();
            try {
                yield connection.beginTransaction();
                yield connection.execute('INSERT INTO users (id_number, firstname, lastname, course) VALUES(?, ?, ?, ?)', [id_number, firstname, lastname, course]);
                yield connection.execute('INSERT INTO roles (id_number, voter, program_head, admin) VALUES(?, ?, ?, ?)', [id_number, voter, program_head, admin]);
                yield connection.commit();
                return res.status(200).json({ message: 'Succesfully added new user' });
            }
            catch (error) {
                yield connection.rollback();
            }
            finally {
                yield connection.release();
            }
        }
        catch (error) {
            next(error);
        }
    });
}
exports.newUserFunction = newUserFunction;
function updateUserFunction(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const idNumber = req.params.id;
            const { userObject, userRoles } = req.body;
            if (!userObject)
                throw new customErrors_1.BadRequestError('Missing object of user data');
            if (!userRoles)
                throw new customErrors_1.BadRequestError('Missing object of user roles');
            Object.keys(userObject).forEach(key => {
                if (typeof userObject[key] === 'string') {
                    userObject[key] = userObject[key].toUpperCase();
                }
            });
            const { id_number, firstname, lastname, course } = userObject;
            const { voter, program_head, admin } = userRoles;
            if (!id_number)
                throw new customErrors_1.BadRequestError('Missing user id number');
            if (!firstname)
                throw new customErrors_1.BadRequestError('Missing user firstname');
            if (!lastname)
                throw new customErrors_1.BadRequestError('Missing user lastname');
            if (!course)
                throw new customErrors_1.BadRequestError('Missing user course');
            if (!('voter' in userRoles))
                throw new customErrors_1.BadRequestError('Missing user voter role');
            if (!('program_head' in userRoles))
                throw new customErrors_1.BadRequestError('Missing user program head role');
            if (!('admin' in userRoles))
                throw new customErrors_1.BadRequestError('Missing user admin role');
            const connection = yield database_1.pool.getConnection();
            try {
                yield connection.beginTransaction();
                const [userUpdateResult] = yield connection.execute('UPDATE users SET firstname = ?, lastname = ?, course = ? WHERE id_number = ?', [firstname, lastname, course, idNumber]);
                const [userRolesUpdateResult] = yield connection.execute('UPDATE roles SET voter = ?, program_head = ?, admin = ? WHERE id_number = ?', [voter, program_head, admin, idNumber]);
                yield connection.commit();
                if (userUpdateResult.affectedRows <= 0 || userRolesUpdateResult.affectedRows <= 0)
                    throw new customErrors_1.NotFoundError('No user updated, please check if user exist');
                return res.status(200).json({ message: 'Update successfull' });
            }
            catch (error) {
                yield connection.rollback();
            }
            finally {
                yield connection.release();
            }
            // const userUpdateResult = await updateQuery(pool, 'UPDATE users SET firstname = ?, lastname = ?, course = ? WHERE id_number = ?', [firstname, lastname, course, idNumber]);
            // const userRolesUpdateResult = await updateQuery(pool, 'UPDATE roles SET voter = ?, program_head = ?, admin = ? WHERE id_number = ?', [voter, program_head, admin, idNumber]);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.updateUserFunction = updateUserFunction;
function getUserByIdNumber(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const idNumber = req.params.id;
            if (!idNumber)
                throw new customErrors_1.BadRequestError('Id number is missing');
            const sqlQuery = 'SELECT * FROM users JOIN roles ON users.id_number = roles.id_number WHERE users.id_number = ? LIMIT 1';
            const [user] = yield (0, query_1.selectQuery)(database_1.pool, sqlQuery, [idNumber]);
            return res.status(200).json({ user });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getUserByIdNumber = getUserByIdNumber;
function importUsers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const usersFile = req.file;
            if (!usersFile)
                throw new customErrors_1.BadRequestError('Users data file is not provided');
            const userCsvFile = yield (0, csvtojson_1.default)().fromFile(usersFile.path);
            fs_1.default.unlinkSync(usersFile.path);
            const importProcessResult = yield (0, importUserToDatabase_1.importUsersToDatabase)(userCsvFile);
            res.status(200).json({ message: `Successfully processed ${importProcessResult} users.` });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.importUsers = importUsers;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvY29udHJvbGxlcnMvdXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQSwyREFBeUY7QUFDekYsbURBQWdGO0FBRWhGLG9EQUE2QztBQUU3QywwREFBNEI7QUFDNUIsNENBQW9CO0FBSXBCLDJFQUF5RTtBQUV6RSxTQUFzQixlQUFlLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjs7UUFDakYsSUFBSSxDQUFDO1lBQ0QsTUFBTSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQzNDLElBQUksQ0FBQyxVQUFVO2dCQUFFLE1BQU0sSUFBSSw4QkFBZSxDQUFDLDZCQUE2QixDQUFDLENBQUM7WUFDMUUsSUFBSSxDQUFDLFNBQVM7Z0JBQUUsTUFBTSxJQUFJLDhCQUFlLENBQUMsOEJBQThCLENBQUMsQ0FBQztZQUUxRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDbEMsSUFBSSxPQUFPLFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxRQUFRLEVBQUUsQ0FBQztvQkFDdEMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDcEQsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsTUFBTSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxHQUFHLFVBQVUsQ0FBQztZQUM5RCxNQUFNLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsR0FBRyxTQUFTLENBQUE7WUFFaEQsSUFBSSxDQUFDLFNBQVM7Z0JBQUUsTUFBTSxJQUFJLDhCQUFlLENBQUMsd0JBQXdCLENBQUMsQ0FBQztZQUNwRSxJQUFJ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