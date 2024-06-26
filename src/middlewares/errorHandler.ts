import { NextFunction, Request, Response } from "express";
import { customError } from "../utils/customErrors";

export function errorHandler(error: Error | customError, req: Request, res: Response, next: NextFunction) {

  if ("statusCode" in error) {
    console.error("ERROR: ", error.stack);

    res.status(error.statusCode).send(error.message);
  } else {
    console.error("ERROR: ", error.stack);

    res.status(500).send(error.message)
  }

}

// export function errorHandler(error: customError | Error, req: Request, res: Response, next: NextFunction) {
//   if ('statusCode' in error && typeof (error as customError).statusCode === 'number') {
//     const status = (error as customError).statusCode;  
//     console.error(error.message)
//     res.status(status).json({ errorMessage: error.message });
//   } else {
//     res.status(500).json({ errorMessage: error.message });  
//   }
// }


