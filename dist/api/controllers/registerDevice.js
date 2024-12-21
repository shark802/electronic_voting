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
exports.validateUuid = exports.checkUuidStatus = exports.updateRegisterStatusFunction = exports.declineRequestFunction = exports.requestUuidFunction = void 0;
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
            const socket = res.locals.io;
            socket.emit('new-register-device-request', codeName, uuid);
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
            const isToRegister = req.body.isToRegister;
            if (!uuid)
                throw new customErrors_1.BadRequestError('UUID is missing');
            if (isToRegister === undefined)
                throw new customErrors_1.BadRequestError('Provide action to perform update register status');
            const registerQuery = yield (0, query_1.updateQuery)(database_1.pool, "UPDATE register_devices SET is_registered = ?, updated_at = NOW() WHERE uuid = ? AND deleted_at IS NULL", [isToRegister, uuid]);
            if (registerQuery.affectedRows < 1)
                throw new customErrors_1.NotFoundError('No resource modified, check UUID if correct');
            // const socket = res.locals.socket;
            // const status = Number(isToRegister) === 1 ? 'REGISTERED' : 'PENDING';
            // socket.emit(uuid, status); // emit the event to client with uuid
            const responseMessage = isToRegister === true ? 'Device successfully registered' : 'Device unregistered';
            return res.status(200).json({ message: responseMessage });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.updateRegisterStatusFunction = updateRegisterStatusFunction;
function checkUuidStatus(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const uuid = req.params.id;
            if (!uuid)
                throw new customErrors_1.BadRequestError('Please provide UUID');
            const [uuidFound] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM register_devices WHERE uuid = ? LIMIT 1', [uuid]);
            if (!uuidFound)
                throw new customErrors_1.NotFoundError('Device UUID not found');
            let status;
            if (uuidFound.deleted_at) {
                status = "DELETED";
            }
            else if (uuidFound.is_registered === 1) {
                status = "REGISTERED";
            }
            else {
                status = "PENDING";
            }
            return res.status(200).json({ status });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.checkUuidStatus = checkUuidStatus;
function validateUuid(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const uuid = req.body.uuid;
            if (!uuid)
                throw new customErrors_1.BadRequestError('Uuid is undefined');
            const [uuidRow] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM register_devices WHERE uuid = ? AND deleted_at IS NULL', [uuid]);
            if (!uuidRow)
                throw new customErrors_1.NotFoundError('Uuid not found!');
            const isUuidRegistered = uuidRow.is_registered === 1 ? "REGISTERED" : "UNREGISTERED";
            req.session.deviceRegistrationStatus = isUuidRegistered;
            return res.status(200).end();
        }
        catch (error) {
            next(error);
        }
    });
}
exports.validateUuid = validateUuid;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXJEZXZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpL2NvbnRyb2xsZXJzL3JlZ2lzdGVyRGV2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLDJEQUEwRTtBQUMxRSwrQkFBb0M7QUFDcEMsbURBQWdGO0FBQ2hGLG9EQUE2QztBQUk3QyxTQUFzQixtQkFBbUIsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCOztRQUNyRixJQUFJLENBQUM7WUFDRCxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUM5QixJQUFJLENBQUMsUUFBUTtnQkFBRSxNQUFNLElBQUksOEJBQWUsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1lBRXRFLE1BQU0sSUFBSSxHQUFHLElBQUEsU0FBTSxHQUFFLENBQUM7WUFDdEIsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFBLG1CQUFXLEVBQUMsZUFBSSxFQUFFLDREQUE0RCxFQUFFLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDdkgsSUFBSSxNQUFNLENBQUMsWUFBWSxHQUFHLENBQUM7Z0JBQUUsTUFBTSxJQUFJLDRCQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUV4RSxNQUFNLE1BQU0sR0FBVyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUVyQyxNQUFNLENBQUMsSUFBSSxDQUFDLDZCQUE2QixFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMzRCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7UUFDaEUsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDYixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEIsQ0FB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