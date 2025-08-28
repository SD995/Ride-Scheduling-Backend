import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app.js";
import { User } from "../src/models/user.model.js";
import { Ride } from "../src/models/ride.model.js";

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await User.deleteMany({});
    await Ride.deleteMany({});
});

describe("Ride Booking API", () => {
    let testUser;
    let authHeaders;

    beforeEach(async () => {
        // Create a test user
        testUser = await User.create({
            name: "John Doe",
            email: "john@example.com",
            passwordHash: "password123",
            employeeId: "EMP001",
            department: "Engineering"
        });

        authHeaders = {
            "x-user-id": testUser._id.toString(),
            "x-role": "user"
        };
    });

    describe("POST /api/rides", () => {
        it("should create a new ride successfully", async () => {
            const rideData = {
                pickupLocation: {
                    address: "123 Main St, Mumbai",
                    coordinates: {
                        latitude: 19.0760,
                        longitude: 72.8777
                    },
                    instructions: "Near the main gate"
                },
                dropLocation: {
                    address: "456 Oak Ave, Mumbai",
                    coordinates: {
                        latitude: 19.2183,
                        longitude: 72.9781
                    },
                    instructions: "Drop at the entrance"
                },
                rideDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
                pickupTime: "09:00",
                dropTime: "17:00",
                purpose: "office",
                priority: "medium",
                notes: "Regular office commute"
            };

            const response = await request(app)
                .post("/api/rides")
                .set(authHeaders)
                .send(rideData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.userId).toBe(testUser._id.toString());
            expect(response.body.data.pickupLocation.address).toBe(rideData.pickupLocation.address);
            expect(response.body.data.dropLocation.address).toBe(rideData.dropLocation.address);
            expect(response.body.data.status).toBe("pending");
            expect(response.body.data.estimatedFare).toBeGreaterThan(0);
        });

        it("should reject ride with past date", async () => {
            const rideData = {
                pickupLocation: {
                    address: "123 Main St, Mumbai",
                    coordinates: {
                        latitude: 19.0760,
                        longitude: 72.8777
                    }
                },
                dropLocation: {
                    address: "456 Oak Ave, Mumbai",
                    coordinates: {
                        latitude: 19.2183,
                        longitude: 72.9781
                    }
                },
                rideDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
                pickupTime: "09:00",
                dropTime: "17:00"
            };

            const response = await request(app)
                .post("/api/rides")
                .set(authHeaders)
                .send(rideData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain("Ride date cannot be in the past");
        });

        it("should require authentication", async () => {
            const rideData = {
                pickupLocation: {
                    address: "123 Main St, Mumbai",
                    coordinates: {
                        latitude: 19.0760,
                        longitude: 72.8777
                    }
                },
                dropLocation: {
                    address: "456 Oak Ave, Mumbai",
                    coordinates: {
                        latitude: 19.2183,
                        longitude: 72.9781
                    }
                },
                rideDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                pickupTime: "09:00",
                dropTime: "17:00"
            };

            const response = await request(app)
                .post("/api/rides")
                .send(rideData)
                .expect(401);

            expect(response.body.success).toBe(false);
        });
    });

    describe("GET /api/rides/user", () => {
        it("should return user's rides", async () => {
            // Create a test ride
            const ride = await Ride.create({
                userId: testUser._id,
                pickupLocation: {
                    address: "123 Main St, Mumbai",
                    coordinates: {
                        latitude: 19.0760,
                        longitude: 72.8777
                    }
                },
                dropLocation: {
                    address: "456 Oak Ave, Mumbai",
                    coordinates: {
                        latitude: 19.2183,
                        longitude: 72.9781
                    }
                },
                rideDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
                pickupTime: "09:00",
                dropTime: "17:00"
            });

            const response = await request(app)
                .get("/api/rides/user")
                .set(authHeaders)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.rides).toHaveLength(1);
            expect(response.body.data.rides[0]._id).toBe(ride._id.toString());
        });
    });

    describe("DELETE /api/rides/:id", () => {
        it("should cancel a pending ride", async () => {
            // Create a test ride
            const ride = await Ride.create({
                userId: testUser._id,
                pickupLocation: {
                    address: "123 Main St, Mumbai",
                    coordinates: {
                        latitude: 19.0760,
                        longitude: 72.8777
                    }
                },
                dropLocation: {
                    address: "456 Oak Ave, Mumbai",
                    coordinates: {
                        latitude: 19.2183,
                        longitude: 72.9781
                    }
                },
                rideDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
                pickupTime: "09:00",
                dropTime: "17:00",
                status: "pending"
            });

            const response = await request(app)
                .delete(`/api/rides/${ride._id}`)
                .set(authHeaders)
                .send({ reason: "Change of plans" })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.status).toBe("cancelled");
            expect(response.body.data.cancellationReason).toBe("Change of plans");
        });
    });
}); 