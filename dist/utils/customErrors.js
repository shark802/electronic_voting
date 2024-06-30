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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tRXJyb3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL2N1c3RvbUVycm9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFPQTs7O0dBR0c7QUFDSCxNQUFhLGlCQUFrQixTQUFRLEtBQUs7SUFHM0MsWUFBWSxZQUFxQjtRQUNoQyxLQUFLLENBQUMsWUFBWSxJQUFJLHdCQUF3QixDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUM7SUFDdkIsQ0FBQztDQUNEO0FBUEQsOENBT0M7QUFFRDs7O0dBR0c7QUFDSCxNQUFhLGFBQWMsU0FBUSxLQUFLO0lBR3ZDLFlBQVksWUFBcUI7UUFDaEMsS0FBSyxDQUFDLFlBQVksSUFBSSw2REFBNkQsQ0FBQyxDQUFDO1FBQ3JGLElBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDO0lBQ3ZCLENBQUM7Q0FDRDtBQVBELHNDQU9DO0FBRUQ7OztHQUdHO0FBQ0gsTUFBYSxlQUFnQixTQUFRLEtBQUs7SUFHekMsWUFBWSxZQUFxQjtRQUNoQyxLQUFLLENBQUMsWUFBWSxJQUFJLDBFQUEwRSxDQUFDLENBQUE7UUFDakcsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUE7SUFDdEIsQ0FBQztDQUNEO0FBUEQsMENBT0M7QUFFRDs7O0dBR0c7QUFDSCxNQUFhLG1CQUFvQixTQUFRLEtBQUs7SUFHN0MsWUFBWSxZQUFxQjtRQUNoQyxLQUFLLENBQUMsWUFBWSxJQUFJLDZEQUE2RCxDQUFDLENBQUE7UUFDcEYsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUE7SUFDdEIsQ0FBQztDQUNEO0FBUEQsa0RBT0M7QUFFRDs7O0dBR0c7QUFDSCxNQUFhLGNBQWUsU0FBUSxLQUFLO0lBR3hDLFlBQVksYUFBc0I7UUFDakMsS0FBSyxDQUFDLGFBQWEsSUFBSSx3REFBd0QsQ0FBQyxDQUFDO1FBQ2pGLElBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFBO0lBQ3RCLENBQUM7Q0FDRDtBQVBELHdDQU9DIn0=