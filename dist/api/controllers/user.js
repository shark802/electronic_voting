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
exports.updateUserFunction = exports.newUserFunction = void 0;
const customErrors_1 = require("../../utils/customErrors");
const query_1 = require("../../data_access/query");
const database_1 = require("../../config/database");
function newUserFunction(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idNumber, course, firstname, lastname } = req.body;
            if (!idNumber)
                throw new customErrors_1.BadRequestError('Missing Id number');
            if (!course)
                throw new customErrors_1.BadRequestError('Missing course');
            if (!firstname)
                throw new customErrors_1.BadRequestError('Missing firstname');
            if (!lastname)
                throw new customErrors_1.BadRequestError('Missing lastname');
            const [user] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM users WHERE id_number = ? LIMIT 1', [idNumber]);
            if (user)
                throw new customErrors_1.ConflictError(`User ${idNumber} already created`);
            const result = yield (0, query_1.insertQuery)(database_1.pool, 'INSERT INTO users (id_number, firstname, lastname, course) VALUES(?, ?, ?, ?)', [idNumber, firstname, lastname, course]);
            if (result.affectedRows < 1)
                throw new Error("Adding user failed");
            return res.status(200).json({ message: 'Succesfully added new user' });
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
            const { idNumber, userObject, userRoles } = req.body;
            if (!idNumber)
                throw new customErrors_1.BadRequestError('User id number is missing');
            if (!userObject)
                throw new customErrors_1.BadRequestError('User data need for update is missing');
            if (!userRoles)
                throw new customErrors_1.BadRequestError('User roles object is missing');
            const userUpdateResult = yield (0, query_1.updateQuery)(database_1.pool, 'UPDATE users SET = ? WHERE id_number = ?', [userObject, idNumber]);
            const userRolesUpdateResult = yield (0, query_1.updateQuery)(database_1.pool, 'UPDATE roles SET = ? WHERE id_number = ?', [userRoles, idNumber]);
            if (userUpdateResult.affectedRows <= 0 || userRolesUpdateResult.affectedRows <= 0)
                throw new customErrors_1.NotFoundError('No user updated, please check if user exist');
            return res.status(200).json({ messasge: 'Update successfull' });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.updateUserFunction = updateUserFunction;
