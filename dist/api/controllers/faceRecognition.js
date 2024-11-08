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
            const userId = (_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.user_id;
            const savedFaceFilename = req.body.filename;
            if (!savedFaceFilename)
                throw new customErrors_1.BadRequestError('Filename of saved face image is not provided');
            const insertResult = yield (0, query_1.insertQuery)(database_1.pool, 'INSERT INTO register_faces (id_number, saved_face_filename, registered_at) VALUES (?, ?, CURRENT_TIMESTAMP)', [userId, savedFaceFilename]);
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
                throw new customErrors_1.UnauthorizedError(`Request failed, You have'nt login yet! `);
            const userId = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.user_id;
            const [RegisterFaceInfo] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM register_faces WHERE id_number = ? LIMIT 1', [userId]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZVJlY29nbml0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaS9jb250cm9sbGVycy9mYWNlUmVjb2duaXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQ0Esb0RBQTJCO0FBQzNCLDJEQUE2RjtBQUM3RixtREFBbUU7QUFDbkUsb0RBQTZDO0FBRTdDLGdCQUFNLENBQUMsTUFBTSxFQUFFLENBQUE7QUFFZixTQUFzQiwrQkFBK0IsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCOztRQUNqRyxJQUFJLENBQUM7WUFFRCxNQUFNLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUM7WUFDdEUsSUFBSSxDQUFDLGlCQUFpQjtnQkFBRSxNQUFNLElBQUksNEJBQWEsQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1lBRTlGLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO1FBQ2hELENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ2YsQ0FBQztJQUNMLENBQUM7Q0FBQTtBQVZELDBFQVVDO0FBRUQsU0FBc0IsMEJBQTBCLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjs7O1FBQzVGLElBQUksQ0FBQztZQUVELElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTztnQkFBRSxNQUFNLElBQUksZ0NBQWlCLENBQUMsMEJBQTBCLENBQUMsQ0FBQTtZQUN6RSxNQUFNLE1BQU0sR0FBRyxNQUFBLE1BQUEsR0FBRyxDQUFDLE9BQU8sMENBQUUsSUFBSSwwQ0FBRSxPQUFPLENBQUM7WUFDMUMsTUFBTSxpQkFBaUIsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUU1QyxJQUFJLENBQUMsaUJBQWlCO2dC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