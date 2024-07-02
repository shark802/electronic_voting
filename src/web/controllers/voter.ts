import { Request, Response, NextFunction } from "express";
import { selectQuery } from "../../data_access/query";
import { Election } from "../../utils/types/Election";
import { pool } from "../../config/database";

export async function electionPage(req: Request, res: Response, next: NextFunction) {
    try {
        const query = "SELECT * FROM elections WHERE deleted_at IS NULL AND is_active = 1 AND date_end >= CURDATE()";
        const electionList = await selectQuery<Election>(pool, query);

        res.render("voter/electionPage", {electionList});
    } catch (error) {
        next(error)
    }
}