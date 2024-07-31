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
exports.isValidVoter = exports.isAuthenticated = void 0;
const query_1 = require("../data_access/query");
const database_1 = require("../config/database");
function isAuthenticated(req, res, next) {
    try {
        if (!req.session.user || !req.session) {
            return res.redirect("/?redirectMessage='You need to login first'");
        }
        ;
        return next();
    }
    catch (error) {
        next(error);
    }
}
exports.isAuthenticated = isAuthenticated;
function isValidVoter(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user_id = req.session.user.user_id;
            const [user] = yield (0, query_1.selectQuery)(database_1.pool, "SELECT * FROM users WHERE id_number = ?", [user_id]);
            if (user.is_active === 0 || user.user_group !== "STUDENT") {
                return res.redirect('/election');
            }
            return next();
        }
        catch (error) {
            next(error);
        }
    });
}
exports.isValidVoter = isValidVoter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aG9yaXphdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlcy9hdXRob3JpemF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLGdEQUFtRDtBQUVuRCxpREFBMEM7QUFFMUMsU0FBZ0IsZUFBZSxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7SUFDM0UsSUFBSSxDQUFDO1FBQ0QsSUFBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ25DLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO1FBQ3ZFLENBQUM7UUFBQSxDQUFDO1FBRUYsT0FBTyxJQUFJLEVBQUUsQ0FBQztJQUVsQixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoQixDQUFDO0FBQ0wsQ0FBQztBQVhELDBDQVdDO0FBRUQsU0FBc0IsWUFBWSxDQUFDLEdBQVksRUFBRSxHQUFZLEVBQUUsSUFBa0I7O1FBQzdFLElBQUksQ0FBQztZQUNELE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSyxDQUFDLE9BQU8sQ0FBQTtZQUN6QyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxJQUFBLG1CQUFXLEVBQU8sZUFBSSxFQUFFLHlDQUF5QyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUVuRyxJQUFHLElBQUksQ0FBQyxTQUFTLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFFLENBQUM7Z0JBQ3ZELE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNyQyxDQUFDO1lBRUQsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUNsQixDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNiLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoQixDQUFDO0lBQ0wsQ0FBQztDQUFBO0FBYkQsb0NBYUMifQ==