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
exports.logoutFunction = exports.loginFunction = void 0;
const customErrors_1 = require("../../utils/customErrors");
const convertApiObjectToUser_1 = require("../../utils/convertApiObjectToUser");
const database_1 = require("../../config/database");
const createUser_1 = require("../../utils/createUser");
const query_1 = require("../../data_access/query");
function loginFunction(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_number, password } = req.body;
            if (!id_number || !password)
                throw new customErrors_1.BadRequestError("Missing credentials!");
            const response = yield fetch(`https://bagocitycollege.com/BCCWeb/TPLoginAPI?txtUserName=${id_number}&txtPassword=${password}`);
            const apiResponseObject = yield response.json();
            if (apiResponseObject.is_valid === false)
                throw new customErrors_1.UnauthorizedError("Login Failed!");
            // Login successful
            const user = (0, convertApiObjectToUser_1.convertApiObjectToUser)(apiResponseObject);
            const connection = yield database_1.pool.getConnection();
            try {
                yield connection.beginTransaction();
                yield (0, createUser_1.createUser)(connection, user); // save user info in database.
                const [rowResult] = yield connection.execute("SELECT * FROM roles WHERE id_number = ?", [user.id_number]);
                // If user dont have role yet, add role
                if (rowResult.length < 1) {
                    const voterRole = apiResponseObject.user_group === "STUDENT" ? 1 : 0; // assign the voter role if the user is student.
                    yield connection.execute("INSERT INTO roles (voter, id_number) VALUES (?, ?)", [voterRole, user.id_number]);
                }
                ;
                yield connection.commit();
            }
            catch (error) {
                yield connection.rollback();
                return next(error);
            }
            finally {
                yield connection.release();
            }
            // attach this role result to user session
            const [userRoleRow] = yield (0, query_1.selectQuery)(database_1.pool, "SELECT * FROM roles WHERE id_number = ?", [user.id_number]);
            req.session.user = {
                user_id: user.id_number,
                roles: {
                    admin: userRoleRow.admin,
                    program_head: userRoleRow.program_head,
                    voter: userRoleRow.voter
                }
            };
            if (userRoleRow.admin)
                return res.status(302).redirect('/admin/dashboard/overview');
            return res.status(302).redirect('/election');
        }
        catch (error) {
            next(error);
        }
    });
}
exports.loginFunction = loginFunction;
;
function logoutFunction(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.session)
                return next(new Error('No session found'));
            req.session.destroy((error) => {
                if (error) {
                    return next(error);
                }
                res.clearCookie("connect.sid");
                res.status(200).json({ message: 'Logged out successfully' });
            });
        }
        catch (error) {
            console.error('Unexpected error during logout:', error);
            next(error);
        }
    });
}
exports.logoutFunction = logoutFunction;
