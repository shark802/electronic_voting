import { Request, Response, NextFunction } from "express";
import { selectQuery } from "../../data_access/query";
import { Election } from "../../utils/types/Election";
import { pool } from "../../config/database";
import { Position } from "../../utils/enums/position";
import { Program } from "../../utils/enums/program";
import { RegisterDevice } from "../../utils/types/RegisterDevice";
import { totalUserVotedPerElection } from "../../data_access/election";

export async function dashboardOverview(req: Request, res: Response, next: NextFunction) {
    try {

        const elections = await selectQuery(pool, 'SELECT * FROM elections WHERE is_close = 0 ORDER BY date_start, time_start');
        const totalVotedPerElection = await totalUserVotedPerElection();
        const courses = Object.values(Program);

        res.render("admin/dashboard_overview", { elections, courses, totalVotedPerElection })
    } catch (error) {
        next(error)
    }
}

export function dashboardVoteTally(req: Request, res: Response, next: NextFunction) {
    try {
        res.render("admin/dashboard_vote_tally")
    } catch (error) {
        next(error)
    }
}

// Election
export async function viewElection(req: Request, res: Response, next: NextFunction) {
    try {
        const query = "SELECT * FROM elections WHERE deleted_at IS NULL AND (date_end > CURDATE() OR (date_end = CURDATE() AND time_end > CURTIME())) ORDER BY created_at DESC";
        const elections = await selectQuery<Election>(pool, query)

        res.render("admin/election_view", { elections })
    } catch (error) {
        next(error);
    }
}

export function newElection(req: Request, res: Response, next: NextFunction) {
    try {
        res.render("admin/election_create")
    } catch (error) {
        next(error);
    }
}

export async function editElection(req: Request, res: Response, next: NextFunction) {
    try {
        const election_id = req.params.id;
        const query = "SELECT * FROM elections WHERE election_id = ?";
        const election = await selectQuery<Election>(pool, query, [election_id]);
        res.render("admin/election_edit", { election: election[0] });
    } catch (error) {
        next(error);
    }
};

export async function deleteElection(req: Request, res: Response, next: NextFunction) {
    try {

    } catch (error) {
        next(error);
    }
}

export async function viewElectionHistory(req: Request, res: Response, next: NextFunction) {
    try {
        const query = "SELECT * FROM elections WHERE (date_end < CURDATE() OR (date_end = CURDATE() AND time_end < CURTIME())) AND deleted_at IS NULL ORDER BY date_end DESC, time_end DESC";
        const elections = await selectQuery<Election>(pool, query);
        res.render("admin/election_history", { elections });
    } catch (error) {
        next(error);
    }
}

// Candidate
export async function manageCandidate(req: Request, res: Response, next: NextFunction) {
    try {
        const positions = Object.values(Position);

        const selectElectioQuery = "SELECT * FROM elections WHERE deleted_at IS NULL AND (date_end > CURDATE() OR (date_end = CURDATE() AND  time_start > CURTIME()))";
        const elections = await selectQuery<Election>(pool, selectElectioQuery);
        // const elections: Election[] = []

        res.render("admin/candidate_manage", { elections, positions })
    } catch (error) {
        next(error)
    }
}

export async function addCandidate(req: Request, res: Response, next: NextFunction) {
    try {
        const query = "SELECT * FROM elections WHERE deleted_at IS NULL AND (date_start > CURDATE() OR (date_start = CURDATE() AND time_start > CURTIME())) ORDER BY created_at DESC";
        const electionList = await selectQuery<Election>(pool, query);
        const positions = Object.values(Position);
        const programs = Object.values(Program);

        res.render("admin/candidate_add", { electionList, positions, programs })
    } catch (error) {
        next(error)
    }
}

// Voter
export function manageVoter(req: Request, res: Response, next: NextFunction) {

    try {
        res.render("admin/voter_manage")
    } catch (error) {
        next(error)
    }
}

// Register device
export async function reviewRegisterDevice(req: Request, res: Response, next: NextFunction) {
    try {
        const devices = await selectQuery<RegisterDevice>(pool, "SELECT * FROM register_devices WHERE is_registered = 0 AND deleted_at IS NULL ORDER BY date_created DESC")

        res.render("admin/register_device_review", { devices })
    } catch (error) {
        next(error)
    }
}

export async function viewRegisterDevice(req: Request, res: Response, next: NextFunction) {
    try {
        const registeredDevices = await selectQuery<RegisterDevice>(pool, 'SELECT * FROM register_devices WHERE is_registered = 1 AND deleted_at IS NULL ORDER BY updated_at DESC');
        res.render("admin/register_device_registered", { registeredDevices })
    } catch (error) {
        next(error)
    }
}

// Control Panel
export function fetchUser(req: Request, res: Response, next: NextFunction) {

    try {
        res.render("admin/control-panel_fetch-user")
    } catch (error) {
        next(error)
    }
}