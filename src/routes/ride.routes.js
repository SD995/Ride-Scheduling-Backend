import { Router } from "express";
import {
    createRide,
    getRideDetails,
    getUserRides,
    cancelRide,
    getAllRides,
    updateRideStatus,
    getAnalytics
} from "../controllers/ride.controller.js";
import { auth, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/rides:
 *   post:
 *     summary: Create a new ride request
 *     tags: [Rides]
 *     security:
 *       - userAuth: []
 *       - roleAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pickupLocation
 *               - dropLocation
 *               - rideDate
 *               - pickupTime
 *               - dropTime
 *             properties:
 *               pickupLocation:
 *                 type: object
 *                 required:
 *                   - address
 *                   - coordinates
 *                 properties:
 *                   address:
 *                     type: string
 *                     description: Pickup address
 *                     example: "123 Main Street, City"
 *                   coordinates:
 *                     type: object
 *                     required:
 *                       - latitude
 *                       - longitude
 *                     properties:
 *                       latitude:
 *                         type: number
 *                         description: Latitude coordinate
 *                         example: 12.9716
 *                       longitude:
 *                         type: number
 *                         description: Longitude coordinate
 *                         example: 77.5946
 *                   instructions:
 *                     type: string
 *                     description: Additional pickup instructions
 *                     example: "Near the main gate"
 *               dropLocation:
 *                 type: object
 *                 required:
 *                   - address
 *                   - coordinates
 *                 properties:
 *                   address:
 *                     type: string
 *                     description: Drop address
 *                     example: "456 Business Park, City"
 *                   coordinates:
 *                     type: object
 *                     required:
 *                       - latitude
 *                       - longitude
 *                     properties:
 *                       latitude:
 *                         type: number
 *                         description: Latitude coordinate
 *                         example: 12.9716
 *                       longitude:
 *                         type: number
 *                         description: Longitude coordinate
 *                         example: 77.5946
 *                   instructions:
 *                     type: string
 *                     description: Additional drop instructions
 *                     example: "Building A, Floor 3"
 *               rideDate:
 *                 type: string
 *                 format: date-time
 *                 description: Scheduled ride date and time
 *                 example: "2024-01-15T09:00:00.000Z"
 *               rideType:
 *                 type: string
 *                 enum: [daily, one-time, recurring]
 *                 default: one-time
 *                 description: Type of ride
 *               recurringDays:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [monday, tuesday, wednesday, thursday, friday, saturday, sunday]
 *                 description: Days for recurring rides
 *                 example: ["monday", "wednesday", "friday"]
 *               pickupTime:
 *                 type: string
 *                 pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$'
 *                 description: Pickup time in HH:MM format
 *                 example: "09:00"
 *               dropTime:
 *                 type: string
 *                 pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$'
 *                 description: Drop time in HH:MM format
 *                 example: "17:00"
 *               purpose:
 *                 type: string
 *                 enum: [office, meeting, client-visit, airport, other]
 *                 default: office
 *                 description: Purpose of the ride
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *                 default: medium
 *                 description: Ride priority level
 *               notes:
 *                 type: string
 *                 description: Additional notes for the ride
 *                 example: "Need wheelchair accessible vehicle"
 *     responses:
 *       201:
 *         description: Ride created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Invalid request data or ride date in past
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", auth, createRide);

/**
 * @swagger
 * /api/rides/user:
 *   get:
 *     summary: Get current user's rides
 *     tags: [Rides]
 *     security:
 *       - userAuth: []
 *       - roleAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected, completed, cancelled]
 *         description: Filter by ride status
 *       - in: query
 *         name: rideType
 *         schema:
 *           type: string
 *           enum: [daily, one-time, recurring]
 *         description: Filter by ride type
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: User rides retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/user", auth, getUserRides);

/**
 * @swagger
 * /api/rides/{id}:
 *   get:
 *     summary: Get ride details by ID
 *     tags: [Rides]
 *     security:
 *       - userAuth: []
 *       - roleAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ride ID
 *     responses:
 *       200:
 *         description: Ride details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Not authorized to view this ride
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Ride not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", auth, getRideDetails);

/**
 * @swagger
 * /api/rides/{id}:
 *   delete:
 *     summary: Cancel a ride
 *     tags: [Rides]
 *     security:
 *       - userAuth: []
 *       - roleAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ride ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for cancellation
 *                 example: "Meeting cancelled"
 *     responses:
 *       200:
 *         description: Ride cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Ride cannot be cancelled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Not authorized to cancel this ride
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Ride not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", auth, cancelRide);

/**
 * @swagger
 * /api/rides/admin/analytics:
 *   get:
 *     summary: Get ride analytics (Admin only)
 *     tags: [Analytics]
 *     security:
 *       - userAuth: []
 *       - roleAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for analytics (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for analytics (YYYY-MM-DD)
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [date, status, purpose]
 *           default: date
 *         description: Group analytics by
 *     responses:
 *       200:
 *         description: Analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/admin/analytics", auth, isAdmin, getAnalytics);

/**
 * @swagger
 * /api/rides:
 *   get:
 *     summary: Get all rides (Admin only)
 *     tags: [Admin]
 *     security:
 *       - userAuth: []
 *       - roleAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected, completed, cancelled]
 *         description: Filter by ride status
 *       - in: query
 *         name: rideType
 *         schema:
 *           type: string
 *           enum: [daily, one-time, recurring]
 *         description: Filter by ride type
 *       - in: query
 *         name: purpose
 *         schema:
 *           type: string
 *           enum: [office, meeting, client-visit, airport, other]
 *         description: Filter by ride purpose
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter rides from this date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter rides until this date (YYYY-MM-DD)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: All rides retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", auth, isAdmin, getAllRides);

/**
 * @swagger
 * /api/rides/{id}/status:
 *   patch:
 *     summary: Update ride status (Admin only)
 *     tags: [Admin]
 *     security:
 *       - userAuth: []
 *       - roleAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ride ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *                 description: New ride status
 *                 example: "approved"
 *               reason:
 *                 type: string
 *                 description: Reason for status change
 *                 example: "Ride approved based on availability"
 *     responses:
 *       200:
 *         description: Ride status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Invalid status or ride not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Ride not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch("/:id/status", auth, isAdmin, updateRideStatus);

export default router; 