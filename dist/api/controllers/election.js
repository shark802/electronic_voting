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
exports.updateElection = exports.deleteElection = exports.findElectionByID = exports.createElection = void 0;
const database_1 = require("../../config/database");
const query_1 = require("../../data_access/query");
const ulid_1 = require("ulid");
const customErrors_1 = require("../../utils/customErrors");
function createElection(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { election_name, date_start, time_start, date_end, time_end } = req.body;
            if (!election_name || !date_start || !time_start || !date_end || !time_end) {
                return next(new customErrors_1.BadRequestError("Bad request, some missing data is required"));
            }
            const election_id = (0, ulid_1.ulid)();
            const query = "INSERT INTO elections (election_id, election_name, date_start, time_start, date_end, time_end) VALUES (?, ?, ?, ?, ?, ?)";
            const values = [election_id, election_name, date_start, time_start, date_end, time_end];
            const result = yield (0, query_1.insertQuery)(database_1.pool, query, values);
            if (result.affectedRows < 1) {
                return next(new customErrors_1.InternalServerError("Failed to create election"));
            }
            res.status(201).json({ message: "Election created" });
        }
        catch (error) {
            return next(error);
        }
    });
}
exports.createElection = createElection;
/**
 * Function for searching specific election event based on id.
 * - assumes election_id is passed in req.query
 * - server will search election_id and response the resource back to client
 */
function findElectionByID(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const election_id = req.query.election_id;
            if (!election_id)
                return next(new customErrors_1.BadRequestError("Cannot find Election if election_id is missing"));
            const query = "SELECT * FROM elections WHERE election_id = ? AND deleted_at IS NULL LIMIT 1";
            const value = [election_id];
            const result = yield (0, query_1.selectQuery)(database_1.pool, query, value);
            if (result.length < 1) {
                return next(new customErrors_1.NotFoundError());
            }
            res.status(200).json({ election: result[0] });
        }
        catch (error) {
            return next(error);
        }
    });
}
exports.findElectionByID = findElectionByID;
function deleteElection(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const election_id = req.params.id;
            if (!election_id) {
                return next(new customErrors_1.BadRequestError());
            }
            const query = "UPDATE elections SET deleted_at = CURRENT_TIMESTAMP WHERE election_id = ? LIMIT 1";
            const value = [election_id];
            const result = yield (0, query_1.updateQuery)(database_1.pool, query, value);
            if (result.affectedRows < 1) {
                return next(new customErrors_1.InternalServerError());
            }
            res.sendStatus(200);
        }
        catch (error) {
            return next(error);
        }
    });
}
exports.deleteElection = deleteElection;
function updateElection(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const election_id = req.params.id;
            const { election_name, date_start, time_start, date_end, time_end } = req.body;
            if (!election_name || !date_start || !time_start || !date_end || !time_end) {
                return next(new customErrors_1.BadRequestError());
            }
            const query = "UPDATE elections SET election_name = ?, date_start= ?, time_start = ?, date_end = ?, time_end = ? WHERE election_id = ? AND deleted_at IS NULL LIMIT 1";
            const parameter = [election_name, date_start, time_start, date_end, time_end, election_id];
            const result = yield (0, query_1.updateQuery)(database_1.pool, query, parameter);
            if (result.affectedRows < 1) {
                return next(new customErrors_1.InternalServerError());
            }
            res.status(200).end();
        }
        catch (error) {
            next(error);
        }
    });
}
exports.updateElection = updateElection;
