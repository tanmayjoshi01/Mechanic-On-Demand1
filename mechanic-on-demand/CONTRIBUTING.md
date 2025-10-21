# 🤝 Contributing to Mechanic On Demand

Thank you for your interest in contributing to Mechanic On Demand! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

## 📜 Code of Conduct

### Our Pledge

We are committed to making participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team. All complaints will be reviewed and investigated promptly and fairly.

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Java 17** or higher
- **Node.js 16** or higher
- **MySQL 8.0** or higher
- **Git** for version control
- **IDE** (IntelliJ IDEA, VS Code, or similar)

### Finding Issues to Work On

1. Check the [Issues](https://github.com/yourusername/mechanic-on-demand/issues) page
2. Look for issues labeled with:
   - `good first issue` - Great for newcomers
   - `help wanted` - Community help needed
   - `bug` - Bug fixes needed
   - `enhancement` - New features

### Reporting Issues

When reporting issues, please include:

- **Clear title** and description
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Environment details** (OS, Java version, etc.)
- **Screenshots** if applicable

## 💻 Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/yourusername/mechanic-on-demand.git
cd mechanic-on-demand

# Add upstream remote
git remote add upstream https://github.com/original-owner/mechanic-on-demand.git
```

### 2. Environment Setup

```bash
# Create environment file
cp .env.example .env

# Set up database
mysql -u root -p
CREATE DATABASE mechanic_on_demand_dev;
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies and run
mvn clean install
mvn spring-boot:run
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

### 5. Verify Setup

- Backend: http://localhost:8080/api/actuator/health
- Frontend: http://localhost:3000

## 📝 Contributing Guidelines

### Types of Contributions

We welcome various types of contributions:

- **Bug fixes** - Fix existing issues
- **Features** - Add new functionality
- **Documentation** - Improve or add documentation
- **Tests** - Add or improve test coverage
- **Performance** - Optimize existing code
- **Refactoring** - Improve code structure

### Before You Start

1. **Check existing issues** - Avoid duplicate work
2. **Create an issue** - Discuss your idea first
3. **Get approval** - Wait for maintainer feedback
4. **Assign yourself** - Let others know you're working on it

### Branch Naming Convention

Use descriptive branch names:

```bash
# Feature branches
feature/user-authentication
feature/booking-system
feature/real-time-notifications

# Bug fix branches
bugfix/login-validation
bugfix/booking-status-update

# Hotfix branches
hotfix/security-vulnerability
hotfix/critical-bug-fix

# Documentation branches
docs/api-documentation
docs/deployment-guide
```

## 🔄 Pull Request Process

### 1. Create Feature Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
```

### 2. Make Changes

- Follow coding standards
- Write tests for new features
- Update documentation
- Keep commits atomic and descriptive

### 3. Commit Guidelines

Use conventional commit messages:

```bash
# Format: type(scope): description

# Examples:
feat(auth): add JWT token validation
fix(booking): resolve status update issue
docs(api): update authentication endpoints
test(user): add unit tests for user service
refactor(database): optimize query performance
```

### 4. Push Changes

```bash
# Push to your fork
git push origin feature/your-feature-name
```

### 5. Create Pull Request

- Use descriptive title and description
- Reference related issues
- Include screenshots for UI changes
- Ensure all checks pass

### Pull Request Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Fixes #123

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots
(If applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

## 🎨 Coding Standards

### Java Backend Standards

#### Code Style

```java
// Use meaningful variable names
String customerEmailAddress = "customer@example.com";

// Use proper indentation (4 spaces)
public class BookingService {
    private final BookingRepository bookingRepository;
    
    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }
}

// Use proper exception handling
try {
    Booking booking = bookingService.createBooking(request);
    return ResponseEntity.ok(booking);
} catch (BookingException e) {
    log.error("Failed to create booking: {}", e.getMessage());
    return ResponseEntity.badRequest()
        .body(new ErrorResponse(e.getMessage()));
}
```

#### Naming Conventions

- **Classes**: PascalCase (e.g., `BookingService`)
- **Methods**: camelCase (e.g., `createBooking`)
- **Variables**: camelCase (e.g., `customerEmail`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRY_ATTEMPTS`)

