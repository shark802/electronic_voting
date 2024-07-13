import { Request, Response, NextFunction } from "express";
import { BadRequestError, UnauthorizedError } from "../../utils/customErrors";

export async function loginFunction(req: Request, res: Response, next: NextFunction) {
    try {
        const {id_number, password} = req.body;
        if(!id_number || !password) next(new BadRequestError());

        console.log(id_number, password)
        
        const response = await fetch(`https://bagocitycollege.com/BCCWeb/TPLoginAPI?txtUserName=${id_number}&txtPassword=${password}`);
        const responseMessage = await response.json();

        if(responseMessage.is_valid === false) return next(new UnauthorizedError("Login Failed!"));
        else {
            req.session.user = {
                user_id: responseMessage.user_code,
                roles: {
                    admin: 1,
                    program_head: 0,
                    voter: 1
                }
            }
            return res.status(200).end();
        } 
            
    } catch (error) {
        
    }
}