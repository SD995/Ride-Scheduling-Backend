import mongoose from "mongoose";

const { Schema } = mongoose;

const rideSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        pickupLocation: {
            address: {
                type: String,
                required: [true, "Pickup address is required"],
                trim: true
            },
            coordinates: {
                latitude: {
                    type: Number,
                    required: [true, "Pickup latitude is required"]
                },
                longitude: {
                    type: Number,
                    required: [true, "Pickup longitude is required"]
                }
            },
            instructions: {
                type: String,
                trim: true
            }
        },
        dropLocation: {
            address: {
                type: String,
                required: [true, "Drop address is required"],
                trim: true
            },
            coordinates: {
                latitude: {
                    type: Number,
                    required: [true, "Drop latitude is required"]
                },
                longitude: {
                    type: Number,
                    required: [true, "Drop longitude is required"]
                }
            },
            instructions: {
                type: String,
                trim: true
            }
        },
        rideDate: {
            type: Date,
            required: [true, "Ride date is required"],
            index: true
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "completed", "cancelled"],
            default: "pending",
            index: true
        },
        rideType: {
            type: String,
            enum: ["daily", "one-time", "recurring"],
            default: "one-time"
        },
        recurringDays: [{
            type: String,
            enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
        }],
        pickupTime: {
            type: String,
            required: [true, "Pickup time is required"],
            match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter time in HH:MM format"]
        },
        dropTime: {
            type: String,
            required: [true, "Drop time is required"],
            match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter time in HH:MM format"]
        },
        purpose: {
            type: String,
            enum: ["office", "meeting", "client-visit", "airport", "other"],
            default: "office"
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high", "urgent"],
            default: "medium"
        },
        estimatedDistance: {
            type: Number, // in kilometers
            default: 0
        },
        estimatedDuration: {
            type: Number, // in minutes
            default: 0
        },
        estimatedFare: {
            type: Number,
            default: 0
        },
        actualFare: {
            type: Number,
            default: 0
        },
        driver: {
            driverId: {
                type: String,
                trim: true
            },
            driverName: {
                type: String,
                trim: true
            },
            vehicleNumber: {
                type: String,
                trim: true
            },
            phoneNumber: {
                type: String,
                trim: true
            }
        },
        notes: {
            type: String,
            trim: true
        },
        cancellationReason: {
            type: String,
            trim: true
        },
        cancelledBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        cancelledAt: {
            type: Date
        },
        completedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

// Indexes for efficient queries
rideSchema.index({ userId: 1, status: 1 });
rideSchema.index({ rideDate: 1, status: 1 });
rideSchema.index({ status: 1, createdAt: -1 });
rideSchema.index({ "pickupLocation.coordinates": "2dsphere" });
rideSchema.index({ "dropLocation.coordinates": "2dsphere" });

// Method to calculate distance between pickup and drop
rideSchema.methods.calculateDistance = function() {
    const R = 6371; // Earth's radius in kilometers
    const lat1 = this.pickupLocation.coordinates.latitude * Math.PI / 180;
    const lat2 = this.dropLocation.coordinates.latitude * Math.PI / 180;
    const dLat = (this.dropLocation.coordinates.latitude - this.pickupLocation.coordinates.latitude) * Math.PI / 180;
    const dLon = (this.dropLocation.coordinates.longitude - this.pickupLocation.coordinates.longitude) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    this.estimatedDistance = R * c;
    return this.estimatedDistance;
};

// Method to estimate duration based on distance
rideSchema.methods.estimateDuration = function() {
    // Assume average speed of 30 km/h in city traffic
    const averageSpeed = 30; // km/h
    this.estimatedDuration = Math.ceil((this.estimatedDistance / averageSpeed) * 60);
    return this.estimatedDuration;
};

// Method to calculate estimated fare
rideSchema.methods.calculateFare = function() {
    const baseFare = 50; // Base fare in INR
    const perKmRate = 15; // Rate per kilometer
    const perMinuteRate = 2; // Rate per minute
    
    const distanceFare = this.estimatedDistance * perKmRate;
    const timeFare = this.estimatedDuration * perMinuteRate;
    
    this.estimatedFare = baseFare + distanceFare + timeFare;
    return this.estimatedFare;
};

// Method to update ride status
rideSchema.methods.updateStatus = function(newStatus, reason = "") {
    this.status = newStatus;
    
    if (newStatus === "cancelled") {
        this.cancelledAt = new Date();
        this.cancellationReason = reason;
    } else if (newStatus === "completed") {
        this.completedAt = new Date();
    }
    
    return this.save();
};

// Method to assign driver
rideSchema.methods.assignDriver = function(driverInfo) {
    this.driver = driverInfo;
    return this.save();
};

// Method to check if ride can be cancelled
rideSchema.methods.canBeCancelled = function() {
    const now = new Date();
    const rideDateTime = new Date(this.rideDate);
    const timeDiff = rideDateTime - now;
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    // Can cancel if more than 2 hours before ride
    return hoursDiff > 2;
};

export const Ride = mongoose.model("Ride", rideSchema); 