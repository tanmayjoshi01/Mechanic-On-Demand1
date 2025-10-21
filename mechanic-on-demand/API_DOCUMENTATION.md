# 🔧 Mechanic On Demand - API Documentation

Complete REST API documentation for the Mechanic On Demand platform.

## 📋 Table of Contents

- [Authentication](#authentication)
- [Customer APIs](#customer-apis)
- [Mechanic APIs](#mechanic-apis)
- [Admin APIs](#admin-apis)
- [Notification APIs](#notification-apis)
- [WebSocket APIs](#websocket-apis)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

## 🔐 Authentication

All protected endpoints require JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### POST /api/auth/signin
Login with username and password.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "id": 1,
  "username": "customer1",
  "email": "customer@example.com",
  "fullName": "John Doe",
  "roles": ["ROLE_CUSTOMER"]
}
```

### POST /api/auth/signup
Register a new user account.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "fullName": "string",
  "phoneNumber": "string",
  "address": "string",
  "city": "string",
  "pincode": "string",
  "role": "CUSTOMER|MECHANIC"
}
```

**Response:**
```json
{
  "message": "User registered successfully!"
}
```

## 👤 Customer APIs

### GET /api/customer/mechanics
Get all available mechanics.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": 1,
    "user": {
      "id": 3,
      "fullName": "Mike Wilson",
      "email": "mechanic@example.com",
      "phoneNumber": "9876543211",
      "city": "Mumbai",
      "pincode": "400001"
    },
    "skills": "Engine repair, Brake service",
    "description": "Experienced mechanic...",
    "hourlyRate": 500.00,
    "yearsOfExperience": 10,
    "isAvailable": true,
    "isVerified": true,
    "rating": 4.5,
    "totalReviews": 25
  }
]
```

### GET /api/customer/mechanics/city/{city}
Get mechanics by city.

**Parameters:**
- `city` (path) - City name

**Response:** Same as above

### GET /api/customer/mechanics/pincode/{pincode}
Get mechanics by pincode.

**Parameters:**
- `pincode` (path) - Pincode

**Response:** Same as above

### GET /api/customer/mechanics/search
Search mechanics by skill.

**Parameters:**
- `skill` (query) - Skill keyword

**Response:** Same as above

### POST /api/customer/bookings
Create a new booking.

**Request Body:**
```json
{
  "mechanicId": 1,
  "problemDescription": "Car engine making strange noise",
  "vehicleType": "Car",
  "vehicleModel": "Honda City",
  "serviceLocation": "123 Main Street, Mumbai",
  "preferredDateTime": "2023-12-01T10:00:00"
}
```

**Response:**
```json
{
  "id": 1,
  "customer": {
    "id": 2,
    "fullName": "John Doe"
  },
  "mechanic": {
    "id": 1,
    "user": {
      "fullName": "Mike Wilson"
    }
  },
  "problemDescription": "Car engine making strange noise",
  "vehicleType": "Car",
  "vehicleModel": "Honda City",
  "serviceLocation": "123 Main Street, Mumbai",
  "status": "PENDING",
  "createdAt": "2023-12-01T09:00:00",
  "preferredDateTime": "2023-12-01T10:00:00"
}
```

### GET /api/customer/bookings
Get customer's bookings.

**Response:**
```json
[
  {
    "id": 1,
    "mechanic": {
      "user": {
        "fullName": "Mike Wilson",
        "phoneNumber": "9876543211"
      }
    },
    "problemDescription": "Car engine making strange noise",
    "status": "ACCEPTED",
    "createdAt": "2023-12-01T09:00:00",
    "mechanicNotes": "Will arrive at 10 AM"
  }
]
```

### PUT /api/customer/bookings/{id}/cancel
Cancel a booking.

**Parameters:**
- `id` (path) - Booking ID

**Response:**
```json
{
  "message": "Booking cancelled successfully"
}
```

## 👨‍🔧 Mechanic APIs

### GET /api/mechanic/profile
Get mechanic profile.

**Response:**
```json
{
  "id": 1,
  "user": {
    "id": 3,
    "fullName": "Mike Wilson",
    "email": "mechanic@example.com",
    "phoneNumber": "9876543211",
    "city": "Mumbai",
    "pincode": "400001"
  },
  "skills": "Engine repair, Brake service",
  "description": "Experienced mechanic...",
  "hourlyRate": 500.00,
  "yearsOfExperience": 10,
  "certifications": "ASE Certified",
  "isAvailable": true,
  "isVerified": true,
  "rating": 4.5,
  "totalReviews": 25
}
```

### POST /api/mechanic/profile
Create mechanic profile.

**Request Body:**
```json
{
  "skills": "Engine repair, Brake service, AC repair",
  "description": "Experienced mechanic with 10+ years...",
  "hourlyRate": 500.00,
  "yearsOfExperience": 10,
  "certifications": "ASE Certified, Automotive Technology Diploma",
  "isAvailable": true
}
```

**Response:** Same as GET profile

### PUT /api/mechanic/profile
Update mechanic profile.

**Request Body:** Same as POST

**Response:** Same as GET profile

### GET /api/mechanic/bookings
Get mechanic's bookings.

**Response:**
```json
[
  {
    "id": 1,
    "customer": {
      "fullName": "John Doe",
      "phoneNumber": "9876543210"
    },
    "problemDescription": "Car engine making strange noise",
    "vehicleType": "Car",
    "vehicleModel": "Honda City",
    "serviceLocation": "123 Main Street, Mumbai",
    "status": "PENDING",
    "createdAt": "2023-12-01T09:00:00",
    "preferredDateTime": "2023-12-01T10:00:00"
  }
]
```

### PUT /api/mechanic/bookings/{id}/accept
Accept a booking.

**Parameters:**
- `id` (path) - Booking ID
- `notes` (query, optional) - Mechanic notes

**Response:**
```json
{
  "id": 1,
  "status": "ACCEPTED",
  "mechanicNotes": "Will arrive at 10 AM",
  "acceptedAt": "2023-12-01T09:30:00"
}
```

### PUT /api/mechanic/bookings/{id}/reject
Reject a booking.

**Parameters:**
- `id` (path) - Booking ID
- `notes` (query, optional) - Rejection reason

**Response:**
```json
{
  "id": 1,
  "status": "REJECTED",
  "mechanicNotes": "Not available at requested time"
}
```

### PUT /api/mechanic/bookings/{id}/complete
Mark booking as complete.

**Parameters:**
- `id` (path) - Booking ID
- `notes` (query, optional) - Completion notes

**Response:**
```json
{
  "id": 1,
  "status": "COMPLETED",
  "mechanicNotes": "Service completed successfully",
  "completedAt": "2023-12-01T12:00:00"
}
```

### PUT /api/mechanic/availability
Update availability status.

**Parameters:**
- `available` (query) - true/false

**Response:**
```json
{
  "id": 1,
  "isAvailable": true
}
```

## 👑 Admin APIs

### GET /api/admin/users
Get all users.

**Response:**
```json
[
  {
    "id": 1,
    "username": "customer1",
    "email": "customer@example.com",
    "fullName": "John Doe",
    "role": "CUSTOMER",
    "city": "Mumbai",
    "isActive": true,
    "createdAt": "2023-12-01T00:00:00"
  }
]
```

### GET /api/admin/mechanics
Get all mechanics.

**Response:**
```json
[
  {
    "id": 1,
    "user": {
      "fullName": "Mike Wilson",
      "email": "mechanic@example.com"
    },
    "skills": "Engine repair, Brake service",
    "yearsOfExperience": 10,
    "hourlyRate": 500.00,
    "rating": 4.5,
    "isVerified": true,
    "isAvailable": true
  }
]
```

### PUT /api/admin/mechanics/{id}/verify
Verify a mechanic.

**Parameters:**
- `id` (path) - Mechanic ID

**Response:**
```json
{
  "message": "Mechanic verified successfully"
}
```

### GET /api/admin/bookings
Get all bookings.

**Response:**
```json
[
  {
    "id": 1,
    "customer": {
      "fullName": "John Doe"
    },
    "mechanic": {
      "user": {
        "fullName": "Mike Wilson"
      }
    },
    "problemDescription": "Car engine making strange noise",
    "status": "COMPLETED",
    "createdAt": "2023-12-01T09:00:00"
  }
]
```

### GET /api/admin/dashboard/stats
Get dashboard statistics.

**Response:**
```json
{
  "totalUsers": 150,
  "totalCustomers": 120,
  "totalMechanics": 25,
  "activeUsers": 140,
  "verifiedMechanics": 20,
  "availableMechanics": 15,
  "totalBookings": 500,
  "pendingBookings": 10,
  "acceptedBookings": 15,
  "completedBookings": 450,
  "cancelledBookings": 25
}
```

### PUT /api/admin/users/{id}/activate
Activate a user.

**Parameters:**
- `id` (path) - User ID

**Response:**
```json
{
  "message": "User activated successfully"
}
```

### PUT /api/admin/users/{id}/deactivate
Deactivate a user.

**Parameters:**
- `id` (path) - User ID

**Response:**
```json
{
  "message": "User deactivated successfully"
}
```

### DELETE /api/admin/users/{id}
Delete a user.

**Parameters:**
- `id` (path) - User ID

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

## 🔔 Notification APIs

### GET /api/notifications
Get user's notifications.

**Response:**
```json
[
  {
    "id": 1,
    "title": "Booking Accepted",
    "message": "Your booking request has been accepted by Mike Wilson",
    "type": "BOOKING_ACCEPTED",
    "isRead": false,
    "createdAt": "2023-12-01T09:30:00"
  }
]
```

### GET /api/notifications/unread
Get unread notifications.

**Response:** Same as above, filtered for unread

### GET /api/notifications/unread/count
Get unread notification count.

**Response:**
```json
5
```

### PUT /api/notifications/{id}/read
Mark notification as read.

**Parameters:**
- `id` (path) - Notification ID

**Response:**
```json
{
  "message": "Notification marked as read"
}
```

### PUT /api/notifications/read-all
Mark all notifications as read.

**Response:**
```json
{
  "message": "All notifications marked as read"
}
```

## 🔌 WebSocket APIs

### Connection
Connect to WebSocket endpoint:
```
ws://localhost:8080/ws
```

### Subscription Channels

#### User Notifications
```
/user/{username}/queue/notifications
```

**Message Format:**
```json
{
  "id": 1,
  "title": "Booking Accepted",
  "message": "Your booking request has been accepted",
  "type": "BOOKING_ACCEPTED",
  "createdAt": "2023-12-01T09:30:00",
  "isRead": false
}
```

#### Booking Updates
```
/user/{username}/queue/booking-updates
```

**Message Format:**
```json
{
  "bookingId": "1",
  "status": "ACCEPTED",
  "message": "Your booking has been accepted!",
  "timestamp": 1701423000000
}
```

#### System Messages
```
/topic/system
```

**Message Format:**
```json
{
  "message": "System maintenance scheduled for tonight",
  "timestamp": 1701423000000
}
```

## ❌ Error Handling

### Error Response Format
```json
{
  "timestamp": "2023-12-01T09:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/customer/bookings"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Server error |

### Common Error Scenarios

#### Authentication Errors
```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "JWT token is expired",
  "path": "/api/customer/bookings"
}
```

#### Validation Errors
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "errors": [
    {
      "field": "problemDescription",
      "message": "Problem description is required"
    }
  ]
}
```

#### Resource Not Found
```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Mechanic not found with id: 999"
}
```

## 🚦 Rate Limiting

### Default Limits
- **Authentication endpoints**: 5 requests per minute
- **General API endpoints**: 100 requests per minute
- **WebSocket connections**: 10 connections per user

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1701423600
```

### Rate Limit Exceeded Response
```json
{
  "status": 429,
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Try again later."
}
```

## 📊 API Testing

### Using cURL

#### Login
```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"username":"customer1","password":"password"}'
```

#### Get Mechanics
```bash
curl -X GET http://localhost:8080/api/customer/mechanics \
  -H "Authorization: Bearer <your_jwt_token>"
```

#### Create Booking
```bash
curl -X POST http://localhost:8080/api/customer/bookings \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "mechanicId": 1,
    "problemDescription": "Engine trouble",
    "serviceLocation": "123 Main St"
  }'
```

### Using Postman

1. Import the API collection
2. Set environment variables:
   - `baseUrl`: http://localhost:8080/api
   - `token`: Your JWT token
3. Run the collection tests

---

**For more information, visit our [GitHub Repository](https://github.com/yourusername/mechanic-on-demand)**