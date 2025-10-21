# 🔧 Mechanic On Demand

A comprehensive full-stack web application that connects customers with nearby mechanics on demand. Built with Java Spring Boot backend and React.js frontend, following Mumbai University Full Stack Java syllabus requirements.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 👤 Customer Module
- **User Registration & Authentication** - Secure signup/login with JWT
- **Find Mechanics** - Search by city, pincode, or skills
- **Book Services** - Create detailed service requests
- **Real-time Updates** - Get instant notifications when mechanics respond
- **Booking Management** - Track booking status and history
- **Location-based Search** - Find nearby mechanics

### 👨‍🔧 Mechanic Module
- **Profile Management** - Create and update professional profiles
- **Booking Requests** - Receive and manage service requests
- **Status Updates** - Accept, reject, or complete bookings
- **Availability Toggle** - Control when to receive new requests
- **Service History** - Track completed jobs and earnings
- **Real-time Notifications** - Instant alerts for new bookings

### 👑 Admin Module
- **Dashboard Analytics** - System-wide statistics and insights
- **User Management** - View, activate, or deactivate users
- **Mechanic Verification** - Approve and verify mechanic profiles
- **Booking Oversight** - Monitor all platform bookings
- **System Administration** - Manage platform operations

### 🔔 Real-time Features
- **WebSocket Integration** - Live notifications and updates
- **Browser Notifications** - Desktop alerts for important events
- **Status Synchronization** - Real-time booking status updates
- **Chat System** - Communication between customers and mechanics

## 🛠️ Technology Stack

### Frontend
- **React.js 18** - Modern UI library
- **React Router** - Client-side routing
- **React Bootstrap** - Responsive UI components
- **Axios** - HTTP client for API calls
- **SockJS & STOMP** - WebSocket communication
- **React Toastify** - Notification system

### Backend
- **Java 17** - Programming language
- **Spring Boot 3.1** - Application framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database abstraction
- **Spring WebSocket** - Real-time communication
- **JWT** - Token-based authentication
- **Hibernate** - ORM framework
- **Maven** - Dependency management

### Database
- **MySQL 8.0** - Relational database
- **JPA/Hibernate** - Database mapping
- **Connection Pooling** - Optimized database connections

### Deployment
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and static file serving

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React.js      │    │   Spring Boot   │    │     MySQL       │
│   Frontend      │◄──►│    Backend      │◄──►│    Database     │
│                 │    │                 │    │                 │
│ - Components    │    │ - REST APIs     │    │ - User Data     │
│ - Services      │    │ - WebSocket     │    │ - Bookings      │
│ - State Mgmt    │    │ - Security      │    │ - Notifications │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Design Patterns
- **MVC Architecture** - Separation of concerns
- **Repository Pattern** - Data access abstraction
- **DTO Pattern** - Data transfer objects
- **Observer Pattern** - Real-time notifications
- **Singleton Pattern** - WebSocket service management

## 🚀 Getting Started

### Prerequisites
- **Java 17** or higher
- **Node.js 16** or higher
- **MySQL 8.0** or higher
- **Docker & Docker Compose** (for containerized deployment)
- **Maven 3.6** or higher

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mechanic-on-demand.git
   cd mechanic-on-demand
   ```

2. **Database Setup**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE mechanic_on_demand;
   ```

3. **Backend Setup**
   ```bash
   cd backend
   
   # Update application.yml with your database credentials
   # Run the application
   mvn spring-boot:run
   ```

