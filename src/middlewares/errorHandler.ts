import { NextFunction, Request, Response } from "express";
import { customError } from "../utils/customErrors";

export function errorHandler(error: Error | customError, req: Request, res: Response, next: NextFunction) {

  if ("statusCode" in error) {
    console.error("ERROR: ", error.stack);

    res.status(error.statusCode).send(error.message);
  } else {
    console.error("ERROR: ", error.stack);

    res.status(500).send("An unexpected error occured.")
  }

}
