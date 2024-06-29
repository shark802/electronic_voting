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
        res.status(500).send("An unexpected error occured.");
    }
}
exports.errorHandler = errorHandler;
