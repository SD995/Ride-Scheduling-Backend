import { ApiError } from "../utils/APIerror.js";
import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
    let error = err;

    // Log the error
    logger.error("Error occurred:", {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        userId: req.header("x-user-id"),
        timestamp: new Date().toISOString()
    });

    // If the error is not an ApiError, convert it
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Something went wrong";
        error = new ApiError(statusCode, message);
    }

    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map(val => val.message).join(", ");
        error = new ApiError(400, message);
    }

    // Handle Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `${field} already exists`;
        error = new ApiError(409, message);
    }

    // Handle Mongoose cast error
    if (err.name === "CastError") {
        const message = `Invalid ${err.path}: ${err.value}`;
        error = new ApiError(400, message);
    }

    // Send error response
    res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack })
    });
}; 