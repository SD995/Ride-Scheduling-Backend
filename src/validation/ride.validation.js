import * as z from "zod";

const bookRideSchema = z.object({
    body: z.object({
        pickup: z.object({
            address: z.object({
                street: z.string().min(1, "Pickup street is required"),
                city: z.string().min(1, "Pickup city is required"),
                state: z.string().min(1, "Pickup state is required"),
                zipCode: z.string().optional(),
                country: z.string().optional()
            }),
            location: z.object({
                latitude: z.number().min(-90).max(90, "Invalid latitude"),
                longitude: z.number().min(-180).max(180, "Invalid longitude")
            }),
            instructions: z.string().optional()
        }),
        destination: z.object({
            address: z.object({
                street: z.string().min(1, "Destination street is required"),
                city: z.string().min(1, "Destination city is required"),
                state: z.string().min(1, "Destination state is required"),
                zipCode: z.string().optional(),
                country: z.string().optional()
            }),
            location: z.object({
                latitude: z.number().min(-90).max(90, "Invalid latitude"),
                longitude: z.number().min(-180).max(180, "Invalid longitude")
            }),
            instructions: z.string().optional()
        }),
        rideType: z.enum(["instant", "scheduled", "shared"]).optional(),
        scheduledTime: z.string().datetime("Invalid scheduled time").optional(),
        paymentMethod: z.enum(["cash", "UPI", "digital_wallet"]).optional()
    })
});

const updateRideStatusSchema = z.object({
    body: z.object({
        status: z.enum(["accepted", "started", "completed", "cancelled"]),
        reason: z.string().optional()
    })
});

const rateRideSchema = z.object({
    body: z.object({
        rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
        review: z.string().optional()
    })
});

const cancelRideSchema = z.object({
    body: z.object({
        reason: z.string().optional()
    })
});

const updateRideLocationSchema = z.object({
    body: z.object({
        latitude: z.number().min(-90).max(90, "Invalid latitude"),
        longitude: z.number().min(-180).max(180, "Invalid longitude")
    })
});

const searchRidesSchema = z.object({
    query: z.object({
        status: z.enum(["pending", "accepted", "started", "completed", "cancelled"]).optional(),
        rideType: z.enum(["instant", "scheduled", "shared"]).optional(),
        startDate: z.string().datetime("Invalid start date").optional(),
        endDate: z.string().datetime("Invalid end date").optional(),
        page: z.string().transform(val => parseInt(val)).optional(),
        limit: z.string().transform(val => parseInt(val)).optional()
    })
});

const estimateFareSchema = z.object({
    body: z.object({
        pickup: z.object({
            latitude: z.number().min(-90).max(90, "Invalid latitude"),
            longitude: z.number().min(-180).max(180, "Invalid longitude")
        }),
        destination: z.object({
            latitude: z.number().min(-90).max(90, "Invalid latitude"),
            longitude: z.number().min(-180).max(180, "Invalid longitude")
        }),
        rideType: z.enum(["instant", "scheduled", "shared"]).optional()
    })
});

export {
    bookRideSchema,
    updateRideStatusSchema,
    rateRideSchema,
    cancelRideSchema,
    updateRideLocationSchema,
    searchRidesSchema,
    estimateFareSchema
}; 