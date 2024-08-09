import { NextFunction, Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../../utils/customErrors";
import { v4 as uuidV4 } from "uuid";
import { insertQuery, updateQuery } from "../../data_access/query";
import { pool } from "../../config/database";

export async function requestUuidFunction(req: Request, res: Response, next: NextFunction) {
    try {
        const { codeName } = req.body;
        if (!codeName) throw new BadRequestError("Please preovide code name");

        const uuid = uuidV4();
        const result = await insertQuery(pool, "INSERT INTO register_devices (uuid, codename) VALUES(?, ?)", [uuid, codeName]);
        if (result.affectedRows < 1) throw new NotFoundError('No record added');

        res.status(201).json({ codeName, uuid, status: 'pending' });
    } catch (error) {
        next(error);
    }
}

export async function declineRequestFunction(req: Request, res: Response, next: NextFunction) {
    try {
        const uuid = req.params.id;
        if (!uuid) throw new BadRequestError("Missing UUID");

        const deleteResult = await updateQuery(pool, 'UPDATE register_devices SET deleted_at = CURDATE() WHERE uuid = ? AND deleted_at IS NULL', [uuid]);
        if (deleteResult.affectedRows < 1) throw new NotFoundError('No resource modified, check the uuid if correct');
        return res.status(200).json({ message: 'Request succesfully removed' });

    } catch (error) {
        next(error);
    }
}