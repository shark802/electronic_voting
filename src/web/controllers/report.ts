import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../../utils/customErrors";
import { selectQuery } from "../../data_access/query";
import { Election } from "../../utils/types/Election";
import { pool } from "../../config/database";
import { DEPARTMENT } from '../../config/constants/BccDepartments';
import { getAllVoterInElection } from "../../data_access/voterService";
import { User } from "../../utils/types/User";
import { Voter } from "../../utils/types/Voter";
import { filterVotersByFilterParameter } from "../../utils/filterVotersByFilterParameter";
import { getPaginatedUsers } from "../../utils/getPaginatedUsers";
import { createVoterReportTitle } from "../../utils/createVoterReportTitle";

export async function previewVoterParticipationReports(req: Request, res: Response, next: NextFunction) {
    try {
        const election_id = req.params.id;
        if (!election_id) throw new BadRequestError('Missing required election id');

        // query parameters
        const page = req.query.page || 1
        let voteStatus = req.query.voteStatus || 'voted'; // if voteStatus request query is falsy, assign default 'voted' value;
        const { department, program, year_level, section } = req.query;

        const selectedVoteStatus = voteStatus === 'voted' ? 1 : 0;
        const selectedDepartment = department?.toString();
        const selectedProgram = program?.toString();
        const selectedYearLevel = year_level?.toString();
        const selectedSection = section?.toString();

        const departments = Object.keys(DEPARTMENT);
        const programs = department ? Object.values(DEPARTMENT[department as keyof typeof DEPARTMENT]) : []
        const yearLevels = [1, 2, 3, 4];

        const currentYear = new Date().getFullYear();
        const sqlSectionResult = program ? await selectQuery<Pick<User, 'section'>[]>(pool, 'SELECT DISTINCT section FROM users WHERE course = ? AND (year_active = ? OR is_active = 1) ORDER BY section', [program, currentYear]) : []
        const sections = sqlSectionResult.map(section => Object.values(section)).flat();

        const [election] = await selectQuery<Election>(pool, 'SELECT * FROM elections WHERE election_id = ? LIMIT 1', [election_id]);
        const voters: (Partial<User> & Partial<Voter>)[] = await getAllVoterInElection(election_id);

        // filter voters
        const filteredVoters = filterVotersByFilterParameter(voters, selectedVoteStatus, selectedDepartment, selectedProgram, selectedYearLevel, selectedSection);
        const reportTitle = createVoterReportTitle(selectedVoteStatus, selectedDepartment, selectedProgram, selectedYearLevel, selectedSection);

        const users = getPaginatedUsers(filteredVoters, page as number);

        const usersSize = filteredVoters.length;

        res.render('report/preview-voter-report', { election, departments, programs, yearLevels, sections, selectedVoteStatus, selectedDepartment, selectedProgram, selectedYearLevel, selectedSection, users, page, usersSize, reportTitle })
    } catch (error) {
        next(error)
    }
}
export async function programHeadVoterParticipationReport(req: Request, res: Response, next: NextFunction) {
    try {
        const election_id = req.params.id;
        if (!election_id) throw new BadRequestError('Missing required election id');

        // query parameters
        const page = req.query.page || 1
        let voteStatus = req.query.voteStatus || 'voted'; // if voteStatus request query is falsy, assign default 'voted' value;
        const { department, program, year_level, section } = req.query;

        const selectedVoteStatus = voteStatus === 'voted' ? 1 : 0;
        const selectedDepartment = department?.toString();
        const selectedProgram = program?.toString();
        const selectedYearLevel = year_level?.toString();
        const selectedSection = section?.toString();

        const departments = Object.keys(DEPARTMENT);
        const programs = department ? Object.values(DEPARTMENT[department as keyof typeof DEPARTMENT]) : []
        const yearLevels = [1, 2, 3, 4];

        const currentYear = new Date().getFullYear();
        const sqlSectionResult = program ? await selectQuery<Pick<User, 'section'>[]>(pool, 'SELECT DISTINCT section FROM users WHERE course = ? AND (year_active = ? OR is_active = 1) ORDER BY section', [program, currentYear]) : []
        const sections = sqlSectionResult.map(section => Object.values(section)).flat();

        const [election] = await selectQuery<Election>(pool, 'SELECT * FROM elections WHERE election_id = ? LIMIT 1', [election_id]);
        const voters: (Partial<User> & Partial<Voter>)[] = await getAllVoterInElection(election_id);

        // filter voters
        const filteredVoters = filterVotersByFilterParameter(voters, selectedVoteStatus, selectedDepartment, selectedProgram, selectedYearLevel, selectedSection);
        const reportTitle = createVoterReportTitle(selectedVoteStatus, selectedDepartment, selectedProgram, selectedYearLevel, selectedSection);

        const users = getPaginatedUsers(filteredVoters, page as number);

        const usersSize = filteredVoters.length;

        res.render('report/program-head-voter-report', { election, departments, programs, yearLevels, sections, selectedVoteStatus, selectedDepartment, selectedProgram, selectedYearLevel, selectedSection, users, page, usersSize, reportTitle })
    } catch (error) {
        next(error)
    }
}
