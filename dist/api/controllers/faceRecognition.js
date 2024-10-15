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
exports.getFaceRecognitionServiceDomain = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const customErrors_1 = require("../../utils/customErrors");
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
