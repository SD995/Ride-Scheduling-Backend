import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { specs } from "./src/config/swagger.js";
import logger from './src/utils/logger.js';
import morganLogger from './src/utils/morganLogger.js';
import { errorHandler } from './src/middlewares/errorHandler.middleware.js';
import userRoutes from './src/routes/user.routes.js';
import rideRoutes from './src/routes/ride.routes.js';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

// HTTP logging
app.use(morganLogger);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Corporate Ride Scheduling API Documentation',
    customfavIcon: '/favicon.ico'
}));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/rides", rideRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Corporate Ride Scheduling API is running",
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// Global error handler
app.use(errorHandler);

export {app};