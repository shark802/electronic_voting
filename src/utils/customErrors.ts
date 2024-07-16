/**
 * to extends by custom error classes to provide custom property for error
 */
export interface customError extends Error {
	statusCode: number;
}

/**
 * Represents Unauthorized access error
 * This error is thrown when a client attempts to perform action but requires authentication
 */
export class UnauthorizedError extends Error implements customError {
	statusCode: number;

	constructor(errorMessage?: string) {
		super(errorMessage || "User don't have access");
		this.statusCode = 401;
	}
}

/**
 * Represents error if resource not found
 * This error is thrown when attempts to access a resource but not exist
 */
export class NotFoundError extends Error implements customError {
	statusCode: number;

	constructor(errorMessage?: string) {
		super(errorMessage || "Resource not found, Action failed due to resource not exist");
		this.statusCode = 404;
	}
}

/**
 * Represents an error when the client sends a bad request.
 * This error is thrown when the server cannot process the request due to client-side errors.
 */
export class BadRequestError extends Error implements customError {
	statusCode: number;

	constructor(errorMessage?: string) {
		super(errorMessage || "Bad Request, Server cannot process the request due to client side error.")
		this.statusCode = 400
	}
}

/**
 * Represents an internal server error.
 * This error is thrown when the server encounters an unexpected condition.
 */
export class InternalServerError extends Error implements customError {
	statusCode: number;

	constructor(errorMessage?: string) {
		super(errorMessage || "Internal Server, Server encounters an unexpected condition.")
		this.statusCode = 500
	}
}

/**
 * Represents a forbidden error.
 * This error is thrown when the server understands the request but the resource is restricted and cannot be accessed.
 */
export class ForbiddenError extends Error implements customError {
	statusCode: number;

	constructor(errorMessasge?: string) {
		super(errorMessasge || "Forbidden: Access to the requested resource is denied.");
		this.statusCode = 403
	}
}

/**
 * Represents conflict error
 * This error is thrown when attempting to create a new resource but already exist.
 */
export class ConflictError extends Error implements customError {
	statusCode: number;

	constructor(errorMessage?: string) {
		super(errorMessage || "Conflict, resource already exist");
		this.statusCode = 409
	}
}