import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/APIerror.js";
import { User } from "../models/user.model.js";

export const auth = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.header("x-user-id");
        const role = req.header("x-role");

        if (!userId) {
            throw new ApiError(401, "User ID is required");
        }

        if (!role) {
            throw new ApiError(401, "Role is required");
        }

        // Validate role
        if (!["user", "admin"].includes(role)) {
            throw new ApiError(401, "Invalid role");
        }

        // Find user in database
        const user = await User.findById(userId).select("-passwordHash");
        
        if (!user) {
            throw new ApiError(401, "User not found");
        }

        if (!user.isActive) {
            throw new ApiError(401, "User account is deactivated");
        }

        // Verify role matches
        if (user.role !== role) {
            throw new ApiError(401, "Role mismatch");
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Authentication failed");
    }
});

export const isAdmin = asyncHandler(async (req, res, next) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Authentication required");
        }

        if (req.user.role !== "admin") {
            throw new ApiError(403, "Admin access required");
        }

        next();
    } catch (error) {
        throw new ApiError(403, error?.message || "Admin access denied");
    }
});