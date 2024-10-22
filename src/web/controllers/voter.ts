import { Request, Response, NextFunction } from "express";
import { selectQuery } from "../../data_access/query";
import { Election } from "../../utils/types/Election";
import { pool } from "../../config/database";
import { User } from "../../utils/types/User";
import { isValidTimeToVote } from "../../utils/isValidTimeToVote";
import { checkIfUserHasVoted } from "../../data_access/voteService";
import { hasUserRegisterFaceImage } from "../../utils/hasUserRegisterFaceImage";
import { getCandidatesTotalTally, getElectionInfoById } from "../../data_access/election";
import { BadRequestError, NotFoundError } from "../../utils/customErrors";
import { isElectionEnded } from "../../utils/checkElectionTimeStatus";
import { Position } from "../../utils/types/Positions";
import { Department } from "../../utils/types/Department";
import { RegisterFaces } from "../../utils/types/RegisterFaces";

export async function electionPage(req: Request, res: Response, next: NextFunction) {
    try {
        const user_id = req.session.user!.user_id;
        const [register_face] = await selectQuery<RegisterFaces>(pool, 'SELECT * FROM register_faces WHERE id_number = ? LIMIT 1', [user_id]);

        const face_registered = register_face ? true : false;

        const query = "SELECT * FROM elections WHERE deleted_at IS NULL AND is_active = 1 ORDER BY date_start";
        const electionList = await selectQuery<Election>(pool, query);
        const [user] = await selectQuery<User>(pool, 'SELECT * FROM users WHERE id_number = ?', [user_id])

        res.render("voter/electionPage", { electionList, user, face_registered });
    } catch (error) {
        next(error)
    }
}

export async function renderElectionBallot(req: Request, res: Response, next: NextFunction) {
    try {
        const id_number = req.session.user!.user_id;
        const election_id = req.params.electionId;
        const deviceRegistrationStatus = req.session?.deviceRegistrationStatus;
        const faceVeified = req.session?.faceVerified;

        // Check if the user has already voted
        const hasVoted = await checkIfUserHasVoted(id_number, election_id);
        if (hasVoted) return res.redirect('/election?redirectMessage=You have already voted');

        // If the device is not registered, check if user is available for face authentication.
        if (deviceRegistrationStatus === undefined || deviceRegistrationStatus !== "REGISTERED" || !faceVeified) {
            const isUserRegisteredFaceImage = await hasUserRegisterFaceImage(id_number);
            if (!isUserRegisteredFaceImage) return res.redirect("/election?redirectMessage=Please register your face for authentication to continue.");

            // redirect user to face authentication
            return res.redirect('/authenticate-face')
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
        const candidatePositionList = (await selectQuery<Position>(pool, 'SELECT * FROM positions WHERE deleted_at IS NULL')).map(position => position.position);
        const departmentsMaximumSenatorVote = await selectQuery<Department>(pool, 'SELECT * FROM departments WHERE deleted_at IS NULL');

        const departmentMaxSenatorVote = departmentsMaximumSenatorVote.reduce((acc: Record<string, number>, department) => {
            acc[department.department_code] = department.max_select_senator;
            return acc;
        }, {});

        console.log(departmentMaxSenatorVote);

        if (!isValidTimeToVote(election)) return res.redirect("/election?redirectMessage=Voting is currently closed")

        return res.render('voter/voteBallot', { user, candidatePositionList, candidateList, election, departmentMaxSenatorVote });
    } catch (error) {
        next(error);
    }
}

export async function renderElectionResult(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.session.user!.user_id;
        const electionId = req.params.id;

        if (!electionId) throw new BadRequestError('Election id is missing');

        // retrieve election here
        const electionInfo = await getElectionInfoById(electionId);
        if (!electionInfo) throw new NotFoundError('Election not exist');

        // check if the election has ended
        if (!isElectionEnded(electionInfo)) return res.redirect('/election?redirectMessage=Result Not Available Yet');

        const positionList = (await selectQuery<Position>(pool, 'SELECT * FROM positions WHERE deleted_at IS NULL')).map(position => position.position);
        const [user] = await selectQuery<User>(pool, 'SELECT * FROM users WHERE id_number = ? LIMIT 1', [userId]);
        const candidatesVoteTally = await getCandidatesTotalTally(electionId);

        return res.render('voter/electionResultForVoter', { user, candidatesVoteTally, positionList, electionInfo });
    } catch (error) {
        next(error)
    }
}
