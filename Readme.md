# Corporate Ride Scheduling System

A complete Express.js + MongoDB backend for Rapido's corporate ride scheduling portal. This system allows corporate clients to pre-schedule daily rides for their employees with approval workflows and admin analytics.

## 🚀 Features

- **User Management**: Employee registration, authentication, and profile management
- **Ride Booking**: Schedule rides with pickup/drop locations, dates, and times
- **Approval Workflows**: Admin approval/rejection system for ride requests
- **Analytics**: Comprehensive admin dashboard with ride analytics
- **Role-based Access**: User and admin roles with proper authorization
- **Audit Trail**: Complete tracking of admin actions
- **Real-time Logging**: Winston + Morgan HTTP logging
- **Testing**: Jest + Supertest with in-memory MongoDB

## 🛠 Tech Stack

- **Runtime**: Node.js (ES6 Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Header-based simulation (`x-user-id`, `x-role`)
- **Logging**: Winston + Morgan
- **Testing**: Jest + Supertest + mongodb-memory-server
- **Validation**: Built-in validation with error handling

## 📁 Project Structure

```
src/
├── models/
│   ├── user.model.js          # User schema with corporate fields
│   ├── ride.model.js          # Ride booking schema
│   └── adminAction.model.js   # Admin action audit trail
├── controllers/
│   ├── user.controller.js     # User management logic
│   └── ride.controller.js     # Ride booking logic
├── routes/
│   ├── user.routes.js         # User endpoints
│   └── ride.routes.js         # Ride endpoints
├── middlewares/
│   ├── auth.middleware.js     # Authentication & authorization
│   └── errorHandler.middleware.js # Global error handling
├── utils/
│   ├── ApiResponse.js         # Standardized response class
│   ├── ApiError.js           # Custom error class
│   ├── asyncHandler.js       # Async route wrapper
│   ├── logger.js             # Winston logger
│   └── morganLogger.js       # Morgan HTTP logging
└── tests/
    └── ride.test.js          # Basic API tests
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or cloud)

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file:
   ```env
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/corporate-rides
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Run tests:**
   ```bash
   npm test
   ```

## 📋 API Endpoints

### User Management

#### Public Routes
- `POST /api/users/register` - Register new employee
- `POST /api/users/login` - Employee login

#### Protected Routes
- `GET /api/users/me` - Get own profile
- `PUT /api/users/me` - Update own profile

#### Admin Routes
- `GET /api/users` - Get all users (with filters)
- `GET /api/users/:userId` - Get specific user
- `PATCH /api/users/:userId/status` - Update user status

### Ride Booking

#### User Routes
- `POST /api/rides` - Create new ride booking
- `GET /api/rides/user` - Get user's rides
- `GET /api/rides/:id` - Get specific ride details
- `DELETE /api/rides/:id` - Cancel ride

#### Admin Routes
- `GET /api/rides` - Get all rides (with filters)
- `PATCH /api/rides/:id/status` - Approve/reject ride
- `GET /api/rides/admin/analytics` - Get ride analytics

## 🔐 Authentication

The system uses header-based authentication simulation:

```bash
# Required headers for authenticated requests
x-user-id: <user_id>
x-role: user|admin
```

### Example Usage

```bash
# Login to get user ID and role
curl -X POST http://localhost:8000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@company.com", "password": "password123"}'

# Use returned headers for subsequent requests
curl -X GET http://localhost:8000/api/users/me \
  -H "x-user-id: 64f1a2b3c4d5e6f7g8h9i0j1" \
  -H "x-role: user"
```

## 📊 Data Models

### User Model
```javascript
{
  name: String,           // Employee name
  email: String,          // Corporate email
  passwordHash: String,   // Hashed password
  role: String,           // "user" | "admin"
  employeeId: String,     // Corporate employee ID
  department: String,     // Department name
  phoneNumber: String,    // Contact number
  isActive: Boolean,      // Account status
  lastLogin: Date         // Last login timestamp
}
```

### Ride Model
```javascript
{
  userId: ObjectId,       // Employee reference
  pickupLocation: {       // Pickup details
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    instructions: String
  },
  dropLocation: {         // Drop details
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    instructions: String
  },
  rideDate: Date,         // Scheduled date
  status: String,         // "pending" | "approved" | "rejected" | "completed" | "cancelled"
  rideType: String,       // "one-time" | "daily" | "recurring"
  pickupTime: String,     // HH:MM format
  dropTime: String,       // HH:MM format
  purpose: String,        // "office" | "meeting" | "client-visit" | "airport" | "other"
  priority: String,       // "low" | "medium" | "high" | "urgent"
  estimatedDistance: Number,  // Calculated distance
  estimatedDuration: Number,  // Estimated travel time
  estimatedFare: Number,      // Calculated fare
  notes: String,          // Additional notes
  driver: {               // Driver assignment (when approved)
    driverId: String,
    driverName: String,
    vehicleNumber: String,
    phoneNumber: String
  }
}
```

## 🎯 Business Logic

### Ride Booking Flow
1. **Employee books ride** → Status: `pending`
2. **Admin reviews** → Status: `approved` or `rejected`
3. **Driver assigned** → Driver details added
4. **Ride completed** → Status: `completed`

### Fare Calculation
- **Base Fare**: ₹50
- **Distance Fare**: ₹15 per kilometer
- **Time Fare**: ₹2 per minute
- **Total**: Base + Distance + Time

### Cancellation Rules
- Can only cancel rides in `pending` or `approved` status
- Must cancel at least 2 hours before scheduled time
- Cancellation reason is logged

## 📈 Analytics

Admin analytics include:
- **Ride counts by date/status/purpose**
- **Total fare calculations**
- **Status breakdown**
- **Filterable by date ranges**

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure
- **In-memory MongoDB**: Uses `mongodb-memory-server`
- **Supertest**: HTTP assertions
- **Jest**: Test framework
- **Coverage**: Built-in coverage reporting

## 📝 Logging

### Winston Logger
- **File logging**: `logs/error.log`, `logs/combined.log`
- **Console logging**: Development environment
- **Structured JSON**: Production format

### Morgan HTTP Logging
- **Request logging**: Method, URL, status, response time
- **Winston integration**: HTTP logs via Winston stream

## 🔧 Configuration

### Environment Variables
```env
PORT=8000                          # Server port
MONGODB_URI=mongodb://localhost:27017/corporate-rides
NODE_ENV=development               # Environment
CORS_ORIGIN=http://localhost:3000  # CORS origin
```

### Database Indexes
- **User indexes**: email, role, employeeId
- **Ride indexes**: userId, status, rideDate, geospatial
- **AdminAction indexes**: rideId, adminId, action, timestamp

## 🚀 Deployment

### Production Setup
1. Set `NODE_ENV=production`
2. Configure MongoDB connection
3. Set up proper CORS origins
4. Configure Winston logging
5. Set up process manager (PM2)

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## 📄 License

ISC License

## 🆘 Support

For issues and questions:
- Create GitHub issue
- Check existing documentation
- Review test cases for examples

---

**Built for Rapido Corporate Ride Scheduling Portal** 🚗

