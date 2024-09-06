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
        const { id_number, password } = req.body;
        try {
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
            if (userRoleRow.program_head)
                return res.status(302).redirect('/program-head/dashboard/overview');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvY29udHJvbGxlcnMvYXV0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFDQSwyREFBOEU7QUFFOUUsK0VBQTRFO0FBQzVFLG9EQUE2QztBQUM3Qyx1REFBb0Q7QUFFcEQsbURBQXNEO0FBR3RELFNBQXNCLGFBQWEsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCOztRQUMvRSxNQUFNLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDekMsSUFBSSxDQUFDO1lBQ0QsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLFFBQVE7Z0JBQUUsTUFBTSxJQUFJLDhCQUFlLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUUvRSxNQUFNLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQyw2REFBNkQsU0FBUyxnQkFBZ0IsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUMvSCxNQUFNLGlCQUFpQixHQUF1QixNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUVwRSxJQUFJLGlCQUFpQixDQUFDLFFBQVEsS0FBSyxLQUFLO2dCQUFFLE1BQU0sSUFBSSxnQ0FBaUIsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUV2RixtQkFBbUI7WUFDbkIsTUFBTSxJQUFJLEdBQUcsSUFBQSwrQ0FBc0IsRUFBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3ZELE1BQU0sVUFBVSxHQUFHLE1BQU0sZUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBRTlDLElBQUksQ0FBQztnQkFDRCxNQUFNLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUVwQyxNQUFNLElBQUEsdUJBQVUsRUFBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyw4QkFBOEI7Z0JBQ2xFLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxNQUFNLFVBQVUsQ0FBQyxPQUFP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