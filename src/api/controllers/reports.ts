import { NextFunction, Request, Response } from "express";
import { getAllNotVotedInElection } from "../../data_access/voterService";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { selectQuery } from "../../data_access/query";
import { Election } from "../../utils/types/Election";
import { pool } from "../../config/database";
import { genereateTablePdf } from "../../utils/reportUtils/generateTablePdf";

export async function generateNotVotedReportInPdf(req: Request, res: Response, next: NextFunction) {
    try {
        const election_id = req.params.id;
        if (!election_id) throw new Error('Cannot generate PDF report, election ID is missing.');

        const voterUsers = await getAllNotVotedInElection(election_id);
        const [election] = await selectQuery<Election>(pool, 'SELECT * FROM elections WHERE election_id = ? LIMIT 1', [election_id]);

        const pdfBuffer = await genereateTablePdf(voterUsers, 'List of Not Voted', election.election_name)

        // Set headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="voter_report.pdf"');

        // Send the PDF as a response
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error generating PDF:', error);
        next(error);
    }
}
