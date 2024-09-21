import { NextFunction, Request, Response } from "express";
import { getAllNotVotedInElection, getAllVoterInElection } from "../../data_access/voterService";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { selectQuery } from "../../data_access/query";
import { Election } from "../../utils/types/Election";
import { pool } from "../../config/database";
import { genereateTablePdf } from "../../utils/reportUtils/generateTablePdf";
import { DEPARTMENT } from "../../config/constants/BccDepartments";
import { BadRequestError } from "../../utils/customErrors";
import { filterVotersByFilterParameter } from "../../utils/filterVotersByFilterParameter";
import { User } from "../../utils/types/User";
import { Voter } from "../../utils/types/Voter";
import { createVoterReportTitle } from "../../utils/createVoterReportTitle";

export async function generateVoterReportInPdf(req: Request, res: Response, next: NextFunction) {
    try {

        const election_id = req.params.id;
        if (!election_id) throw new BadRequestError('Missing required election id');

        let voteStatus = req.query.voteStatus || 'voted'; // if voteStatus request query is falsy, assign default 'voted' value;
        const { department, program, year_level, section } = req.query;

        const selectedVoteStatus = voteStatus === 'voted' ? 1 : 0;
        const selectedDepartment = department?.toString();
        const selectedProgram = program?.toString();
        const selectedYearLevel = year_level?.toString();
        const selectedSection = section?.toString();

        const [election] = await selectQuery<Election>(pool, 'SELECT * FROM elections WHERE election_id = ? LIMIT 1', [election_id]);
        const voters: (Partial<User> & Partial<Voter>)[] = await getAllVoterInElection(election_id);

        // filter voters
        const filteredVoters = filterVotersByFilterParameter(voters, selectedVoteStatus, selectedDepartment, selectedProgram, selectedYearLevel, selectedSection);
        const reportTitle = createVoterReportTitle(selectedVoteStatus, selectedDepartment, selectedProgram, selectedYearLevel, selectedSection);

        const pdfBuffer = await genereateTablePdf(filteredVoters, reportTitle, election.election_name)

        // Set headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="election_voters_report.pdf"');

        // Send the PDF as a response
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error generating PDF:', error);
        next(error);
    }
}
