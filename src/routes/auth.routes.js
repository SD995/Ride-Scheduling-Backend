import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    updateProfile,
    registerAsDriver,
    updateLocation,
    toggleAvailability
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { 
    registerSchema, 
    loginSchema, 
    updateProfileSchema, 
    driverRegistrationSchema 
} from "../validation/auth.validation.js";

const router = Router();

// Public routes
router.post("/register", validateRequest(registerSchema), registerUser);
router.post("/login", validateRequest(loginSchema), loginUser);
router.post("/refresh-token", refreshAccessToken);

// Protected routes
router.post("/logout", verifyJWT, logoutUser);
router.get("/me", verifyJWT, getCurrentUser);
router.put("/profile", verifyJWT, validateRequest(updateProfileSchema), updateProfile);
router.post("/register-driver", verifyJWT, validateRequest(driverRegistrationSchema), registerAsDriver);
router.put("/location", verifyJWT, updateLocation);
router.put("/availability", verifyJWT, toggleAvailability);

export default router;

