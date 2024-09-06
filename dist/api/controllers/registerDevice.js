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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXJEZXZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpL2NvbnRyb2xsZXJzL3JlZ2lzdGVyRGV2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLDJEQUEwRTtBQUMxRSwrQkFBb0M7QUFDcEMsbURBQWdGO0FBQ2hGLG9EQUE2QztBQUc3QyxTQUFzQixtQkFBbUIsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCOztRQUNyRixJQUFJLENBQUM7WUFDRCxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUM5QixJQUFJLENBQUMsUUFBUTtnQkFBRSxNQUFNLElBQUksOEJBQWUsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1lBRXRFLE1BQU0sSUFBSSxHQUFHLElBQUEsU0FBTSxHQUFFLENBQUM7WUFDdEIsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFBLG1CQUFXLEVBQUMsZUFBSSxFQUFFLDREQUE0RCxFQUFFLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDdkgsSUFBSSxNQUFNLENBQUMsWUFBWSxHQUFHLENBQUM7Z0JBQUUsTUFBTSxJQUFJLDRCQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUV4RSxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7UUFDaEUsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDYixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEIsQ0FBQztJQUNMLENBQUM7Q0FBQTtBQWJELGtEQWFDO0FBRUQsU0FBc0Isc0JBQXNCLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjs7UUFDeEYsSUFBSSxDQUFDO1lBQ0QsTUFBTSxJQUFJLEdBQUcs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