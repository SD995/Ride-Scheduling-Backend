import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
        },
        passwordHash: {
            type: String,
            required: [true, "Password is required"]
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
        employeeId: {
            type: String,
            unique: true,
            sparse: true,
            trim: true
        },
        department: {
            type: String,
            trim: true
        },
        phoneNumber: {
            type: String,
            trim: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        lastLogin: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

// Index for efficient queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ employeeId: 1 });

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
    if (!this.isModified("passwordHash")) return next();
    
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
    next();
});

// Method to check password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.passwordHash);
};

// Method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function() {
    const userObject = this.toObject();
    delete userObject.passwordHash;
    return userObject;
};

export const User = mongoose.model("User", userSchema);