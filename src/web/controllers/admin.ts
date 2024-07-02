import { Request, Response, NextFunction } from "express";
import { selectQuery } from "../../data_access/query";
import { Election } from "../../utils/types/Election";
import { pool } from "../../config/database";

export function dashboardOverview(req: Request, res: Response, next: NextFunction) {
    try {
        res.render("admin/dashboard_overview")
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
        const query = "SELECT * FROM elections WHERE deleted_at IS NULL";
        const elections = await selectQuery<Election>(pool, query)

        res.render("admin/election_view", {elections})
    } catch (error) {
        next(error)
    }
}

export function newElection(req: Request, res: Response, next: NextFunction) {
    try {
        res.render("admin/election_create")
    } catch (error) {
        next(error)
    }
}

// Candidate
export function manageCandidate(req: Request, res: Response, next: NextFunction) {
    try {
        res.render("admin/candidate_manage")
    } catch (error) {
        next(error)
    }
}

export function addCandidate(req: Request, res: Response, next: NextFunction) {
    try {
        res.render("admin/candidate_add")
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
export function reviewRegisterDevice(req: Request, res: Response, next: NextFunction) {

    try {
        res.render("admin/register_device_review")
    } catch (error) {
        next(error)
    }
}

export function viewRegisterDevice(req: Request, res:Response, next: NextFunction) {

    try {
        res.render("admin/register_device_registered")
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