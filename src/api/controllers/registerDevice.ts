import { NextFunction, Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../../utils/customErrors";
import { v4 as uuidV4 } from "uuid";
import { insertQuery } from "../../data_access/query";
import { pool } from "../../config/database";

export async function requestUuidFunction(req: Request, res: Response, next: NextFunction) {
    try {
        console.log(req.body);
        const { codeName } = req.body;
        if (!codeName) throw new BadRequestError("Please preovide code name");

        const uuid = uuidV4();
        const result = await insertQuery(pool, "INSERT INTO register_devices (uuid, codename) VALUES(?, ?)", [uuid, codeName]);
        if (result.affectedRows < 1) throw new NotFoundError('No record added');

        res.status(201).json({ codeName, uuid });
    } catch (error) {
        next(error);
    }
}