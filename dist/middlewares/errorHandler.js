"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const customErrors_1 = require("../utils/customErrors");
function errorHandler(error, req, res, next) {
    if (error instanceof customErrors_1.customError) {
        res.status(error.statusCode).json({ name: error.name, message: error.message });
    }
    else {
        // console.error(`${error.name}: ${error.message}`);
        console.error(`${error.stack}`);
        res.status(500).send(`Unexpected error occured!`);
    }
}
exports.errorHandler = errorHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JIYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21pZGRsZXdhcmVzL2Vycm9ySGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx3REFBb0Q7QUFFcEQsU0FBZ0IsWUFBWSxDQUFDLEtBQVksRUFBRSxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCO0lBQ3hGLElBQUksS0FBSyxZQUFZLDBCQUFXLEVBQUUsQ0FBQztRQUNqQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDbEYsQ0FBQztTQUFNLENBQUM7UUFDTixvREFBb0Q7UUFDcEQsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFBO1FBQy9CLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLDJCQUEyQixDQUFDLENBQUM7SUFDcEQsQ0FBQztBQUNILENBQUM7QUFSRCxvQ0FRQyJ9