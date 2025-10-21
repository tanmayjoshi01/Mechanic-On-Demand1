# 🔧 Mechanic On Demand

A full-stack Java application that connects customers with nearby mechanics on demand. Built with Spring Boot backend and React frontend, following Mumbai University Full Stack Java syllabus requirements.

## 🌟 Features

### 👤 Customer Features
- **User Registration & Authentication** - Secure JWT-based authentication
- **Mechanic Search** - Find mechanics by city, pincode, or skills
- **Booking System** - Book mechanics with preferred date/time
- **Real-time Updates** - Receive instant notifications on booking status
- **Booking History** - View all past and current bookings
- **Responsive UI** - Modern, mobile-friendly interface

### 👨‍🔧 Mechanic Features
- **Profile Management** - Create and update mechanic profiles
- **Skill Management** - Add specializations and hourly rates
- **Booking Management** - Accept/reject booking requests
- **Status Updates** - Mark bookings as completed
- **Availability Toggle** - Set availability status
- **Earnings Tracking** - View completed jobs and earnings

### 👑 Admin Features
- **User Management** - View and manage all users
- **Mechanic Verification** - Approve mechanic registrations
- **Analytics Dashboard** - System statistics and insights
- **Booking Oversight** - Monitor all bookings across the platform

## 🛠️ Technology Stack

### Backend
- **Java 17** - Programming language
- **Spring Boot 3.2.0** - Main framework
- **Spring Security** - Authentication & authorization
- **JWT** - Token-based authentication
- **Spring Data JPA** - Data persistence
- **MySQL 8.0** - Database
- **WebSocket** - Real-time notifications
- **Maven** - Dependency management

### Frontend
- **React 18** - UI framework
- **React Router** - Client-side routing
- **Bootstrap 5** - CSS framework
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **SockJS & STOMP** - WebSocket client

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy for frontend

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher
- Docker (optional)

### Local Development

#### 1. Database Setup
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE mechanic_ondemand;
```

#### 2. Backend Setup
```bash
# Navigate to project root
cd /workspace

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will be available at `http://localhost:8080`

#### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will be available at `http://localhost:3000`

### Docker Deployment

#### 1. Build and Run with Docker Compose
```bash
# From project root
docker-compose up --build
```

This will start:
- MySQL database on port 3306
- Spring Boot backend on port 8080
- React frontend on port 3000

#### 2. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Database: localhost:3306

## 📱 Application Flow

### Customer Journey
1. **Register/Login** - Create account or sign in
2. **Search Mechanics** - Find mechanics by location or skills
3. **Book Service** - Select mechanic and schedule service
4. **Track Status** - Receive real-time updates on booking status
5. **Rate & Review** - Provide feedback after service completion

### Mechanic Journey
1. **Register/Login** - Create mechanic account
2. **Create Profile** - Add skills, location, and hourly rate
3. **Receive Bookings** - Get notified of new booking requests
4. **Manage Bookings** - Accept/reject and update booking status
5. **Track Earnings** - Monitor completed jobs and income

### Admin Journey
1. **Login** - Access admin panel
2. **Verify Mechanics** - Approve new mechanic registrations
3. **Monitor System** - View analytics and system statistics
4. **Manage Users** - Oversee user accounts and activities

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Role-based Access Control** - Different access levels for customers, mechanics, and admins
- **Password Encryption** - BCrypt password hashing
- **CORS Configuration** - Secure cross-origin requests
- **Input Validation** - Server-side validation for all inputs

## 📊 Database Schema

### Core Entities
- **Users** - Customer, mechanic, and admin accounts
- **Mechanics** - Extended profile information for mechanics
- **Bookings** - Service requests and their status
- **Notifications** - Real-time updates and alerts
- **Reviews** - Customer feedback and ratings

### Key Relationships
- One-to-Many: User → Bookings (as customer)
- One-to-Many: Mechanic → Bookings (as service provider)
- One-to-Many: User → Notifications
- One-to-Many: Booking → Reviews

## 🧪 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Customer APIs
- `GET /api/customer/mechanics/search/city/{city}` - Search by city
- `GET /api/customer/mechanics/search/pincode/{pincode}` - Search by pincode
- `GET /api/customer/mechanics/search/skill/{skill}` - Search by skill
- `POST /api/customer/book` - Create booking
- `GET /api/customer/bookings` - Get customer bookings

### Mechanic APIs
- `POST /api/mechanic/profile` - Create mechanic profile
- `PUT /api/mechanic/profile` - Update mechanic profile
- `GET /api/mechanic/profile` - Get mechanic profile
- `PUT /api/mechanic/availability` - Toggle availability
- `GET /api/mechanic/bookings` - Get mechanic bookings
- `PUT /api/mechanic/bookings/{id}/accept` - Accept booking
- `PUT /api/mechanic/bookings/{id}/reject` - Reject booking
- `PUT /api/mechanic/bookings/{id}/complete` - Complete booking

### Admin APIs
- `GET /api/admin/users` - Get all users
- `GET /api/admin/mechanics` - Get all mechanics
- `GET /api/admin/bookings` - Get all bookings
- `PUT /api/admin/mechanics/{id}/verify` - Verify mechanic
- `GET /api/admin/statistics` - Get system statistics

### Notification APIs
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread` - Get unread notifications
- `PUT /api/notifications/{id}/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

## 🔧 Configuration

### Backend Configuration (`application.yml`)
```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mechanic_ondemand
    username: root
    password: password
  
  jpa:
    hibernate:
      ddl-auto: update

jwt:
  secret: mySecretKey123456789012345678901234567890
  expiration: 86400000
```

### Frontend Configuration
- API Base URL: `http://localhost:8080`
- WebSocket URL: `ws://localhost:8080/ws`

## 🚀 Deployment

### Production Deployment
1. **Database Setup** - Configure production MySQL database
2. **Environment Variables** - Set production JWT secrets and database credentials
3. **Build Applications** - Create production builds
4. **Docker Deployment** - Use Docker Compose for production
5. **Reverse Proxy** - Configure Nginx for production

### Environment Variables
```bash
# Database
SPRING_DATASOURCE_URL=jdbc:mysql://your-db-host:3306/mechanic_ondemand
SPRING_DATASOURCE_USERNAME=your-username
SPRING_DATASOURCE_PASSWORD=your-password

# JWT
JWT_SECRET=your-production-secret-key
JWT_EXPIRATION=86400000

# Email (optional)
SPRING_MAIL_HOST=smtp.gmail.com
SPRING_MAIL_USERNAME=your-email@gmail.com
SPRING_MAIL_PASSWORD=your-app-password
```

## 🧪 Testing

### Backend Testing
```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=AuthServiceTest
```

### Frontend Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📈 Future Enhancements

- **Google Maps Integration** - Visual location selection
- **Payment Gateway** - Online payment processing
- **SMS Notifications** - Text message alerts
- **Advanced Analytics** - Detailed reporting and insights
- **Mobile App** - React Native mobile application
- **Chat System** - Real-time communication between customers and mechanics
- **Service Categories** - Organized service types and pricing
- **Scheduling System** - Advanced calendar integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Backend Development** - Spring Boot, JPA, Security
- **Frontend Development** - React, Bootstrap, WebSocket
- **Database Design** - MySQL, Entity Relationships
- **DevOps** - Docker, Docker Compose, Nginx

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for Mumbai University Full Stack Java Course**