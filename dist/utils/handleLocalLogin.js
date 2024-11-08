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
exports.handleLocalLogin = void 0;
const database_1 = require("../config/database");
const query_1 = require("../data_access/query");
const customErrors_1 = require("./customErrors");
const bcrypt_1 = __importDefault(require("bcrypt"));
function handleLocalLogin(id_number, password, req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [user] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT password FROM users WHERE id_number = ?', [id_number]);
            if (!user) {
                return next(new customErrors_1.UnauthorizedError("Login Failed!"));
            }
            const isPasswordMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordMatch)
                throw new customErrors_1.UnauthorizedError("Login Failed!");
            const [userRoleRow] = yield (0, query_1.selectQuery)(database_1.pool, "SELECT * FROM roles WHERE id_number = ?", [id_number]);
            req.session.user = {
                user_id: id_number,
                roles: {
                    admin: userRoleRow.admin,
                    program_head: userRoleRow.program_head,
                    voter: userRoleRow.voter
                }
            };
            if (userRoleRow.admin)
                return res.redirect('/admin/dashboard/overview');
            if (userRoleRow.program_head)
                return res.redirect('/program-head/dashboard/overview');
            return res.redirect('/election');
        }
        catch (error) {
            next(error);
        }
    });
}
exports.handleLocalLogin = handleLocalLogin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFuZGxlTG9jYWxMb2dpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9oYW5kbGVMb2NhbExvZ2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUNBLGlEQUEwQztBQUMxQyxnREFBbUQ7QUFDbkQsaURBQW1EO0FBR25ELG9EQUE0QjtBQUc1QixTQUFzQixnQkFBZ0IsQ0FBQyxTQUFpQixFQUFFLFFBQWdCLEVBQUUsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjs7UUFDdkgsSUFBSSxDQUFDO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sSUFBQSxtQkFBVyxFQUFPLGVBQUksRUFBRSxnREFBZ0QsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFFNUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNSLE9BQU8sSUFBSSxDQUFDLElBQUksZ0NBQWlCLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUN4RCxDQUFDO1lBRUQsTUFBTSxlQUFlLEdBQUcsTUFBTSxnQkFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRXRFLElBQUksQ0FBQyxlQUFlO2dCQUFFLE1BQU0sSUFBSSxnQ0FBaUIsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUVuRSxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsTUFBTSxJQUFBLG1CQUFXLEVBQU8sZUFBSSxFQUFFLHlDQUF5QyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUM1RyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRztnQkFDZixPQUFPLEVBQUUsU0FBUztnQkFDbEIsS0FBSyxFQUFFO29CQUNILEtBQUssRUFBRSxXQUFXLENBQUMsS0FBSztvQkFDeEIsWUFBWSxFQUFFLFdBQVcsQ0FBQyxZQUFZO29CQUN0QyxLQUFLLEVBQUUsV0FBVyxDQUFDLEtBQUs7aUJBQzNCO2FBQ0osQ0FBQztZQUVGLElBQUksV0FBVyxDQUFDLEtBQUs7Z0JBQUUsT0FBTyxHQUFHLENBQUMsUUFBUSxDQUFDLDJCQUEyQixDQUFDLENBQUM7WUFDeEUsSUFBSSxXQUFXLENBQUMsWUFBWTtnQkFBRSxPQUFPLEdBQUcsQ0FBQyxRQUFRLENBQUMsa0NBQWtDLENBQUMsQ0FBQztZQUN0RixPQUFPLEdBQUcsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFckMsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDYixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEIsQ0FBQztJQUNMLENBQUM7Q0FBQTtBQTdCRCw0Q0E2QkMifQ==