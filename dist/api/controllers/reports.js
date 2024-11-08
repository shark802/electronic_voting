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
exports.generateVoterReportInPdf = void 0;
const voterService_1 = require("../../data_access/voterService");
require("jspdf-autotable");
const query_1 = require("../../data_access/query");
const database_1 = require("../../config/database");
const generateTablePdf_1 = require("../../utils/reportUtils/generateTablePdf");
const customErrors_1 = require("../../utils/customErrors");
const filterVotersByFilterParameter_1 = require("../../utils/filterVotersByFilterParameter");
const createVoterReportTitle_1 = require("../../utils/createVoterReportTitle");
function generateVoterReportInPdf(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const election_id = req.params.id;
            if (!election_id)
                throw new customErrors_1.BadRequestError('Missing required election id');
            let voteStatus = req.query.voteStatus || 'voted'; // if voteStatus request query is falsy, assign default 'voted' value;
            const { department, program, year_level, section } = req.query;
            const selectedVoteStatus = voteStatus === 'voted' ? 1 : 0;
            const selectedDepartment = department === null || department === void 0 ? void 0 : department.toString();
            const selectedProgram = program === null || program === void 0 ? void 0 : program.toString();
            const selectedYearLevel = year_level === null || year_level === void 0 ? void 0 : year_level.toString();
            const selectedSection = section === null || section === void 0 ? void 0 : section.toString();
            const [election] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM elections WHERE election_id = ? LIMIT 1', [election_id]);
            const voters = yield (0, voterService_1.getAllVoterInElection)(election_id);
            // filter voters
            const filteredVoters = yield (0, filterVotersByFilterParameter_1.filterVotersByFilterParameter)(voters, selectedVoteStatus, selectedDepartment, selectedProgram, selectedYearLevel, selectedSection);
            const reportTitle = (0, createVoterReportTitle_1.createVoterReportTitle)(selectedVoteStatus, selectedDepartment, selectedProgram, selectedYearLevel, selectedSection);
            const pdfBuffer = yield (0, generateTablePdf_1.genereateTablePdf)(filteredVoters, reportTitle, election.election_name);
            // Set headers for PDF download
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="election_voters_report.pdf"');
            // Send the PDF as a response
            res.send(pdfBuffer);
        }
        catch (error) {
            console.error('Error generating PDF:', error);
            next(error);
        }
    });
}
exports.generateVoterReportInPdf = generateVoterReportInPdf;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwb3J0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvY29udHJvbGxlcnMvcmVwb3J0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFDQSxpRUFBdUU7QUFDdkUsMkJBQXlCO0FBQ3pCLG1EQUFzRDtBQUV0RCxvREFBNkM7QUFDN0MsK0VBQTZFO0FBQzdFLDJEQUEyRDtBQUMzRCw2RkFBMEY7QUFHMUYsK0VBQTRFO0FBRTVFLFNBQXNCLHdCQUF3QixDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7O1FBQzFGLElBQUksQ0FBQztZQUVELE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1lBQ2xDLElBQUksQ0FBQyxXQUFXO2dCQUFFLE1BQU0sSUFBSSw4QkFBZSxDQUFDLDhCQUE4QixDQUFDLENBQUM7WUFFNUUsSUFBSSxVQUFVLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksT0FBTyxDQUFDLENBQUMsc0VBQXNFO1lBQ3hILE1BQU0sRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBRS9ELE1BQU0sa0JBQWtCLEdBQUcsVUFBVSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUQsTUFBTSxrQkFBa0IsR0FBRyxVQUFVLGFBQVYsVUFBVSx1QkFBVixVQUFVLENBQUUsUUFBUSxFQUFFLENBQUM7WUFDbEQsTUFBTSxlQUFlLEdBQUcsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLFFBQVEsRUFBRSxDQUFDO1lBQzVDLE1BQU0saUJBQWlCLEdBQUcsVUFBVSxhQUFWLFVBQVUsdUJBQVYsVUFBVSxDQUFFLFFBQVEsRUFBRSxDQUFDO1lBQ2pELE1BQU0sZUFBZSxHQUFHLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxRQUFRLEVBQUUsQ0FBQztZQUU1QyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsTUFBTSxJQUFBLG1CQUFXLEVBQVcsZUFBSSxFQUFFLHVEQUF1RCxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUM3SCxNQUFNLE1BQU0sR0FBdUMsTUFBTSxJQUFBLG9DQUFxQixFQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRTVGLGdCQUFnQjtZQUNoQixNQUFNLGNBQWMsR0FBRyxNQUFNLElBQUEsNkRBQTZCLEVBQUMsTUFBTSxFQUFFLGtCQUFrQixFQUFFLGtCQUFrQixFQUFFLGVBQWUsRUFBRSxpQkFBaUIsRUFBRSxlQUFlLENBQUMsQ0FBQztZQUNoSyxNQUFNLFdBQVcsR0FBRyxJQUFBLCtDQUFzQixFQUFDLGtCQUFrQixFQUFFLGtCQUFrQixFQUFFLGVBQWUsRUFBRSxpQkFBaUIsRUFBRSxlQUFlLENBQUMsQ0FBQztZQUV4SSxNQUFNLFNBQVMsR0FBRyxNQUFNLElBQUEsb0NBQWlCLEVBQUMsY0FBYyxFQUFFLFdBQVcsRUFBRSxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUE7WUFFOUYsK0JBQStCO1lBQy9CLEdBQUcsQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLGlCQUFpQixDQUFDLENBQUM7WUFDakQsR0FBRyxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsRUFBRSxtREFBbUQsQ0FBQyxDQUFDO1lBRTFGLDZCQUE2QjtZQUM3QixHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRXhCLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUM5QyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEIsQ0FBQztJQUNMLENBQUM7Q0FBQTtBQW5DRCw0REFtQ0MifQ==