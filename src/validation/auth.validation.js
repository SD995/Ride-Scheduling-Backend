import * as z from "zod";

const registerSchema = z.object({
    body: z.object({
        username: z.string().min(1, "username is required"),
        email: z.string().email("invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        fullname: z.string().min(1, "fullname is required"),
        phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
        role: z.enum(["rider", "driver", "admin"]).optional(),
        address: z.object({
            street: z.string().optional(),
            city: z.string().optional(),
            state: z.string().optional(),
            zipCode: z.string().optional(),
            country: z.string().optional()
        }).optional(),
        emergencyContact: z.object({
            name: z.string().optional(),
            phone: z.string().optional(),
            relationship: z.string().optional()
        }).optional()
    })
});

const loginSchema = z.object({
    body: z.object({
        identifier: z.string().min(1, "email, username or phone number required"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    })
});

const updateProfileSchema = z.object({
    body: z.object({
        fullname: z.string().min(1, "fullname is required").optional(),
        phoneNumber: z.string().min(10, "Phone number must be at least 10 digits").optional(),
        address: z.object({
            street: z.string().optional(),
            city: z.string().optional(),
            state: z.string().optional(),
            zipCode: z.string().optional(),
            country: z.string().optional()
        }).optional(),
        emergencyContact: z.object({
            name: z.string().optional(),
            phone: z.string().optional(),
            relationship: z.string().optional()
        }).optional(),
        preferences: z.object({
            preferredPaymentMethod: z.enum(["cash", "card", "digital_wallet"]).optional(),
            notifications: z.object({
                email: z.boolean().optional(),
                sms: z.boolean().optional(),
                push: z.boolean().optional()
            }).optional(),
            language: z.string().optional()
        }).optional()
    })
});

const driverRegistrationSchema = z.object({
    body: z.object({
        licenseNumber: z.string().min(1, "License number is required"),
        vehicleInfo: z.object({
            make: z.string().min(1, "Vehicle make is required"),
            model: z.string().min(1, "Vehicle model is required"),
            year: z.number().min(1900, "Invalid year").max(new Date().getFullYear() + 1, "Invalid year"),
            color: z.string().min(1, "Vehicle color is required"),
            licensePlate: z.string().min(1, "License plate is required")
        }),
        insuranceInfo: z.object({
            provider: z.string().min(1, "Insurance provider is required"),
            policyNumber: z.string().min(1, "Policy number is required"),
            expiryDate: z.string().datetime("Invalid expiry date")
        })
    })
});

export { registerSchema, loginSchema, updateProfileSchema, driverRegistrationSchema };