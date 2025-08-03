# Corporate Ride Scheduling System

A comprehensive REST API for managing corporate transportation services, built with Node.js, Express, and MongoDB. This system enables employees to schedule rides for office commutes, client meetings, and other business purposes with admin approval workflow.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Features in Detail](#-features-in-detail)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 Authentication & Authorization
- **User Registration & Login**: Secure user authentication with bcrypt password hashing
- **Role-based Access Control**: User and Admin roles with different permissions
- **Header-based Authentication**: Secure API access using custom headers
- **Session Management**: JWT-based token management

### 🚗 Ride Management
- **Ride Scheduling**: Create one-time, daily, or recurring ride requests
- **Location Services**: GPS coordinates and address-based pickup/drop locations
- **Status Tracking**: Pending, Approved, Rejected, Completed, Cancelled states
- **Priority Levels**: Low, Medium, High, Urgent priority classification
- **Purpose Classification**: Office, Meeting, Client Visit, Airport, Other purposes

### 👥 User Management
- **Employee Profiles**: Complete user profiles with department and contact info
- **Admin Controls**: User status management and profile updates
- **Department Organization**: Department-based user organization

### 📊 Admin Features
- **Ride Approval Workflow**: Admin approval/rejection system
- **Analytics Dashboard**: Ride statistics and reporting
- **User Management**: Complete user administration
- **Driver Assignment**: Driver and vehicle assignment capabilities

### 🛠️ Technical Features
- **RESTful API**: Clean, well-documented REST endpoints
- **Input Validation**: Comprehensive request validation using Zod
- **Error Handling**: Detailed error responses with appropriate HTTP status codes
- **Logging**: Request/response logging with Morgan and Winston
- **Swagger Documentation**: Interactive API documentation
- **Database Indexing**: Optimized MongoDB queries with proper indexing
- **Rate Limiting**: API rate limiting for security
- **CORS Support**: Cross-origin request handling

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Zod** - Schema validation
- **Morgan** - HTTP request logger
- **Winston** - Application logging
- **Swagger** - API documentation

### Development Tools
- **Nodemon** - Development server with auto-reload
- **Jest** - Testing framework
- **Supertest** - HTTP testing
- **ESLint** - Code linting

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **MongoDB** (v5 or higher)
- **Git** (for cloning the repository)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd RSA
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Or create a new `.env` file with the following variables:

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/corporate-rides

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRY=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Redis Configuration (Optional - for caching)
REDIS_URL=redis://localhost:6379

# Cloudinary Configuration (Optional - for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 4. Database Setup

Make sure MongoDB is running on your system:

```bash
# Start MongoDB (Ubuntu/Debian)
sudo systemctl start mongod

# Start MongoDB (macOS with Homebrew)
brew services start mongodb-community

# Start MongoDB (Windows)
net start MongoDB
```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
```

This will start the server with nodemon for automatic reloading on file changes.

### Production Mode

```bash
npm start
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📚 API Documentation

### Interactive Documentation

Once the server is running, you can access the interactive Swagger documentation at:

```
http://localhost:8000/api-docs
```

### Base URL

- **Development**: `http://localhost:8000`
- **Production**: `https://api.corporate-rides.com`

### Authentication

The API uses header-based authentication with two required headers:

- `x-user-id`: User's unique identifier
- `x-role`: User's role (`user` or `admin`)

### Example API Calls

#### 1. User Registration

```bash
curl -X POST http://localhost:8000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@company.com",
    "password": "password123",
    "employeeId": "EMP001",
    "department": "Engineering",
    "phoneNumber": "+1234567890"
  }'
```

#### 2. User Login

```bash
curl -X POST http://localhost:8000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@company.com",
    "password": "password123"
  }'
```

#### 3. Create Ride Request

```bash
curl -X POST http://localhost:8000/api/rides \
  -H "Content-Type: application/json" \
  -H "x-user-id: YOUR_USER_ID" \
  -H "x-role: user" \
  -d '{
    "pickupLocation": {
      "address": "123 Main Street, City",
      "coordinates": {
        "latitude": 12.9716,
        "longitude": 77.5946
      },
      "instructions": "Near the main gate"
    },
    "dropLocation": {
      "address": "456 Business Park, City",
      "coordinates": {
        "latitude": 12.9716,
        "longitude": 77.5946
      },
      "instructions": "Building A, Floor 3"
    },
    "rideDate": "2024-01-15T09:00:00.000Z",
    "rideType": "one-time",
    "pickupTime": "09:00",
    "dropTime": "17:00",
    "purpose": "office",
    "priority": "medium",
    "notes": "Need wheelchair accessible vehicle"
  }'
```

#### 4. Get User Profile

```bash
curl -X GET http://localhost:8000/api/users/me \
  -H "x-user-id: YOUR_USER_ID" \
  -H "x-role: user"
```

#### 5. Get User's Rides

```bash
curl -X GET "http://localhost:8000/api/rides/user?status=pending&page=1&limit=10" \
  -H "x-user-id: YOUR_USER_ID" \
  -H "x-role: user"
```

### Admin Endpoints

#### 1. Get All Users (Admin Only)

```bash
curl -X GET "http://localhost:8000/api/users?page=1&limit=10&role=user&department=Engineering" \
  -H "x-user-id: ADMIN_USER_ID" \
  -H "x-role: admin"
```

#### 2. Update Ride Status (Admin Only)

```bash
curl -X PATCH http://localhost:8000/api/rides/RIDE_ID/status \
  -H "Content-Type: application/json" \
  -H "x-user-id: ADMIN_USER_ID" \
  -H "x-role: admin" \
  -d '{
    "status": "approved",
    "reason": "Ride approved based on availability"
  }'
```

## 🧪 Testing

### Automated Testing

The project includes comprehensive test suites:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Manual Testing

1. **Health Check**: Test if the server is running
   ```bash
   curl http://localhost:8000/health
   ```

2. **Swagger UI**: Interactive API testing
   - Open `http://localhost:8000/api-docs`
   - Use the "Try it out" feature for each endpoint

3. **Backend Health Check Script**:
   ```bash
   node test_backend.js
   ```

## 📁 Project Structure

```
RSA/
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── swagger.js         # Swagger documentation setup
│   ├── controllers/
│   │   ├── auth.controller.js  # Authentication logic
│   │   ├── ride.controller.js  # Ride management logic
│   │   └── user.controller.js  # User management logic
│   ├── middlewares/
│   │   ├── auth.middleware.js  # Authentication middleware
│   │   ├── errorHandler.middleware.js  # Error handling
│   │   ├── role.middleware.js  # Role-based access control
│   │   └── validate.middleware.js  # Request validation
│   ├── models/
│   │   ├── adminAction.model.js  # Admin action tracking
│   │   ├── ride.model.js       # Ride data model
│   │   └── user.model.js       # User data model
│   ├── routes/
│   │   ├── auth.routes.js      # Authentication routes
│   │   ├── ride.routes.js      # Ride management routes
│   │   └── user.routes.js      # User management routes
│   ├── utils/
│   │   ├── APIerror.js         # Custom error classes
│   │   ├── APIresponse.js      # Standardized response format
│   │   ├── AsyncHandler.js     # Async error handling
│   │   ├── jwt.js             # JWT utilities
│   │   ├── Logger.js          # Logging utilities
│   │   └── morganLogger.js    # HTTP request logging
│   └── validation/
│       ├── auth.validation.js  # Authentication validation
│       └── ride.validation.js  # Ride validation schemas
├── tests/
│   └── ride.test.js           # Ride-related tests
├── app.js                     # Express app configuration
├── index.js                   # Server entry point
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🔧 Features in Detail

### 1. User Management System

- **Registration**: Complete user registration with validation
- **Login**: Secure authentication with password hashing
- **Profile Management**: Update user profiles and preferences
- **Role-based Access**: User and Admin roles with different permissions
- **Department Organization**: Users organized by departments

### 2. Ride Scheduling System

- **Multiple Ride Types**: One-time, daily, and recurring rides
- **Location Services**: GPS coordinates and address-based locations
- **Time Management**: Pickup and drop time scheduling
- **Priority System**: Multiple priority levels for ride requests
- **Purpose Classification**: Different ride purposes (office, meeting, etc.)

### 3. Admin Workflow

- **Approval System**: Admin approval/rejection of ride requests
- **User Management**: Complete user administration capabilities
- **Analytics**: Ride statistics and reporting features
- **Driver Assignment**: Assign drivers and vehicles to rides

### 4. Technical Features

- **RESTful Design**: Clean, well-structured API endpoints
- **Validation**: Comprehensive input validation using Zod
- **Error Handling**: Detailed error responses with proper HTTP status codes
- **Logging**: Request/response logging and application logging
- **Documentation**: Interactive Swagger documentation
- **Testing**: Comprehensive test suites with Jest
- **Security**: JWT authentication, password hashing, CORS support

### 5. Database Features

- **MongoDB**: NoSQL database with Mongoose ODM
- **Indexing**: Optimized queries with proper database indexing
- **Geospatial Queries**: Location-based ride queries
- **Data Validation**: Schema-level validation and constraints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR


## 🚀 Deployment

### Production Deployment

1. Set up environment variables for production
2. Configure MongoDB connection for production
3. Set up proper logging and monitoring
4. Configure CORS for your frontend domain
5. Set up SSL certificates for HTTPS
6. Configure rate limiting and security headers

### Environment Variables for Production

```env
NODE_ENV=production
PORT=8000
MONGODB_URI=mongodb://your-production-db-url
JWT_SECRET=your-production-jwt-secret
CORS_ORIGIN=https://your-frontend-domain.com
```

---

**Built with ❤️ for Corporate Transportation Management**

# Ride-Scheduling-Backend
