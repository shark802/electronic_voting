"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
function errorHandler(error, req, res, next) {
    if ("statusCode" in error) {
        res.status(error.statusCode).send({ message: error.message });
    }
    else {
        console.error("ERROR: ", error.stack);
        res.status(500).send("An unexpected error occured.");
    }
}
exports.errorHandler = errorHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JIYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21pZGRsZXdhcmVzL2Vycm9ySGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFHQSxTQUFnQixZQUFZLENBQUMsS0FBMEIsRUFBRSxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCO0lBRXRHLElBQUksWUFBWSxJQUFJLEtBQUssRUFBRSxDQUFDO1FBQzFCLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQztJQUU5RCxDQUFDO1NBQU0sQ0FBQztRQUNOLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0QyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0lBRXZELENBQUM7QUFFSCxDQUFDO0FBWEQsb0NBV0MifQ==