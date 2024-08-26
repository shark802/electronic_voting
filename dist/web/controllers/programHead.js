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
exports.programHeadDashboardVoteTallyPage = exports.programHeadDashboardOverviewPage = void 0;
const database_1 = require("../../config/database");
const query_1 = require("../../data_access/query");
function programHeadDashboardOverviewPage(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const elections = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM elections WHERE is_close = 0 AND deleted_at IS NULL ORDER BY date_start, time_start');
            const electionIdList = elections.map(election => election.election_id);
            let populationPerProgram = [];
            if (electionIdList.length > 0) {
                populationPerProgram = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM program_populations WHERE election_id IN ( ? )', [electionIdList]);
            }
            console.log(populationPerProgram);
            res.render("program/dashboard_overview_program_head", { elections, populationPerProgram });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.programHeadDashboardOverviewPage = programHeadDashboardOverviewPage;
function programHeadDashboardVoteTallyPage(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.render('program/dashboard-vote-tally-program-head');
        }
        catch (error) {
            next(error);
        }
    });
}
exports.programHeadDashboardVoteTallyPage = programHeadDashboardVoteTallyPage;
