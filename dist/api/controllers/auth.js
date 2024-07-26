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
                next(new customErrors_1.BadRequestError());
            const response = yield fetch(`https://bagocitycollege.com/BCCWeb/TPLoginAPI?txtUserName=${id_number}&txtPassword=${password}`);
            const apiResponseObject = yield response.json();
            if (apiResponseObject.is_valid === false) {
                // Login unsuccessful
                return next(new customErrors_1.UnauthorizedError("Login Failed!"));
            }
            else {
                // Login successful
                const user = (0, convertApiObjectToUser_1.convertApiObjectToUser)(apiResponseObject);
                const connection = yield database_1.pool.getConnection();
                try {
                    yield connection.beginTransaction();
                    yield (0, createUser_1.createUser)(connection, user); // save user info in database.
                    const [rowResult] = yield connection.execute("SELECT * FROM roles WHERE id_number = ?", [user.id_number]);
                    if (rowResult.length < 1) {
                        const voterRole = apiResponseObject.user_group === "STUDENT" ? 1 : 0; // assign the voter role if the user is student.
                        yield connection.execute("INSERT INTO roles (voter, id_number) VALUES (?, ?)", [voterRole, user.id_number]);
                    }
                    connection.commit();
                }
                catch (error) {
                    connection.rollback();
                    return next(error);
                }
                const [userRoleRow] = yield (0, query_1.selectQuery)(database_1.pool, "SELECT * FROM roles WHERE id_number = ?", [user.id_number]);
                req.session.user = {
                    user_id: user.id_number,
                    roles: {
                        admin: userRoleRow.admin,
                        program_head: userRoleRow.program_head,
                        voter: userRoleRow.voter
                    }
                };
                return res.status(200).json({ roles: {
                        admin: userRoleRow.admin,
                        program_head: userRoleRow.program_head,
                        voter: userRoleRow.voter
                    } });
            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvY29udHJvbGxlcnMvYXV0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFDQSwyREFBOEU7QUFFOUUsK0VBQTRFO0FBQzVFLG9EQUE2QztBQUM3Qyx1REFBb0Q7QUFFcEQsbURBQXNEO0FBR3RELFNBQXNCLGFBQWEsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCOztRQUMvRSxJQUFJLENBQUM7WUFDRCxNQUFNLEVBQUMsU0FBUyxFQUFFLFFBQVEsRUFBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDdkMsSUFBRyxDQUFDLFNBQVMsSUFBSSxDQUFDLFFBQVE7Z0JBQUUsSUFBSSxDQUFDLElBQUksOEJBQWUsRUFBRSxDQUFDLENBQUM7WUFFeEQsTUFBTSxRQUFRLEdBQUcsTUFBTSxLQUFLLENBQUMsNkRBQTZELFNBQVMsZ0JBQWdCLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDL0gsTUFBTSxpQkFBaUIsR0FBdUIsTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFcEUsSUFBRyxpQkFBaUIsQ0FBQyxRQUFRLEtBQUssS0FBSyxFQUFFLENBQUM7Z0JBQ3RDLHFCQUFxQjtnQkFDckIsT0FBTyxJQUFJLENBQUMsSUFBSSxnQ0FBaUIsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQ3hELENBQUM7aUJBQU0sQ0FBQztnQkFDSixtQkFBbUI7Z0JBQ25CLE1BQU0sSUFBSSxHQUFHLElBQUEsK0NBQXNCLEVBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDdkQsTUFBTSxVQUFVLEdBQUcsTUFBTSxlQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBRTlDLElBQUksQ0FBQztvQkFDRCxNQUFNLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO29CQUVwQyxNQUFNLElBQUEsdUJBQVUsRUFBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMs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