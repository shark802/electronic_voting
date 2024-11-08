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
exports.isFaceVerified = exports.logoutFunction = exports.loginFunction = void 0;
const customErrors_1 = require("../../utils/customErrors");
const convertApiObjectToUser_1 = require("../../utils/convertApiObjectToUser");
const database_1 = require("../../config/database");
const createUser_1 = require("../../utils/createUser");
const query_1 = require("../../data_access/query");
const handleLocalLogin_1 = require("../../utils/handleLocalLogin");
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
                if (rowResult.length === 0) {
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
            if (error instanceof Error && error.name === 'TypeError' && error.message === 'fetch failed') {
                yield (0, handleLocalLogin_1.handleLocalLogin)(id_number, password, req, res, next);
            }
            else {
                next(error);
            }
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
function isFaceVerified(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            if (!req.session || !((_a = req.session) === null || _a === void 0 ? void 0 : _a.user))
                throw new customErrors_1.UnauthorizedError('Login Required');
            const faceVerified = (_b = req.body) === null || _b === void 0 ? void 0 : _b.faceVerified;
            if (faceVerified === undefined || faceVerified === null)
                throw new customErrors_1.BadRequestError('Face verified status is missing');
            req.session.faceVerified = faceVerified;
            return res.status(200).end();
        }
        catch (error) {
            next(error);
        }
    });
}
exports.isFaceVerified = isFaceVerified;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvY29udHJvbGxlcnMvYXV0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFDQSwyREFBOEU7QUFFOUUsK0VBQTRFO0FBQzVFLG9EQUE2QztBQUM3Qyx1REFBb0Q7QUFFcEQsbURBQXNEO0FBRXRELG1FQUFnRTtBQUVoRSxTQUFzQixhQUFhLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjs7UUFDL0UsTUFBTSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1FBQ3pDLElBQUksQ0FBQztZQUNELElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxRQUFRO2dCQUFFLE1BQU0sSUFBSSw4QkFBZSxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFFL0UsTUFBTSxRQUFRLEdBQUcsTUFBTSxLQUFLLENBQUMsNkRBQTZELFNBQVMsZ0JBQWdCLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDL0gsTUFBTSxpQkFBaUIsR0FBdUIsTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFcEUsSUFBSSxpQkFBaUIsQ0FBQyxRQUFRLEtBQUssS0FBSztnQkFBRSxNQUFNLElBQUksZ0NBQWlCLENBQUMsZUFBZSxDQUFDLENBQUM7WUFFdkYsbUJBQW1CO1lBQ25CLE1BQU0sSUFBSSxHQUFHLElBQUEsK0NBQXNCLEVBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUN2RCxNQUFNLFVBQVUsR0FBRyxNQUFNLGVBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUU5QyxJQUFJLENBQUM7Z0JBQ0QsTUFBTSxVQUFVLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztnQkFFcEMsTUFBTSxJQUFBLHVCQUFVLEVBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsOEJBQThCO2dCQUNsRSxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsTUFBTSxV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