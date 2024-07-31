import { Request, Response, NextFunction } from "express";
import { selectQuery } from "../../data_access/query";
import { Election } from "../../utils/types/Election";
import { pool } from "../../config/database";
import { Position } from "../../utils/enums/position";
import { User } from "../../utils/types/User";

export async function electionPage(req: Request, res: Response, next: NextFunction) {
    try {
        const query = "SELECT * FROM elections WHERE deleted_at IS NULL AND is_active = 1 ORDER BY date_start";
        const electionList = await selectQuery<Election>(pool, query);

        res.render("voter/electionPage", {electionList});
    } catch (error) {
        next(error)
    }
}

export async function renderElectionBallot(req: Request, res: Response, next: NextFunction) {
    try {
        const id_number = req.session.user!.user_id;
        const election_id = "01J3MP1NC8AVWD5ZDXMHDGDCPA";

        const [user] = await selectQuery<User>(pool, "SELECT * FROM users WHERE id_number = ?", [id_number]);

        console.log(user);

        const sqlQuery = `
        SELECT u.id_number, u.firstname, u.lastname , u.course, c.alias, c.position
        FROM users u JOIN candidates c
        ON u.id_number = c.id_number
        WHERE c.election_id = ?
        AND c.enabled = 1
        AND c.deleted IS NULL
        `
        const candidateList = await selectQuery(pool, sqlQuery, [election_id]);
        const candidatePositionList = Object.values(Position);

        return res.render('voter/voteBallot', {user, candidatePositionList, candidateList});
    } catch (error) {
        next(error);
    }
}