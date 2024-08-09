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
exports.updateRegisterStatusFunction = exports.declineRequestFunction = exports.requestUuidFunction = void 0;
const customErrors_1 = require("../../utils/customErrors");
const uuid_1 = require("uuid");
const query_1 = require("../../data_access/query");
const database_1 = require("../../config/database");
function requestUuidFunction(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { codeName } = req.body;
            if (!codeName)
                throw new customErrors_1.BadRequestError("Please preovide code name");
            const uuid = (0, uuid_1.v4)();
            const result = yield (0, query_1.insertQuery)(database_1.pool, "INSERT INTO register_devices (uuid, codename) VALUES(?, ?)", [uuid, codeName]);
            if (result.affectedRows < 1)
                throw new customErrors_1.NotFoundError('No record added');
            res.status(201).json({ codeName, uuid, status: 'pending' });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.requestUuidFunction = requestUuidFunction;
function declineRequestFunction(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const uuid = req.params.id;
            if (!uuid)
                throw new customErrors_1.BadRequestError("Missing UUID");
            const deleteResult = yield (0, query_1.updateQuery)(database_1.pool, 'UPDATE register_devices SET deleted_at = CURDATE() WHERE uuid = ? AND deleted_at IS NULL', [uuid]);
            if (deleteResult.affectedRows < 1)
                throw new customErrors_1.NotFoundError('No resource modified, check the uuid if correct');
            return res.status(200).json({ message: 'Request declined' });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.declineRequestFunction = declineRequestFunction;
function updateRegisterStatusFunction(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const uuid = req.params.id;
            const action = req.body.action;
            if (!uuid)
                throw new customErrors_1.BadRequestError('UUID is missing');
            if (!action)
                throw new customErrors_1.BadRequestError('Provide action to perform update register status');
            const registerQuery = yield (0, query_1.updateQuery)(database_1.pool, "UPDATE register_devices SET is_registered = ? WHERE uuid = ? AND deleted_at IS NULL", [action, uuid]);
            if (registerQuery.affectedRows < 1)
                throw new customErrors_1.NotFoundError('No resource modified, check UUID if correct');
            const responseMessage = Number(action) === 1 ? 'Device successfully registered' : 'Device unregistered';
            return res.status(200).json({ message: responseMessage });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.updateRegisterStatusFunction = updateRegisterStatusFunction;