#### Documentation

```java
/**
 * Creates a new booking for a customer.
 *
 * @param customerId the ID of the customer making the booking
 * @param request the booking request details
 * @return the created booking
 * @throws BookingException if booking creation fails
 */
public Booking createBooking(Long customerId, BookingRequest request) {
    // Implementation
}
```

### React Frontend Standards

#### Component Structure

```jsx
// Use functional components with hooks
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const BookingForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    problemDescription: '',
    vehicleType: '',
    serviceLocation: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      toast.success('Booking created successfully!');
    } catch (error) {
      toast.error('Failed to create booking');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form content */}
    </form>
  );
};

export default BookingForm;
```

#### Naming Conventions

- **Components**: PascalCase (e.g., `BookingForm`)
- **Files**: PascalCase for components (e.g., `BookingForm.js`)
- **Variables**: camelCase (e.g., `formData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

### Database Standards

#### Table Naming

```sql
-- Use snake_case for table names
CREATE TABLE booking_requests (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,
    mechanic_id BIGINT NOT NULL,
    problem_description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Index Naming

```sql
-- Use descriptive index names
CREATE INDEX idx_booking_customer_id ON bookings(customer_id);
CREATE INDEX idx_booking_status_created ON bookings(status, created_at);
```

## 🧪 Testing Guidelines

### Backend Testing

#### Unit Tests

```java
@ExtendWith(MockitoExtension.class)
class BookingServiceTest {
    
    @Mock
    private BookingRepository bookingRepository;
    
    @InjectMocks
    private BookingService bookingService;
    
    @Test
    void shouldCreateBookingSuccessfully() {
        // Given
        BookingRequest request = new BookingRequest();
        request.setProblemDescription("Engine trouble");
        
        // When
        Booking result = bookingService.createBooking(1L, request);
        
        // Then
        assertThat(result).isNotNull();
        assertThat(result.getProblemDescription()).isEqualTo("Engine trouble");
    }
}
```

#### Integration Tests

```java
@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
class BookingControllerIntegrationTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void shouldCreateBookingViaAPI() {
        // Test implementation
    }
}
```

### Frontend Testing

#### Component Tests

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import BookingForm from './BookingForm';

test('should submit form with valid data', async () => {
  const mockOnSubmit = jest.fn();
  
  render(<BookingForm onSubmit={mockOnSubmit} />);
  
  fireEvent.change(screen.getByLabelText(/problem description/i), {
    target: { value: 'Engine trouble' }
  });
  
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(mockOnSubmit).toHaveBeenCalledWith({
    problemDescription: 'Engine trouble'
  });
});
```

### Test Coverage

Maintain minimum test coverage:
- **Backend**: 80% line coverage
- **Frontend**: 70% line coverage
- **Critical paths**: 95% coverage

## 📚 Documentation

### Code Documentation

- **JavaDoc** for all public methods
- **JSDoc** for complex JavaScript functions
- **README** updates for new features
- **API documentation** for new endpoints

### Documentation Standards

```java
/**
 * Service class for managing booking operations.
 * 
 * This service handles the creation, updating, and retrieval of bookings
 * between customers and mechanics. It also manages real-time notifications
 * for booking status changes.
 * 
 * @author Your Name
 * @since 1.0.0
 */
@Service
public class BookingService {
    // Implementation
}
```

### Updating Documentation

When making changes, update:

- **README.md** - For new features or setup changes
- **API_DOCUMENTATION.md** - For new endpoints
- **DEPLOYMENT_GUIDE.md** - For deployment changes
- **Code comments** - For complex logic

## 🏆 Recognition

Contributors will be recognized in:

- **CONTRIBUTORS.md** file
- **Release notes** for significant contributions
- **GitHub contributors** section
- **Project documentation**

## 📞 Getting Help

If you need help:

1. **Check documentation** - README, API docs, deployment guide
2. **Search issues** - Existing solutions might be available
3. **Ask questions** - Create a discussion or issue
4. **Join community** - Discord/Slack channels (if available)

## 📝 License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

**Thank you for contributing to Mechanic On Demand! 🚀**