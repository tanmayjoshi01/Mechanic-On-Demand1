import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-4">
                Find Mechanics Near You
              </h1>
              <p className="lead mb-4">
                Connect with skilled mechanics instantly. Book services, get real-time updates, 
                and enjoy professional automotive care at your doorstep.
              </p>
              <div className="d-flex gap-3">
                {!user ? (
                  <>
                    <Button as={Link} to="/register" variant="light" size="lg">
                      Get Started
                    </Button>
                    <Button as={Link} to="/login" variant="outline-light" size="lg">
                      Login
                    </Button>
                  </>
                ) : (
                  <Button as={Link} to={user.role === 'CUSTOMER' ? '/customer' : '/mechanic'} variant="light" size="lg">
                    Go to Dashboard
                  </Button>
                )}
              </div>
            </Col>
            <Col lg={6}>
              <div className="text-center">
                <div style={{ fontSize: '200px' }}>🔧</div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="my-5">
        <Row className="text-center mb-5">
          <Col>
            <h2 className="display-5 fw-bold">Why Choose Us?</h2>
            <p className="lead text-muted">
              Professional mechanics at your service, anytime, anywhere
            </p>
          </Col>
        </Row>
        
        <Row>
          <Col md={4} className="mb-4">
            <Card className="feature-card h-100 text-center p-4">
              <Card.Body>
                <div className="mb-3" style={{ fontSize: '3rem' }}>⚡</div>
                <Card.Title>Quick Service</Card.Title>
                <Card.Text>
                  Find and book mechanics in minutes. Get instant responses and real-time updates.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-4">
            <Card className="feature-card h-100 text-center p-4">
              <Card.Body>
                <div className="mb-3" style={{ fontSize: '3rem' }}>🏆</div>
                <Card.Title>Verified Mechanics</Card.Title>
                <Card.Text>
                  All mechanics are verified professionals with ratings and reviews from customers.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-4">
            <Card className="feature-card h-100 text-center p-4">
              <Card.Body>
                <div className="mb-3" style={{ fontSize: '3rem' }}>💰</div>
                <Card.Title>Transparent Pricing</Card.Title>
                <Card.Text>
                  Clear, upfront pricing with no hidden fees. Pay only for the services you need.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* How It Works Section */}
      <div className="bg-light py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold">How It Works</h2>
              <p className="lead text-muted">
                Simple steps to get your vehicle serviced
              </p>
            </Col>
          </Row>
          
          <Row>
            <Col md={3} className="text-center mb-4">
              <div className="mb-3">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                     style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                  1
                </div>
              </div>
              <h5>Search & Select</h5>
              <p className="text-muted">Find mechanics by location or skills</p>
            </Col>
            
            <Col md={3} className="text-center mb-4">
              <div className="mb-3">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                     style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                  2
                </div>
              </div>
              <h5>Book Service</h5>
              <p className="text-muted">Schedule your preferred time and date</p>
            </Col>
            
            <Col md={3} className="text-center mb-4">
              <div className="mb-3">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                     style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                  3
                </div>
              </div>
              <h5>Get Service</h5>
              <p className="text-muted">Mechanic arrives and completes the job</p>
            </Col>
            
            <Col md={3} className="text-center mb-4">
              <div className="mb-3">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                     style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                  4
                </div>
              </div>
              <h5>Rate & Review</h5>
              <p className="text-muted">Share your experience and help others</p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* CTA Section */}
      <div className="py-5">
        <Container>
          <Row className="text-center">
            <Col>
              <h2 className="display-5 fw-bold mb-4">Ready to Get Started?</h2>
              <p className="lead text-muted mb-4">
                Join thousands of satisfied customers and professional mechanics
              </p>
              {!user && (
                <Button as={Link} to="/register" variant="primary" size="lg">
                  Sign Up Now
                </Button>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Home;