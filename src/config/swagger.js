import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Corporate Ride Scheduling API',
      version: '1.0.0',
      description: 'A comprehensive API for managing corporate ride scheduling and transportation services',
      contact: {
        name: 'API Support',
        email: 'support@corporate-rides.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Development server'
      },
      {
        url: 'https://api.corporate-rides.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        userAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-user-id',
          description: 'User ID for authentication'
        },
        roleAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-role',
          description: 'User role (user/admin) for authorization'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Unique user identifier'
            },
            name: {
              type: 'string',
              description: 'User full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'User role'
            },
            employeeId: {
              type: 'string',
              description: 'Employee ID'
            },
            department: {
              type: 'string',
              description: 'User department'
            },
            phoneNumber: {
              type: 'string',
              description: 'User phone number'
            },
            isActive: {
              type: 'boolean',
              description: 'User account status'
            },
            lastLogin: {
              type: 'string',
              format: 'date-time',
              description: 'Last login timestamp'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        Ride: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Unique ride identifier'
            },
            userId: {
              type: 'object',
              description: 'User who requested the ride',
              properties: {
                _id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' },
                employeeId: { type: 'string' },
                department: { type: 'string' }
              }
            },
            pickupLocation: {
              type: 'object',
              properties: {
                address: { type: 'string' },
                coordinates: {
                  type: 'object',
                  properties: {
                    latitude: { type: 'number' },
                    longitude: { type: 'number' }
                  }
                },
                instructions: { type: 'string' }
              }
            },
            dropLocation: {
              type: 'object',
              properties: {
                address: { type: 'string' },
                coordinates: {
                  type: 'object',
                  properties: {
                    latitude: { type: 'number' },
                    longitude: { type: 'number' }
                  }
                },
                instructions: { type: 'string' }
              }
            },
            rideDate: {
              type: 'string',
              format: 'date-time',
              description: 'Scheduled ride date and time'
            },
            status: {
              type: 'string',
              enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
              description: 'Current ride status'
            },
            rideType: {
              type: 'string',
              enum: ['daily', 'one-time', 'recurring'],
              description: 'Type of ride'
            },
            recurringDays: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
              },
              description: 'Days for recurring rides'
            },
            pickupTime: {
              type: 'string',
              pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$',
              description: 'Pickup time in HH:MM format'
            },
            dropTime: {
              type: 'string',
              pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$',
              description: 'Drop time in HH:MM format'
            },
            purpose: {
              type: 'string',
              enum: ['office', 'meeting', 'client-visit', 'airport', 'other'],
              description: 'Purpose of the ride'
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'urgent'],
              description: 'Ride priority level'
            },
            estimatedDistance: {
              type: 'number',
              description: 'Estimated distance in kilometers'
            },
            estimatedDuration: {
              type: 'number',
              description: 'Estimated duration in minutes'
            },
            estimatedFare: {
              type: 'number',
              description: 'Estimated fare in INR'
            },
            actualFare: {
              type: 'number',
              description: 'Actual fare charged'
            },
            driver: {
              type: 'object',
              properties: {
                driverId: { type: 'string' },
                driverName: { type: 'string' },
                vehicleNumber: { type: 'string' },
                phoneNumber: { type: 'string' }
              }
            },
            notes: {
              type: 'string',
              description: 'Additional notes for the ride'
            },
            cancellationReason: {
              type: 'string',
              description: 'Reason for cancellation'
            },
            cancelledBy: {
              type: 'object',
              description: 'User who cancelled the ride'
            },
            cancelledAt: {
              type: 'string',
              format: 'date-time'
            },
            completedAt: {
              type: 'string',
              format: 'date-time'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indicates if the request was successful'
            },
            message: {
              type: 'string',
              description: 'Response message'
            },
            data: {
              type: 'object',
              description: 'Response data'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Response timestamp'
            }
          }
        },
        Pagination: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              description: 'Current page number'
            },
            limit: {
              type: 'integer',
              description: 'Number of items per page'
            },
            total: {
              type: 'integer',
              description: 'Total number of items'
            },
            pages: {
              type: 'integer',
              description: 'Total number of pages'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            error: {
              type: 'object',
              description: 'Error details'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints'
      },
      {
        name: 'Users',
        description: 'User management endpoints'
      },
      {
        name: 'Rides',
        description: 'Ride scheduling and management endpoints'
      },
      {
        name: 'Admin',
        description: 'Administrative endpoints for ride management'
      },
      {
        name: 'Analytics',
        description: 'Analytics and reporting endpoints'
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

export const specs = swaggerJsdoc(options); 