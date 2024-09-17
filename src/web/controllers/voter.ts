import { Request, Response, NextFunction } from "express";
import { selectQuery } from "../../data_access/query";
import { Election } from "../../utils/types/Election";
import { pool } from "../../config/database";
import { Position } from "../../utils/enums/position";
import { User } from "../../utils/types/User";
import { isValidTimeToVote } from "../../utils/isValidTimeToVote";
import { checkIfUserHasVoted } from "../../data_access/voteService";
import { hasUserRegisterFaceImage } from "../../utils/hasUserRegisterFaceImage";
import { getAllCandidatesInElection, getCandidatesTotalTally, getElectionInfoById } from "../../data_access/election";
import { BadRequestError, NotFoundError } from "../../utils/customErrors";
import { isElectionEnded } from "../../utils/checkElectionTimeStatus";
import { CANDIDATE_POSITION } from "../../config/constants/CandidatePosition";

export async function electionPage(req: Request, res: Response, next: NextFunction) {
    try {
        const user_id = req.session.user!.user_id;

        const query = "SELECT * FROM elections WHERE deleted_at IS NULL AND is_active = 1 ORDER BY date_start";
        const electionList = await selectQuery<Election>(pool, query);
        const [user] = await selectQuery<User>(pool, 'SELECT * FROM users WHERE id_number = ?', [user_id])

        res.render("voter/electionPage", { electionList, user });
    } catch (error) {
        next(error)
    }
}

export async function renderElectionBallot(req: Request, res: Response, next: NextFunction) {
    try {
        const id_number = req.session.user!.user_id;
        const election_id = req.params.electionId;
        const deviceRegistrationStatus = req.session.deviceRegistrationStatus;

        // Check if the user has already voted
        const hasVoted = await checkIfUserHasVoted(id_number, election_id);
        if (hasVoted) return res.redirect('/election?redirectMessage=You have already voted');

        // If the device is not registered, check if user is available for face authentication.
        if (deviceRegistrationStatus === undefined || deviceRegistrationStatus !== "REGISTERED") {
            const isUserRegisteredFaceImage = await hasUserRegisterFaceImage(id_number);
            if (!isUserRegisteredFaceImage) return res.redirect("/election?redirectMessage=Please register your face for authentication to continue.");

            // redirect user to face authentication

        }

        const sqlQuery = `
        SELECT u.id_number, u.firstname, u.lastname , u.course, c.position, c.candidate_profile, c.party
        FROM users u JOIN candidates c
        ON u.id_number = c.id_number
        WHERE c.election_id = ?
        AND c.enabled = 1
        AND c.deleted IS NULL
        `
        const [[user], [election], candidateList] = await Promise.all([
            selectQuery<User>(pool, "SELECT * FROM users WHERE id_number = ?", [id_number]),
            selectQuery<Election>(pool, "SELECT * FROM elections WHERE election_id = ? AND deleted_at IS NULL", [election_id]),
            selectQuery(pool, sqlQuery, [election_id])
        ]);
        const candidatePositionList = Object.values(CANDIDATE_POSITION);

        if (!isValidTimeToVote(election)) return res.redirect("/election?redirectMessage=Voting is currently closed")

        return res.render('voter/voteBallot', { user, candidatePositionList, candidateList, election });
    } catch (error) {
        next(error);
    }
}

export async function renderElectionResult(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.session.user!.user_id;
        const electionId = req.params.id;

        console.log(electionId);

        if (!electionId) throw new BadRequestError('Election id is missing');

        // retrieve election here
        const electionInfo = await getElectionInfoById(electionId);
        if (!electionInfo) throw new NotFoundError('Election not exist');

        // check if the election has ended
        if (!isElectionEnded(electionInfo)) return res.redirect('/election?redirectMessage=Result Not Available Yet');

        const positionList = Object.values(CANDIDATE_POSITION);
        const [user] = await selectQuery<User>(pool, 'SELECT * FROM users WHERE id_number = ? LIMIT 1', [userId]);
        const candidatesVoteTally = await getCandidatesTotalTally(electionId);

        return res.render('voter/electionResultForVoter', { user, candidatesVoteTally, positionList, electionInfo });
    } catch (error) {
        next(error)
    }
}