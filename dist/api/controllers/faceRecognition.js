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
exports.getClientRegisteredFaceFilename = exports.isClientRegisteredFace = exports.insertUserRegisterFaceInfo = exports.getFaceRecognitionServiceDomain = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const customErrors_1 = require("../../utils/customErrors");
const query_1 = require("../../data_access/query");
const database_1 = require("../../config/database");
const uuid_1 = require("uuid");
dotenv_1.default.config();
function getFaceRecognitionServiceDomain(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const faceServiceDomain = process.env.FACE_RECOGNITION_SERVICE_DOMAIN;
            if (!faceServiceDomain)
                throw new customErrors_1.NotFoundError('Face recognition service domain not found!');
            res.status(200).json({ faceServiceDomain });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getFaceRecognitionServiceDomain = getFaceRecognitionServiceDomain;
function insertUserRegisterFaceInfo(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            if (!req.session)
                throw new customErrors_1.UnauthorizedError('You need to login first!');
            const id = (0, uuid_1.v4)();
            const userId = (_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.user_id;
            const savedFaceFilename = req.body.filename;
            if (!savedFaceFilename)
                throw new customErrors_1.BadRequestError('Filename of saved face image is not provided');
            const insertResult = yield (0, query_1.insertQuery)(database_1.pool, 'INSERT INTO register_faces (id, id_number, saved_face_filename, registered_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)', [id, userId, savedFaceFilename]);
            if (insertResult.affectedRows === 0)
                throw new Error('Registration failed!');
            res.status(201).json({ message: 'Face registered' });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.insertUserRegisterFaceInfo = insertUserRegisterFaceInfo;
function isClientRegisteredFace(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            if (!req.session)
                throw new customErrors_1.UnauthorizedError(`Request failed, You have'nt login yet! `);
            const userId = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.user_id;
            const [RegisterFaceInfo] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM register_faces WHERE id_number = ? LIMIT 1', [userId]);
            const isRegistered = RegisterFaceInfo ? true : false;
            return res.status(200).json({ isRegistered });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.isClientRegisteredFace = isClientRegisteredFace;
function getClientRegisteredFaceFilename(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            if (!req.session)
                throw new customErrors_1.UnauthorizedError(`Request failed, You have'nt login yet!`);
            const userId = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.user_id;
            const [RegisterFaceInfo] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM register_faces WHERE id_number = ? AND deleted_at IS NULL LIMIT 1', [userId]);
            if (!RegisterFaceInfo || !RegisterFaceInfo.saved_face_filename)
                throw new customErrors_1.NotFoundError('Face Registration data not found!');
            return res.status(200).json({ filename: RegisterFaceInfo.saved_face_filename });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getClientRegisteredFaceFilename = getClientRegisteredFaceFilename;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZVJlY29nbml0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaS9jb250cm9sbGVycy9mYWNlUmVjb2duaXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQ0Esb0RBQTJCO0FBQzNCLDJEQUE2RjtBQUM3RixtREFBbUU7QUFDbkUsb0RBQTZDO0FBRTdDLCtCQUFpQztBQUNqQyxnQkFBTSxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBRWYsU0FBc0IsK0JBQStCLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjs7UUFDakcsSUFBSSxDQUFDO1lBRUQsTUFBTSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDO1lBQ3RFLElBQUksQ0FBQyxpQkFBaUI7Z0JBQUUsTUFBTSxJQUFJLDRCQUFhLENBQUMsNENBQTRDLENBQUMsQ0FBQztZQUU5RixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLGlCQUFpQixFQUFFLENBQUMsQ0FBQztRQUNoRCxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNiLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNmLENBQUM7SUFDTCxDQUFDO0NBQUE7QUFWRCwwRUFVQztBQUVELFNBQXNCLDBCQUEwQixDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7OztRQUM1RixJQUFJLENBQUM7WUFFRCxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU87Z0JBQUUsTUFBTSxJQUFJLGdDQUFpQixDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFFMUUsTUFBTSxFQUFFLEdBQUcsSUFBQSxTQUFJLEdBQUUsQ0FBQTtZQUNqQixNQUFNLE1BQU0sR0FBRyxNQUFBLE1BQUEsR0FBRyxDQUFDLE9BQU8sMENBQUUsSUFBSSwwQ0FBRSxPQUFPLENBQUM7WUFDMUMsTUFBTSxpQkFBaUIsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUU1QyxJQUFJLENBQUMsaUJBQWlCO2dCQUFFLE1BQU0sSUFBSSw4QkFBZSxDQUFDLDhDQUE4QyxDQUFDLENBQUM7WUFFbEcsTUFBTSxZQUFZLEdBQUcsTUFBTSxJQUFBLG1CQUFXLEVBQUMsZUFBSSxFQUFFLG9IQUFvSCxFQUFFLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7WUFDcE0sSUFBSSxZQUFZLENBQUMsWUFBWSxLQUFLLENBQUM7Z0JBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFBO1lBRTVFLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLENBQUMsQ0FBQztRQUN6RCxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNiLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNmLENBQUM7SUFDTCxDQUFDO0NBQUE7QUFsQkQsZ0VBa0JDO0FBRUQsU0FBc0Isc0JBQXNCLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjs7O1FBQ3hGLElBQUksQ0FBQztZQUNELElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTztnQkFBRSxNQUFNLElBQUksZ0NBQWlCLENBQUMseUNBQXlDLENBQUMsQ0FBQztZQUN6RixNQUFNLE1BQU0sR0FBRyxNQUFBLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSwwQ0FBRSxPQUFPLENBQUM7WUFFekMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsTUFBTSxJQUFBLG1CQUFXLEVBQWdCLGVBQUksRUFBRSwwREFBMEQsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFFeEksTUFBTSxZQUFZLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQ3JELE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO1FBRWxELENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ2YsQ0FBQztJQUNMLENBQUM7Q0FBQTtBQWJELHdEQWFDO0FBR0QsU0FBc0IsK0JBQStCLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjs7O1FBQ2pHLElBQUksQ0FBQztZQUNELElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTztnQkFBRSxNQUFNLElBQUksZ0NBQWlCLENBQUMsd0NBQXdDLENBQUMsQ0FBQztZQUN4RixNQUFNLE1BQU0sR0FBRyxNQUFBLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSwwQ0FBRSxPQUFPLENBQUM7WUFFekMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsTUFBTSxJQUFBLG1CQUFXLEVBQWdCLGVBQUksRUFBRSxpRkFBaUYsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFFL0osSUFBSSxDQUFDLGdCQUFnQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CO2dCQUFFLE1BQU0sSUFBSSw0QkFBYSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7WUFDN0gsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUE7UUFFbkYsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDYixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDZixDQUFDO0lBQ0wsQ0FBQztDQUFBO0FBYkQsMEVBYUMifQ==