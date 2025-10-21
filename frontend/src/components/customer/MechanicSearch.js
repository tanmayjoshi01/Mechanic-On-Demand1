import React, { useState } from 'react';
import { Card, Row, Col, Form, Button, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const MechanicSearch = ({ mechanics, onSearch, loading }) => {
  const [searchForm, setSearchForm] = useState({
    city: '',
    pincode: '',
    skill: ''
  });

  const handleChange = (e) => {
    setSearchForm({
      ...searchForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchForm);
  };

  const getStatusBadge = (mechanic) => {
    if (!mechanic.isAvailable) {
      return <Badge bg="secondary">Unavailable</Badge>;
    }
    if (!mechanic.isVerified) {
      return <Badge bg="warning">Pending Verification</Badge>;
    }
    return <Badge bg="success">Available</Badge>;
  };

  return (
    <div>
      <Card className="mb-4">
        <Card.Header>
          <h4 className="mb-0">Find Mechanics</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={searchForm.city}
                    onChange={handleChange}
                    placeholder="Enter city name"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Pincode</Form.Label>
                  <Form.Control
                    type="text"
                    name="pincode"
                    value={searchForm.pincode}
                    onChange={handleChange}
                    placeholder="Enter pincode"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Skill</Form.Label>
                  <Form.Control
                    type="text"
                    name="skill"
                    value={searchForm.skill}
                    onChange={handleChange}
                    placeholder="e.g., Engine Repair"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Searching...' : 'Search Mechanics'}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {mechanics.length === 0 && !loading ? (
        <Alert variant="info">
          No mechanics found. Try different search criteria.
        </Alert>
      ) : (
        <Row>
          {mechanics.map((mechanic) => (
            <Col md={6} lg={4} key={mechanic.id} className="mb-4">
              <Card className="mechanic-card h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">
                      {mechanic.user.firstName} {mechanic.user.lastName}
                    </h5>
                    {getStatusBadge(mechanic)}
                  </div>
                  
                  <p className="text-muted mb-2">
                    <strong>Skills:</strong> {mechanic.skills}
                  </p>
                  
                  <p className="text-muted mb-2">
                    <strong>Location:</strong> {mechanic.city}, {mechanic.pincode}
                  </p>
                  
                  <p className="text-muted mb-2">
                    <strong>Rate:</strong> ₹{mechanic.hourlyRate}/hour
                  </p>
                  
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <small className="text-muted">
                      Rating: {mechanic.rating.toFixed(1)} ⭐
                    </small>
                    <small className="text-muted">
                      Jobs: {mechanic.totalJobs}
                    </small>
                  </div>
                  
                  <div className="d-grid">
                    <Button
                      as={Link}
                      to={`/customer/book/${mechanic.id}`}
                      variant="primary"
                      disabled={!mechanic.isAvailable || !mechanic.isVerified}
                    >
                      Book Now
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default MechanicSearch;