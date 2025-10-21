import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { isAuthenticated, getUserRole } from '../utils/auth';

const Home = () => {
  const userRole = getUserRole();

  const getDashboardPath = () => {
    switch (userRole) {
      case 'CUSTOMER':
        return '/customer';
      case 'MECHANIC':
        return '/mechanic';
      case 'ADMIN':
        return '/admin';
      default:
        return '/login';
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto">
              <h1>Find Mechanics On Demand</h1>
              <p className="lead">
                Connect with skilled mechanics in your area instantly. 
                Get your vehicle serviced quickly and efficiently.
              </p>
              {!isAuthenticated() ? (
                <div>
                  <LinkContainer to="/register">
                    <Button variant="light" size="lg" className="me-3">
                      Get Started
                    </Button>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <Button variant="outline-light" size="lg">
                      Login
                    </Button>
                  </LinkContainer>
                </div>
              ) : (
                <LinkContainer to={getDashboardPath()}>
                  <Button variant="light" size="lg">
                    Go to Dashboard
                  </Button>
                </LinkContainer>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2>How It Works</h2>
              <p className="lead text-muted">
                Simple steps to get your vehicle serviced
              </p>
            </Col>
          </Row>
          
          <Row>
            <Col md={4} className="mb-4">
              <Card className="feature-card h-100">
                <Card.Body className="text-center">
                  <div className="mb-3">
                    <span style={{ fontSize: '3rem' }}>🔍</span>
                  </div>
                  <Card.Title>Find Mechanics</Card.Title>
                  <Card.Text>
                    Search for qualified mechanics in your city or pincode. 
                    Filter by skills and ratings to find the perfect match.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4} className="mb-4">
              <Card className="feature-card h-100">
                <Card.Body className="text-center">
                  <div className="mb-3">
                    <span style={{ fontSize: '3rem' }}>📅</span>
                  </div>
                  <Card.Title>Book Service</Card.Title>
                  <Card.Text>
                    Book a mechanic with detailed problem description. 
                    Set your preferred time and service location.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4} className="mb-4">
              <Card className="feature-card h-100">
                <Card.Body className="text-center">
                  <div className="mb-3">
                    <span style={{ fontSize: '3rem' }}>⚡</span>
                  </div>
                  <Card.Title>Get Service</Card.Title>
                  <Card.Text>
                    Get real-time updates when mechanics accept your request. 
                    Track service progress until completion.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* For Mechanics Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h2>Are you a Mechanic?</h2>
              <p className="lead">
                Join our platform and connect with customers who need your expertise. 
                Manage your bookings, set your availability, and grow your business.
              </p>
              <ul className="list-unstyled">
                <li className="mb-2">✅ Manage service requests efficiently</li>
                <li className="mb-2">✅ Set your own hourly rates</li>
                <li className="mb-2">✅ Build your reputation with reviews</li>
                <li className="mb-2">✅ Real-time booking notifications</li>
              </ul>
              {!isAuthenticated() && (
                <LinkContainer to="/register">
                  <Button variant="primary" size="lg">
                    Join as Mechanic
                  </Button>
                </LinkContainer>
              )}
            </Col>
            <Col lg={6}>
              <div className="text-center">
                <span style={{ fontSize: '10rem' }}>🔧</span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-5">
        <Container>
          <Row className="text-center">
            <Col md={3} className="mb-4">
              <h3 className="display-4 text-primary">500+</h3>
              <p className="lead">Verified Mechanics</p>
            </Col>
            <Col md={3} className="mb-4">
              <h3 className="display-4 text-primary">1000+</h3>
              <p className="lead">Happy Customers</p>
            </Col>
            <Col md={3} className="mb-4">
              <h3 className="display-4 text-primary">50+</h3>
              <p className="lead">Cities Covered</p>
            </Col>
            <Col md={3} className="mb-4">
              <h3 className="display-4 text-primary">24/7</h3>
              <p className="lead">Service Available</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-light py-4">
        <Container>
          <Row>
            <Col md={6}>
              <h5>Mechanic On Demand</h5>
              <p>Connecting customers with skilled mechanics instantly.</p>
            </Col>
            <Col md={6} className="text-md-end">
              <p>&copy; 2023 Mechanic On Demand. All rights reserved.</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default Home;