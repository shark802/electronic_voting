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
exports.getAllIpAddress = exports.removeIpAddress = exports.getIpAddress = exports.addIpAddress = void 0;
const query_1 = require("../../data_access/query");
const database_1 = require("../../config/database");
const customErrors_1 = require("../../utils/customErrors");
function addIpAddress(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ipAddress = req.body.ipAddress;
            const networkName = req.body.networkName;
            if (!ipAddress || !networkName)
                throw new Error('Ip address and network name are required');
            const existingIpAddress = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM ip_address WHERE ip_address = ? AND deleted_at IS NULL LIMIT 1', [ipAddress.trim()]);
            if (existingIpAddress.length > 0)
                throw new customErrors_1.ConflictError(`${ipAddress} already exist`);
            const insertedIpAddress = yield (0, query_1.insertQuery)(database_1.pool, 'INSERT INTO ip_address (network_name, ip_address) VALUES (?, ?)', [String(networkName).trim(), String(ipAddress).trim()]);
            if (insertedIpAddress.affectedRows === 0) {
                throw new Error('Failed to insert ip address');
            }
            return res.status(200).json({ message: 'Ip address added successfully' });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.addIpAddress = addIpAddress;
function getIpAddress(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ipAddress = req.query.ipAddress;
            if (!ipAddress)
                return res.status(200);
            const [ipAddressResult] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM ip_address WHERE ip_address = ? AND deleted_at IS NULL LIMIT 1', [ipAddress.trim()]);
            if (!ipAddressResult) {
                return res.status(200).json({ message: `${ipAddress} is not registered` });
            }
            return res.status(200).json({ ip_address: ipAddressResult.ip_address });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getIpAddress = getIpAddress;
function removeIpAddress(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ipAddress = req.body.ipAddress;
            if (!ipAddress)
                throw new Error('Ip address is required');
            const [ipAddressResult] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM ip_address WHERE ip_address = ? AND deleted_at IS NULL LIMIT 1', [ipAddress]);
            if (!ipAddressResult)
                throw new customErrors_1.NotFoundError(`${ipAddress} not found`);
            const deletedIpAddress = yield (0, query_1.updateQuery)(database_1.pool, 'UPDATE ip_address SET deleted_at = ? WHERE ip_address = ?', [new Date(), ipAddress]);
            if (deletedIpAddress.affectedRows === 0)
                throw new Error('Failed to delete ip address');
            return res.status(200).json({ message: `${ipAddress} deleted successfully` });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.removeIpAddress = removeIpAddress;
function getAllIpAddress(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ipAddress = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM ip_address WHERE deleted_at IS NULL');
            return res.status(200).json({ ipAddress });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getAllIpAddress = getAllIpAddress;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXBBZGRyZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaS9jb250cm9sbGVycy9pcEFkZHJlc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EsbURBQWdGO0FBQ2hGLG9EQUE2QztBQUU3QywyREFBd0U7QUFFeEUsU0FBc0IsWUFBWSxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7O1FBQzlFLElBQUksQ0FBQztZQUNELE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ3JDLE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBRXpDLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxXQUFXO2dCQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsMENBQTBDLENBQUMsQ0FBQztZQUU1RixNQUFNLGlCQUFpQixHQUFHLE1BQU0sSUFBQSxtQkFBVyxFQUFZLGVBQUksRUFBRSw4RUFBOEUsRUFBRSxDQUFFLFNBQW9CLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzdLLElBQUksaUJBQWlCLENBQUMsTUFBTSxHQUFHLENBQUM7Z0JBQUUsTUFBTSxJQUFJLDRCQUFhLENBQUMsR0FBRyxTQUFTLGdCQUFnQixDQUFDLENBQUM7WUFFeEYsTUFBTSxpQkFBaUIsR0FBRyxNQUFNLElBQUEsbUJBQVcsRUFBQyxlQUFJLEVBQUUsaUVBQWlFLEVBQUUsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM3SyxJQUFJLGlCQUFpQixDQUFDLFlBQVksS0FBSyxDQUFDLEVBQUUsQ0FBQztnQkFDdkMsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1lBQ25ELENBQUM7WUFFRCxPQUFPLEdB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