import { Request, Response, NextFunction } from "express";
import { selectQuery } from "../../data_access/query";
import { Election } from "../../utils/types/Election";
import { pool } from "../../config/database";
import { Position } from "../../utils/enums/position";
import { Program } from "../../utils/enums/program";
import { RegisterDevice } from "../../utils/types/RegisterDevice";
import { findOneUserVotedInElection, getAllRecentUsersVoted, getAllRecentUsersVotedInElection, getAllUserElectionParticipatedIn } from "../../data_access/voterService";
import { getElectionInfoById, getCandidatesTotalTally } from "../../data_access/election";
import { isElectionEnded } from "../../utils/checkElectionTimeStatus";
import { BadRequestError, NotFoundError } from "../../utils/customErrors";
import { CANDIDATE_POSITION } from "../../config/constants/CandidatePosition";
import { DEPARTMENT } from "../../config/constants/BccDepartments";

export async function dashboardOverview(req: Request, res: Response, next: NextFunction) {
    try {

        const elections = await selectQuery<Election>(pool, 'SELECT * FROM elections WHERE is_close = 0 AND deleted_at IS NULL ORDER BY date_start, time_start');

        const electionIdList = elections.map(election => election.election_id);
        let populationPerProgram: unknown[] = []

        if (electionIdList.length > 0) {
            populationPerProgram = await selectQuery(pool, 'SELECT * FROM program_populations WHERE election_id IN ( ? )', [electionIdList])
        }

        res.render("admin/dashboard_overview", { elections, populationPerProgram })
    } catch (error) {
        next(error)
    }
}

export async function dashboardVoteTally(req: Request, res: Response, next: NextFunction) {
    try {
        const elections = await selectQuery<Election>(pool, 'SELECT * FROM elections WHERE is_close = 0 AND deleted_at IS NULL ORDER BY date_start, time_start');
        const candidatePosition = Object.values(CANDIDATE_POSITION);
        const programs = Object.keys(DEPARTMENT);

        const electionIdList = elections.map(election => election.election_id);
        let candidates: unknown[] = []

        if (electionIdList.length > 0) {
            candidates = await selectQuery(pool, 'SELECT * FROM candidates WHERE election_id IN ( ? )', [electionIdList])
        }

        res.render("admin/dashboard_vote_tally", { elections, candidatePosition, programs, candidates })
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

export async function renderAdminElectionResult(req: Request, res: Response, next: NextFunction) {
    try {
        const electionId = req.params.id;

        if (!electionId) throw new BadRequestError('Election id is missing');

        // retrieve election here
        const electionInfo = await getElectionInfoById(electionId);
        if (!electionInfo) throw new NotFoundError('Election not exist');

        // check if the election has ended
        if (!isElectionEnded(electionInfo)) return res.redirect('/election?redirectMessage=Result Not Available Yet');

        const positionList = Object.values(CANDIDATE_POSITION);
        const departments = Object.keys(DEPARTMENT);
        const candidatesVoteTally = await getCandidatesTotalTally(electionId);

        return res.render('admin/electionResultForAdmin', { candidatesVoteTally, positionList, departments, electionInfo });
    } catch (error) {
        next(error)
    }
}

// Candidate
export async function manageCandidate(req: Request, res: Response, next: NextFunction) {
    try {
        const positions = Object.values(Position);

        const selectElectioQuery = "SELECT * FROM elections WHERE deleted_at IS NULL AND (date_end > CURDATE() OR (date_end = CURDATE() AND time_end >= CURTIME()))";
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
export async function manageVoter(req: Request, res: Response, next: NextFunction) {
    try {
        const { election, user_id } = req.query;

        let votedUsers: unknown[];

        if (election && user_id) {

            votedUsers = await findOneUserVotedInElection(election as string, user_id as string);
        } else if (election && !user_id) {

            votedUsers = await getAllRecentUsersVotedInElection(election as string);
        } else if (user_id && !election) {

            votedUsers = await getAllUserElectionParticipatedIn(user_id as string);
        } else {

            votedUsers = await getAllRecentUsersVoted();
        }

        const availableElectionQuery = "SELECT * FROM elections WHERE (date_start < NOW() OR (date_start = CURDATE() AND time_start < CURTIME())) AND deleted_at IS NULL ORDER BY date_end DESC, time_end DESC   LIMIT 10";
        const availableElections = await selectQuery(pool, availableElectionQuery);

        res.render("admin/voter_manage", { votedUsers, availableElections })
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
        const programs = Object.values(Program)

        res.render("admin/control-panel-user", { programs })
    } catch (error) {
        next(error)
    }
}