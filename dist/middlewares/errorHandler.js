"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
function errorHandler(error, req, res, next) {
    if ("statusCode" in error) {
        console.error("ERROR: ", error.stack);
        res.status(error.statusCode).send(error.message);
    }
    else {
        console.error("ERROR: ", error.stack);
        res.status(500).send(error.message);
    }
}
exports.errorHandler = errorHandler;
// export function errorHandler(error: customError | Error, req: Request, res: Response, next: NextFunction) {
//   if ('statusCode' in error && typeof (error as customError).statusCode === 'number') {
//     const status = (error as customError).statusCode;  
//     console.error(error.message)
//     res.status(status).json({ errorMessage: error.message });
//   } else {
//     res.status(500).json({ errorMessage: error.message });  
//   }
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JIYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21pZGRsZXdhcmVzL2Vycm9ySGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFHQSxTQUFnQixZQUFZLENBQUMsS0FBMEIsRUFBRSxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCO0lBRXRHLElBQUksWUFBWSxJQUFJLEtBQUssRUFBRSxDQUFDO1FBQzFCLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV0QyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ25ELENBQUM7U0FBTSxDQUFDO1FBQ04sT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXRDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUNyQyxDQUFDO0FBRUgsQ0FBQztBQVpELG9DQVlDO0FBRUQsOEdBQThHO0FBQzlHLDBGQUEwRjtBQUMxRiwwREFBMEQ7QUFDMUQsbUNBQW1DO0FBQ25DLGdFQUFnRTtBQUNoRSxhQUFhO0FBQ2IsK0RBQStEO0FBQy9ELE1BQU07QUFDTixJQUFJIn0=