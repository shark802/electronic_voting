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
            return res.redirect("/?redirectMessage=\"You need to login first\"");
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
                return res.redirect('/election/?redirectMessage=\"You dont have right to vote on this election\"');
            }
            return next();
        }
        catch (error) {
            next(error);
        }
    });
}
exports.isValidVoter = isValidVoter;
