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
            const usersFile = req.file;
            if (!usersFile)
                throw new customErrors_1.BadRequestError('Users data file is not provided');
            const userCsvFile = yield (0, csvtojson_1.default)().fromFile(usersFile.path);
            const fileName = usersFile.filename;
            fs_1.default.unlinkSync(usersFile.path);
            console.log(`Importing ${fileName}`);
            const startTime = Date.now();
            const importSize = yield (0, importUserToDatabase_1.importUsersToDatabase)(userCsvFile); // This function offload the process of importing the users in database on workter threads
            const endTime = Date.now();
            const importTimeInMinutes = (endTime - startTime) / 1000;
            const processResult = {
                timeTaken: importTimeInMinutes,
                importSize: importSize
            };
            console.log(`Successfully processed ${importSize} users. \n Time taken: ${importTimeInMinutes} mins.`);
            res.status(200).json({ message: `Successfully processed ${importSize} users.` });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.importUsers = importUsers;
