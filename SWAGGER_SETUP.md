# Swagger Documentation Setup

## Overview

Comprehensive Swagger/OpenAPI documentation has been successfully implemented for the Corporate Ride Scheduling API. The documentation provides interactive API testing and complete endpoint documentation.

## What's Been Implemented

### 1. Swagger Configuration (`src/config/swagger.js`)
- **OpenAPI 3.0.0** specification
- **Comprehensive schemas** for all data models (User, Ride, ApiResponse, Error, Pagination)
- **Security schemes** for authentication (x-user-id and x-role headers)
- **Server configurations** for development and production environments
- **Organized tags** for different API sections (Authentication, Users, Rides, Admin, Analytics)

### 2. Route Documentation
All API endpoints are now documented with:
- **Detailed request/response schemas**
- **Authentication requirements**
- **Query parameters and path variables**
- **Example request bodies**
- **All possible response codes**
- **Comprehensive descriptions**

### 3. Swagger UI Integration
- **Interactive documentation** available at `/api-docs`
- **Custom styling** and branding
- **Real-time API testing** capabilities
- **Request/response examples**

## Accessing the Documentation

### Local Development
```
http://localhost:8000/api-docs
```

### Production
```
https://api.corporate-rides.com/api-docs
```

## Features Included

### Authentication Documentation
- **Header-based authentication** with x-user-id and x-role
- **Role-based access control** (user/admin)
- **Security scheme definitions**

### Complete API Coverage
- **User Management**: Registration, login, profile management
- **Ride Management**: Create, view, cancel rides
- **Admin Functions**: User management, ride approval, analytics
- **Analytics**: Comprehensive reporting and statistics

### Data Model Documentation
- **User Model**: Complete user profile structure
- **Ride Model**: Detailed ride information with locations, timing, status
- **Response Models**: Standardized API response format
- **Error Models**: Comprehensive error handling documentation

### Interactive Testing
- **Try it out** functionality for all endpoints
- **Request body examples** for complex operations
- **Response schema validation**
- **Authentication header management**

## API Endpoints Documented

### Authentication (2 endpoints)
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login

### User Management (5 endpoints)
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/{userId}` - Get user by ID (Admin)
- `PATCH /api/users/{userId}/status` - Update user status (Admin)

### Ride Management (6 endpoints)
- `POST /api/rides` - Create new ride request
- `GET /api/rides/user` - Get user's rides
- `GET /api/rides/{id}` - Get ride details
- `DELETE /api/rides/{id}` - Cancel ride
- `GET /api/rides` - Get all rides (Admin)
- `PATCH /api/rides/{id}/status` - Update ride status (Admin)

### Analytics (1 endpoint)
- `GET /api/rides/admin/analytics` - Get ride analytics (Admin)

## Benefits

### For Developers
- **Interactive testing** without external tools
- **Complete request/response examples**
- **Schema validation** for all data models
- **Authentication flow** documentation

### For API Consumers
- **Self-documenting API** with examples
- **Clear parameter descriptions**
- **Error handling documentation**
- **Response format standardization**

### For Maintenance
- **Auto-generated documentation** from code
- **Version control** for API changes
- **Consistent documentation** across all endpoints
- **Easy updates** when API changes

## Usage Examples

### Testing User Registration
1. Navigate to `/api-docs`
2. Find the "Authentication" section
3. Click on `POST /api/users/register`
4. Click "Try it out"
5. Fill in the request body with user details
6. Click "Execute"

### Testing Ride Creation
1. First authenticate using login endpoint
2. Copy the user ID and role from response
3. Use these in the x-user-id and x-role headers
4. Navigate to ride creation endpoint
5. Fill in ride details and execute

### Admin Functions
1. Use admin credentials (role: "admin")
2. Access admin-only endpoints
3. Test user management and ride approval
4. View analytics and reporting

## Maintenance

### Adding New Endpoints
1. Add JSDoc comments to the route file
2. Follow the existing documentation pattern
3. Include all required fields (summary, tags, security, requestBody, responses)
4. Update the swagger configuration if new schemas are needed

### Updating Documentation
- Documentation is auto-generated from JSDoc comments
- Update route files to modify endpoint documentation
- Update `src/config/swagger.js` for global changes

## Dependencies Added
```json
{
  "swagger-jsdoc": "^6.2.8",
  "swagger-ui-express": "^5.0.0"
}
```

## Files Modified/Created
- `src/config/swagger.js` - Swagger configuration
- `app.js` - Swagger UI integration
- `src/routes/user.routes.js` - User endpoint documentation
- `src/routes/ride.routes.js` - Ride endpoint documentation
- `API_DOCUMENTATION.md` - Comprehensive API documentation
- `SWAGGER_SETUP.md` - This setup guide

## Next Steps

1. **Add more detailed examples** for complex endpoints
2. **Implement API versioning** in the documentation
3. **Add more response examples** for different scenarios
4. **Include webhook documentation** if implemented
5. **Add rate limiting documentation**

The Swagger documentation is now fully functional and provides comprehensive API documentation for the entire Corporate Ride Scheduling API. 