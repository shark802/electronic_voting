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
exports.updateElectionStatus = exports.updateElection = exports.deleteElection = exports.findElectionByID = exports.createElection = void 0;
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
            const election_id = req.params.id;
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
function updateElectionStatus(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const electionID = req.params.id;
            const electionStatus = req.query.status;
            console.log(electionID, electionStatus);
            if (!electionID || !electionStatus)
                return next(new customErrors_1.BadRequestError());
            const query = "UPDATE elections SET is_active = ? WHERE election_id = ?";
            const sqlParams = [electionStatus, electionID];
            const result = yield (0, query_1.updateQuery)(database_1.pool, query, sqlParams);
            return res.status(200).json({ result });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.updateElectionStatus = updateElectionStatus;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpL2NvbnRyb2xsZXJzL2VsZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLG9EQUE2QztBQUM3QyxtREFBZ0Y7QUFDaEYsK0JBQTJCO0FBQzNCLDJEQUErRjtBQUkvRixTQUFzQixjQUFjLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjs7UUFDbkYsSUFBSSxDQUFDO1lBQ0osTUFBTSxFQUFFLGFBQWEsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQy9FLElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDNUUsT0FBTyxJQUFJLENBQUMsSUFBSSw4QkFBZSxDQUFDLDRDQUE0QyxDQUFDLENBQUMsQ0FBQTtZQUMvRSxDQUFDO1lBQ0QsTUFBTSxXQUFXLEdBQUcsSUFBQSxXQUFJLEdBQUUsQ0FBQTtZQUUxQixNQUFNLEtBQUssR0FBRywwSEFBMEgsQ0FBQTtZQUN4SSxNQUFNLE1BQU0sR0FBRyxDQUFDLFdBQVcsRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUE7WUFDdkYsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFBLG1CQUFXLEVBQUMsZUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQTtZQUVyRCxJQUFJLE1BQU0sQ0FBQyxZQUFZLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQzdCLE9BQU8sSUFBSSxDQUFDLElBQUksa0NBQW1CLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxDQUFBO1lBQ2xFLENBQUM7WUFFRCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FB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