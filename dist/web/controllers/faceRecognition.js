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
exports.faceAuthenticatePage = exports.faceRegisterPage = void 0;
const query_1 = require("../../data_access/query");
const database_1 = require("../../config/database");
function faceRegisterPage(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.render('face-recognition/face-register');
        }
        catch (error) {
            next(error);
        }
    });
}
exports.faceRegisterPage = faceRegisterPage;
function faceAuthenticatePage(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const id_number = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.user_id;
        const electionId = req.query.election;
        const [registerFace] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM register_faces WHERE id_number = ? LIMIT 1', [id_number]);
        if (!registerFace)
            return res.redirect('/election?redirectMessage=No face registered found for this user!');
        res.render('face-recognition/face-authenticate', { electionId });
    });
}
exports.faceAuthenticatePage = faceAuthenticatePage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZVJlY29nbml0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3dlYi9jb250cm9sbGVycy9mYWNlUmVjb2duaXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EsbURBQXNEO0FBRXRELG9EQUE2QztBQUU3QyxTQUFzQixnQkFBZ0IsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCOztRQUNsRixJQUFJLENBQUM7WUFFRCxHQUFHLENBQUMsTUFBTSxDQUFDLGdDQUFnQyxDQUFDLENBQUE7UUFFaEQsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDYixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDZixDQUFDO0lBQ0wsQ0FBQztDQUFBO0FBUkQsNENBUUM7QUFFRCxTQUFzQixvQkFBb0IsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCOzs7UUFDdEYsTUFBTSxTQUFTLEdBQUcsTUFBQSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksMENBQUUsT0FBTyxDQUFDO1FBQzVDLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBRXRDLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxNQUFNLElBQUEsbUJBQVcsRUFBZ0IsZUFBSSxFQUFFLDBEQUEwRCxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUV2SSxJQUFJLENBQUMsWUFBWTtZQUFFLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxtRUFBbUUsQ0FBQyxDQUFDO1FBRTVHLEdBQUcsQ0FBQyxNQUFNLENBQUMsb0NBQW9DLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFBO0lBQ3BFLENBQUM7Q0FBQTtBQVRELG9EQVNDIn0=