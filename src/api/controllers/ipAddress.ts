import { Request, Response, NextFunction } from "express";
import { insertQuery, selectQuery } from "../../data_access/query";
import { pool } from "../../config/database";
import { IpAddress } from "../../utils/types/IpAddress";
import { ConflictError, NotFoundError } from "../../utils/customErrors";

export async function addIpAddress(req: Request, res: Response, next: NextFunction) {
    try {
        const ipAddress = req.body.ipAddress;
        const networkName = req.body.networkName;

        console.log(req.body);
        console.log(ipAddress, networkName);
        if (!ipAddress || !networkName) throw new Error('Ip address and network name are required');

        const existingIpAddress = await selectQuery<IpAddress>(pool, 'SELECT * FROM ip_address WHERE ip_address = ? LIMIT 1', [ipAddress]);
        if (existingIpAddress.length > 0) throw new ConflictError(`${ipAddress} already exist`);

        const insertedIpAddress = await insertQuery(pool, 'INSERT INTO ip_address (network_name, ip_address) VALUES (?, ?)', [networkName, ipAddress]);
        if (insertedIpAddress.affectedRows === 0) {
            throw new Error('Failed to insert ip address');
        }

        return res.status(200).json({ message: 'Ip address added successfully' });

    } catch (error) {
        next(error);
    }
}

export async function getIpAddress(req: Request, res: Response, next: NextFunction) {
    try {
        const ipAddress = req.query.ipAddress;

        if (!ipAddress) return res.status(200);

        const [ipAddressResult] = await selectQuery<IpAddress>(pool, 'SELECT * FROM ip_address WHERE ip_address = ? AND deleted_at IS NULL LIMIT 1', [ipAddress]);

        if (!ipAddressResult) {
            return res.status(200).json({ message: `${ipAddress} is not registered` });
        }

        return res.status(200).json({ ip_address: ipAddressResult.ip_address });

    } catch (error) {
        next(error);
    }
}

export async function getAllIpAddress(req: Request, res: Response, next: NextFunction) {
    try {
        const ipAddress = await selectQuery<IpAddress>(pool, 'SELECT * FROM ip_address WHERE deleted_at IS NULL');
        return res.status(200).json({ ipAddress });
    } catch (error) {
        next(error);
    }
}


