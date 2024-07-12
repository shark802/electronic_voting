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
exports.loginFunction = void 0;
const customErrors_1 = require("../../utils/customErrors");
function loginFunction(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_number, password } = req.body;
            console.log(id_number, password);
            if (!id_number || !password)
                next(new customErrors_1.BadRequestError());
            const response = yield fetch(`https://bagocitycollege.com/BCCWeb/TPLoginAPI?txtUserName=${id_number}&txtPassword=${password}`);
            const responseMessage = yield response.json();
            if (responseMessage.is_valid === false)
                return next(new customErrors_1.UnauthorizedError("Login Failed!"));
            else
                return res.status(200).end();
        }
        catch (error) {
        }
    });
}
exports.loginFunction = loginFunction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvY29udHJvbGxlcnMvYXV0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFDQSwyREFBOEU7QUFFOUUsU0FBc0IsYUFBYSxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7O1FBQy9FLElBQUksQ0FBQztZQUNELE1BQU0sRUFBQyxTQUFTLEVBQUUsUUFBUSxFQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUN2QyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNqQyxJQUFHLENBQUMsU0FBUyxJQUFJLENBQUMsUUFBUTtnQkFBRSxJQUFJLENBQUMsSUFBSSw4QkFBZSxFQUFFLENBQUMsQ0FBQztZQUV4RCxNQUFNLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQyw2REFBNkQsU0FBUyxnQkFBZ0IsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUMvSCxNQUFNLGVBQWUsR0FBRyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUU5QyxJQUFHLGVBQWUsQ0FBQyxRQUFRLEtBQUssS0FBSztnQkFBRSxPQUFPLElBQUksQ0FBQyxJQUFJLGdDQUFpQixDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7O2dCQUN0RixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDdEMsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFFakIsQ0FBQztJQUNMLENBQUM7Q0FBQTtBQWRELHNDQWNDIn0=