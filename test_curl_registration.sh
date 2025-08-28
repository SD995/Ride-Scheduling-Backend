#!/bin/bash

# Generate unique timestamp
TIMESTAMP=$(date +%s)
EMAIL="testuser${TIMESTAMP}@example.com"
EMPLOYEE_ID="EMP${TIMESTAMP}"

echo "Testing user registration with curl..."
echo "Email: $EMAIL"
echo "Employee ID: $EMPLOYEE_ID"

# Test user registration
curl -X POST http://localhost:8000/api/users/register \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Test User\",
    \"email\": \"$EMAIL\",
    \"password\": \"password123\",
    \"employeeId\": \"$EMPLOYEE_ID\",
    \"department\": \"Engineering\",
    \"phoneNumber\": \"+1234567890\"
  }"

echo -e "\n\nTesting login with the registered user..."
# Test login
curl -X POST http://localhost:8000/api/users/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"password123\"
  }" 