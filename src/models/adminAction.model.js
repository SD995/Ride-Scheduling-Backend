import mongoose from "mongoose";

const { Schema } = mongoose;

const adminActionSchema = new Schema(
    {
        rideId: {
            type: Schema.Types.ObjectId,
            ref: "Ride",
            required: true,
            index: true
        },
        adminId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        action: {
            type: String,
            enum: ["approve", "reject", "modify", "cancel", "assign_driver"],
            required: true
        },
        reason: {
            type: String,
            trim: true
        },
        previousStatus: {
            type: String,
            enum: ["pending", "approved", "rejected", "completed", "cancelled"]
        },
        newStatus: {
            type: String,
            enum: ["pending", "approved", "rejected", "completed", "cancelled"]
        },
        metadata: {
            type: Schema.Types.Mixed,
            default: {}
        },
        ipAddress: {
            type: String,
            trim: true
        },
        userAgent: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

// Indexes for efficient queries
adminActionSchema.index({ rideId: 1, createdAt: -1 });
adminActionSchema.index({ adminId: 1, createdAt: -1 });
adminActionSchema.index({ action: 1, createdAt: -1 });
adminActionSchema.index({ createdAt: -1 });

// Method to log admin action
adminActionSchema.statics.logAction = function(actionData) {
    return this.create(actionData);
};

// Method to get actions for a specific ride
adminActionSchema.statics.getRideActions = function(rideId) {
    return this.find({ rideId })
        .populate("adminId", "name email")
        .sort({ createdAt: -1 });
};

// Method to get actions by admin
adminActionSchema.statics.getAdminActions = function(adminId, limit = 50) {
    return this.find({ adminId })
        .populate("rideId", "pickupLocation dropLocation rideDate status")
        .sort({ createdAt: -1 })
        .limit(limit);
};

export const AdminAction = mongoose.model("AdminAction", adminActionSchema); 