import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/APIerror.js';

export const validateRequest = (schema) => {
    return asyncHandler(async (req, res, next) => {
        try {
            const validatedData = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });

            req.validatedData = validatedData;
            next();
        } catch (error) {
            const errorMessage = error.errors?.map(err => err.message).join(", ") || "Validation failed";
            throw new ApiError(400, errorMessage);
        }
    });
}; 