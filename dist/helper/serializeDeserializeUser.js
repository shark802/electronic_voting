"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passport = void 0;
const passport_1 = __importDefault(require("passport"));
exports.passport = passport_1.default;
passport_1.default.serializeUser((user, done) => {
    done(user.id_number);
});
passport_1.default.deserializeUser((user_id, done) => {
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VyaWFsaXplRGVzZXJpYWxpemVVc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2hlbHBlci9zZXJpYWxpemVEZXNlcmlhbGl6ZVVzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0RBQWdDO0FBV3hCLG1CQVhELGtCQUFRLENBV0M7QUFSaEIsa0JBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLEVBQUcsSUFBSSxFQUFFLEVBQUU7SUFDbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN6QixDQUFDLENBQUMsQ0FBQztBQUVILGtCQUFRLENBQUMsZUFBZSxDQUFDLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFO0FBRTNDLENBQUMsQ0FBQyxDQUFDIn0=