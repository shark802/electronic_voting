import { Request, Response, NextFunction } from "express";
import { BadRequestError, UnauthorizedError } from "../../utils/customErrors";

export async function loginFunction(req: Request, res: Response, next: NextFunction) {
    try {
        const {id_number, password} = req.body;
        console.log(id_number, password);
        if(!id_number || !password) next(new BadRequestError());
        
        const response = await fetch(`https://bagocitycollege.com/BCCWeb/TPLoginAPI?txtUserName=${id_number}&txtPassword=${password}`);
        const responseMessage = await response.json();

        if(responseMessage.is_valid === false) return next(new UnauthorizedError("Login Failed!"));
        else return res.status(200).end();
    } catch (error) {
        
    }
}