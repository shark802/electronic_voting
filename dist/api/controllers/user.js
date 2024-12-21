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
exports.getAllImportUserRecords = exports.importUsers = exports.getUserByIdNumber = exports.updateUserFunction = exports.newUserFunction = void 0;
const customErrors_1 = require("../../utils/customErrors");
const query_1 = require("../../data_access/query");
const database_1 = require("../../config/database");
const csvtojson_1 = __importDefault(require("csvtojson"));
const fs_1 = __importDefault(require("fs"));
const importUserToDatabase_1 = require("../../utils/importUserToDatabase");
const uuid_1 = require("uuid");
const events_1 = require("events");
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
            if (!user)
                throw new customErrors_1.NotFoundError('User Not Found!');
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
            const socket = res.locals.io;
            const connection = yield database_1.pool.getConnection();
            try {
                const usersFile = req.file;
                if (!usersFile)
                    throw new customErrors_1.BadRequestError('Users data file is not provided');
                const importId = (0, uuid_1.v4)();
                const userCsvFile = yield (0, csvtojson_1.default)().fromFile(usersFile.path);
                const filename = usersFile.filename;
                fs_1.default.unlinkSync(usersFile.path);
                yield (0, query_1.insertQuery)(database_1.pool, 'INSERT INTO users_import_records (id, import_size) VALUES(?, ?)', [importId, userCsvFile.length]);
                yield connection.beginTransaction();
                yield connection.execute('UPDATE users SET is_active = null WHERE is_active = ?', [0]);
                yield connection.commit();
                const result = yield (0, importUserToDatabase_1.importUsersToDatabase)(userCsvFile, importId, filename, connection, socket);
                console.log(result);
                yield (0, query_1.updateQuery)(database_1.pool, 'UPDATE users_import_records SET time_taken = ?, import_size = ?, status = ? WHERE id = ?', [result.importTimeInMinutes, result.importSize, 'Successful', importId]);
                socket.emit('user-import-update', {
                    message: 'Import completed successfully!',
                    importId: importId,
                    importSize: result.importSize,
                    percentage: 100,
                    timeTaken: result.importTimeInMinutes
                });
                res.status(200).json({ import_date: new Date().toLocaleDateString(), message: 'Importing started' });
            }
            catch (error) {
                if (connection)
                    yield connection.rollback();
                next(error);
            }
            finally {
                if (connection)
                    yield connection.release();
            }
        }
        catch (error) {
            next(error);
        }
    });
}
exports.importUsers = importUsers;
function getAllImportUserRecords(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const import_records = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM users_import_records');
            res.status(200).json({ import_records });
        }
        catch (error) {
            next(events_1.errorMonitor);
        }
    });
}
exports.getAllImportUserRecords = getAllImportUserRecords;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvY29udHJvbGxlcnMvdXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQSwyREFBeUY7QUFDekYsbURBQWdGO0FBRWhGLG9EQUE2QztBQUU3QywwREFBNEI7QUFDNUIsNENBQW9CO0FBRXBCLDJFQUF5RTtBQUN6RSwrQkFBb0M7QUFDcEMsbUNBQXNDO0FBR3RDLFNBQXNCLGVBQWUsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCOztRQUNqRixJQUFJLENBQUM7WUFDRCxNQUFNLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDM0MsSUFBSSxDQUFDLFVBQVU7Z0JBQUUsTUFBTSxJQUFJLDhCQUFlLENBQUMsNkJBQTZCLENBQUMsQ0FBQztZQUMxRSxJQUFJLENBQUMsU0FBUztnQkFBRSxNQUFNLElBQUksOEJBQWUsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1lBRTFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNsQyxJQUFJLE9BQU8sVUFBVSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFFBQVEsRUFBRSxDQUFDO29CQUN0QyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUNwRCxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxNQUFNLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLEdBQUcsVUFBVSxDQUFDO1lBQzlELE1BQU0sRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxHQUFHLFNBQVMsQ0FBQTtZQUVoRCxJQUFJLENBQUMsU0FBUztnQkFBRSxNQUFNLElBQUksOEJBQWUsQ0FBQyx3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