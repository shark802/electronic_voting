import { NextFunction, Request, Response } from "express";
import { pool } from "../../config/database";
import { selectQuery } from "../../data_access/query";
import { Election } from "../../utils/types/Election";

export async function programHeadDashboardOverviewPage(req: Request, res: Response, next: NextFunction) {
    try {
        const elections = await selectQuery<Election>(pool, 'SELECT * FROM elections WHERE is_close = 0 AND deleted_at IS NULL ORDER BY date_start, time_start');
        const electionIdList = elections.map(election => election.election_id);

        let populationPerProgram: unknown[] = []
        if (electionIdList.length > 0) {
            populationPerProgram = await selectQuery(pool, 'SELECT * FROM program_populations WHERE election_id IN ( ? )', [electionIdList])
        }
        console.log(populationPerProgram);
        res.render("program/dashboard_overview_program_head", { elections, populationPerProgram });

    } catch (error) {
        next(error);
    }
}

export async function programHeadDashboardVoteTallyPage(req: Request, res: Response, next: NextFunction) {
    try {

        res.render('program/dashboard-vote-tally-program-head')

    } catch (error) {
        next(error);
    }
}