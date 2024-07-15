import { NextFunction, Request, Response } from "express";
import { customError } from "../utils/customErrors";

export function errorHandler(error: Error | customError, req: Request, res: Response, next: NextFunction) {

  if ("statusCode" in error) {
    res.status(error.statusCode).send({message: error.message});
    
  } else {
    console.error("ERROR: ", error.stack);
    res.status(500).send("An unexpected error occured.");

  }

}
