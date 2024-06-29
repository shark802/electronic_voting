"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = exports.InternalServerError = exports.BadRequestError = exports.NotFoundError = exports.UnauthorizedError = void 0;
/**
 * Represents Unauthorized access error
 * This error is thrown when a client attempts to perform action but requires authentication
 */
class UnauthorizedError extends Error {
    constructor(errorMessage) {
        super(errorMessage || "User don't have access");
        this.statusCode = 401;
    }
}
exports.UnauthorizedError = UnauthorizedError;
/**
 * Represents error if resource not found
 * This error is thrown when attempts to access a resource but not exist
 */
class NotFoundError extends Error {
    constructor(errorMessage) {
        super(errorMessage || "Resource not found, Action failed due to resource not exist");
        this.statusCode = 404;
    }
}
exports.NotFoundError = NotFoundError;
/**
 * Represents an error when the client sends a bad request.
 * This error is thrown when the server cannot process the request due to client-side errors.
 */
class BadRequestError extends Error {
    constructor(errorMessage) {
        super(errorMessage || "Bad Request, Server cannot process the request due to client side error.");
        this.statusCode = 400;
    }
}
exports.BadRequestError = BadRequestError;
/**
 * Represents an internal server error.
 * This error is thrown when the server encounters an unexpected condition.
 */
class InternalServerError extends Error {
    constructor(errorMessage) {
        super(errorMessage || "Internal Server, Server encounters an unexpected condition.");
        this.statusCode = 500;
    }
}
exports.InternalServerError = InternalServerError;
/**
 * Represents a forbidden error.
 * This error is thrown when the server understands the request but the resource is restricted and cannot be accessed.
 */
class ForbiddenError extends Error {
    constructor(errorMessasge) {
        super(errorMessasge || "Forbidden: Access to the requested resource is denied.");
        this.statusCode = 403;
    }
}
exports.ForbiddenError = ForbiddenError;
