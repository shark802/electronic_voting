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
exports.getIpAddress = exports.addIpAddress = void 0;
const query_1 = require("../../data_access/query");
const database_1 = require("../../config/database");
function addIpAddress(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ipAddress = req.body.ipAddress;
            console.log(ipAddress);
            const insertedIpAddress = yield (0, query_1.insertQuery)(database_1.pool, 'INSERT INTO ip_address (ip_address) VALUES (?)', [ipAddress]);
            if (insertedIpAddress.affectedRows === 0) {
                throw new Error('Failed to insert ip address');
            }
            res.status(200).json({ message: 'Ip address added successfully' });
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
            const [ipAddressResult] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM ip_address WHERE ip_address = ? AND deleted_at IS NULL LIMIT 1', [ipAddress]);
            res.status(200).json({ ip_address: ipAddressResult.ip_address });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getIpAddress = getIpAddress;
