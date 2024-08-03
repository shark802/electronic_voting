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
                connection.commit();
            }
            catch (error) {
                connection.rollback();
                return next(error);
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
            return res.status(200).json({
                roles: {
                    admin: userRoleRow.admin,
                    program_head: userRoleRow.program_head,
                    voter: userRoleRow.voter
                }
            });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvY29udHJvbGxlcnMvYXV0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFDQSwyREFBOEU7QUFFOUUsK0VBQTRFO0FBQzVFLG9EQUE2QztBQUM3Qyx1REFBb0Q7QUFFcEQsbURBQXNEO0FBR3RELFNBQXNCLGFBQWEsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCOztRQUMvRSxJQUFJLENBQUM7WUFDRCxNQUFNLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDekMsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLFFBQVE7Z0JBQUUsTUFBTSxJQUFJLDhCQUFlLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUUvRSxNQUFNLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQyw2REFBNkQsU0FBUyxnQkFBZ0IsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUMvSCxNQUFNLGlCQUFpQixHQUF1QixNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUVwRSxJQUFJLGlCQUFpQixDQUFDLFFBQVEsS0FBSyxLQUFLO2dCQUFFLE1BQU0sSUFBSSxnQ0FBaUIsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUV2RixtQkFBbUI7WUFDbkIsTUFBTSxJQUFJLEdBQUcsSUFBQSwrQ0FBc0IsRUFBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3ZELE1BQU0sVUFBVSxHQUFHLE1BQU0sZUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBRTlDLElBQUksQ0FBQztnQkFDRCxNQUFNLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUVwQyxNQUFNLElBQUEsdUJBQVUsRUFBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyw4QkFBOEI7Z0JBQ2xFLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxNQUFNLFVBQVUsQ0FBQyxPQUFP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