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
exports.generateNotVotedReportInPdf = void 0;
const voterService_1 = require("../../data_access/voterService");
require("jspdf-autotable");
const query_1 = require("../../data_access/query");
const database_1 = require("../../config/database");
const generateTablePdf_1 = require("../../utils/reportUtils/generateTablePdf");
function generateNotVotedReportInPdf(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const election_id = req.params.id;
            if (!election_id)
                throw new Error('Cannot generate PDF report, election ID is missing.');
            const voterUsers = yield (0, voterService_1.getAllNotVotedInElection)(election_id);
            const [election] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM elections WHERE election_id = ? LIMIT 1', [election_id]);
            const pdfBuffer = yield (0, generateTablePdf_1.genereateTablePdf)(voterUsers, 'List of Not Voted', election.election_name);
            // Set headers for PDF download
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="election_not_voted_report.pdf"');
            // Send the PDF as a response
            res.send(pdfBuffer);
        }
        catch (error) {
            console.error('Error generating PDF:', error);
            next(error);
        }
    });
}
exports.generateNotVotedReportInPdf = generateNotVotedReportInPdf;
