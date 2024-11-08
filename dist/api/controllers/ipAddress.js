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
            const existingIpAddress = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM ip_address WHERE ip_address = ? AND deleted_at IS NULL LIMIT 1', [ipAddress]);
            if (existingIpAddress.length > 0)
                throw new customErrors_1.ConflictError(`${ipAddress} already exist`);
            const insertedIpAddress = yield (0, query_1.insertQuery)(database_1.pool, 'INSERT INTO ip_address (network_name, ip_address) VALUES (?, ?)', [networkName, ipAddress]);
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
            const [ipAddressResult] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM ip_address WHERE ip_address = ? AND deleted_at IS NULL LIMIT 1', [ipAddress]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXBBZGRyZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaS9jb250cm9sbGVycy9pcEFkZHJlc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EsbURBQWdGO0FBQ2hGLG9EQUE2QztBQUU3QywyREFBd0U7QUFFeEUsU0FBc0IsWUFBWSxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7O1FBQzlFLElBQUksQ0FBQztZQUNELE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ3JDLE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBRXpDLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxXQUFXO2dCQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsMENBQTBDLENBQUMsQ0FBQztZQUU1RixNQUFNLGlCQUFpQixHQUFHLE1BQU0sSUFBQSxtQkFBVyxFQUFZLGVBQUksRUFBRSw4RUFBOEUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDMUosSUFBSSxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQztnQkFBRSxNQUFNLElBQUksNEJBQWEsQ0FBQyxHQUFHLFNBQVMsZ0JBQWdCLENBQUMsQ0FBQztZQUV4RixNQUFNLGlCQUFpQixHQUFHLE1BQU0sSUFBQSxtQkFBVyxFQUFDLGVBQUksRUFBRSxpRUFBaUUsRUFBRSxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQy9JLElBQUksaUJBQWlCLENBQUMsWUFBWSxLQUFLLENBQUMsRUFBRSxDQUFDO2dCQUN2QyxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7WUFDbkQsQ0FBQztZQUVELE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsK0JBQStCLEVBQUUsQ0FBQyxD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