4. **Frontend Setup**
   ```bash
   cd frontend
   
   # Install dependencies
   npm install
   
   # Start development server
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api
   - Database: localhost:3306

### Docker Deployment

1. **Quick Start with Docker Compose**
   ```bash
   # Make deploy script executable
   chmod +x deploy.sh
   
   # Run deployment
   ./deploy.sh
   ```

2. **Manual Docker Commands**
   ```bash
   # Build and start all services
   docker-compose up --build -d
   
   # View logs
   docker-compose logs -f
   
   # Stop services
   docker-compose down
   ```

3. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:8080/api
   - Database: localhost:3306

## 📚 API Documentation

### Authentication Endpoints
```http
POST /api/auth/signin
POST /api/auth/signup
```

### Customer Endpoints
```http
GET    /api/customer/mechanics
GET    /api/customer/mechanics/city/{city}
GET    /api/customer/mechanics/pincode/{pincode}
GET    /api/customer/mechanics/search?skill={skill}
POST   /api/customer/bookings
GET    /api/customer/bookings
PUT    /api/customer/bookings/{id}/cancel
```

### Mechanic Endpoints
```http
GET    /api/mechanic/profile
POST   /api/mechanic/profile
PUT    /api/mechanic/profile
GET    /api/mechanic/bookings
PUT    /api/mechanic/bookings/{id}/accept
PUT    /api/mechanic/bookings/{id}/reject
PUT    /api/mechanic/bookings/{id}/complete
PUT    /api/mechanic/availability
```

### Admin Endpoints
```http
GET    /api/admin/users
GET    /api/admin/mechanics
GET    /api/admin/bookings
GET    /api/admin/dashboard/stats
PUT    /api/admin/mechanics/{id}/verify
DELETE /api/admin/users/{id}
```

### Notification Endpoints
```http
GET    /api/notifications
GET    /api/notifications/unread
PUT    /api/notifications/{id}/read
PUT    /api/notifications/read-all
```

## 🗄️ Database Schema

### Core Tables
- **users** - User authentication and profile data
- **mechanics** - Mechanic-specific profile information
- **bookings** - Service booking requests and status
- **notifications** - System notifications
- **reviews** - Customer feedback and ratings

### Relationships
- User (1) → Mechanic (1) - One-to-one relationship
- User (1) → Bookings (N) - One-to-many for customers
- Mechanic (1) → Bookings (N) - One-to-many for mechanics
- User (1) → Notifications (N) - One-to-many relationship
- Booking (1) → Review (1) - One-to-one relationship

## 🔐 Security Features

- **JWT Authentication** - Stateless token-based auth
- **Role-based Access Control** - Customer, Mechanic, Admin roles
- **Password Encryption** - BCrypt hashing
- **CORS Configuration** - Cross-origin request handling
- **Input Validation** - Server-side data validation
- **SQL Injection Prevention** - Parameterized queries

## 📱 Responsive Design

- **Mobile-first Approach** - Optimized for all screen sizes
- **Bootstrap Integration** - Consistent UI components
- **Progressive Web App** - App-like experience
- **Touch-friendly Interface** - Mobile gesture support

## 🔄 Real-time Features

### WebSocket Implementation
- **Connection Management** - Automatic reconnection
- **User-specific Channels** - Targeted notifications
- **Message Broadcasting** - System-wide announcements
- **Status Synchronization** - Live booking updates

### Notification System
- **Browser Notifications** - Desktop alerts
- **Toast Messages** - In-app notifications
- **Email Integration** - Ready for email notifications
- **Push Notifications** - Mobile app ready

## 🧪 Testing

### Backend Testing
```bash
cd backend
mvn test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### Integration Testing
```bash
# Run all services
docker-compose up -d

# Run integration tests
npm run test:integration
```

## 📊 Performance Optimization

- **Database Indexing** - Optimized query performance
- **Connection Pooling** - Efficient database connections
- **Lazy Loading** - On-demand data fetching
- **Caching Strategy** - Redis integration ready
- **Image Optimization** - Compressed assets
- **Code Splitting** - Reduced bundle sizes

## 🚀 Deployment Options

### Cloud Platforms
- **AWS** - EC2, RDS, S3 integration
- **Heroku** - Easy deployment with buildpacks
- **Google Cloud** - Cloud Run, Cloud SQL
- **Azure** - App Service, Azure Database

### Container Orchestration
- **Kubernetes** - Production-grade orchestration
- **Docker Swarm** - Simple container clustering
- **OpenShift** - Enterprise container platform

## 🔧 Configuration

### Environment Variables
```bash
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=mechanic_on_demand
DB_USERNAME=root
DB_PASSWORD=password

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=86400000

# WebSocket
WS_ENDPOINT=/ws
```

### Application Properties
```yaml
# Custom application settings
app:
  name: Mechanic On Demand
  version: 1.0.0
  contact:
    email: support@mechanicondemand.com
    phone: +91-9999999999
```

## 📈 Monitoring & Logging

- **Spring Boot Actuator** - Health checks and metrics
- **Structured Logging** - JSON formatted logs
- **Error Tracking** - Comprehensive error handling
- **Performance Metrics** - Response time monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow Java coding conventions
- Write unit tests for new features
- Update documentation for API changes
- Use meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Backend Development** - Spring Boot, MySQL, WebSocket
- **Frontend Development** - React.js, Bootstrap, WebSocket Client
- **DevOps** - Docker, CI/CD, Cloud Deployment
- **UI/UX Design** - Responsive Design, User Experience

## 📞 Support

For support and queries:
- **Email**: support@mechanicondemand.com
- **Documentation**: [Wiki](https://github.com/yourusername/mechanic-on-demand/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/mechanic-on-demand/issues)

## 🎯 Future Enhancements

- [ ] **Mobile App** - React Native implementation
- [ ] **Payment Integration** - Stripe/PayPal integration
- [ ] **Google Maps** - Location services and routing
- [ ] **Chat System** - Real-time messaging
- [ ] **Rating System** - Enhanced review mechanism
- [ ] **Analytics Dashboard** - Advanced reporting
- [ ] **Multi-language Support** - Internationalization
- [ ] **AI Recommendations** - Smart mechanic matching

---

**Built with ❤️ for Mumbai University Full Stack Java Development Course**