import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const MechanicProfile = ({ profile, onCreateProfile, onUpdateProfile }) => {
  const [formData, setFormData] = useState({
    skills: '',
    city: '',
    pincode: '',
    address: '',
    hourlyRate: ''
  });
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        skills: profile.skills || '',
        city: profile.city || '',
        pincode: profile.pincode || '',
        address: profile.address || '',
        hourlyRate: profile.hourlyRate || ''
      });
      setAvailability(profile.isAvailable);
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (profile) {
        await onUpdateProfile(formData);
      } else {
        await onCreateProfile(formData);
      }
    } catch (error) {
      toast.error('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async () => {
    try {
      const response = await axios.put('/api/mechanic/availability');
      setAvailability(response.data.isAvailable);
      toast.success(`Availability ${response.data.isAvailable ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update availability');
    }
  };

  if (!profile) {
    return (
      <Card>
        <Card.Header>
          <h4 className="mb-0">Create Mechanic Profile</h4>
          <p className="text-muted mb-0">Complete your profile to start receiving bookings</p>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Skills & Specializations</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                required
                placeholder="e.g., Engine Repair, Brake Service, AC Repair, Electrical Work"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="Enter your city"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Pincode</Form.Label>
                  <Form.Control
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    placeholder="Enter your pincode"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Enter your full address"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Hourly Rate (₹)</Form.Label>
              <Form.Control
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                required
                min="100"
                placeholder="Enter your hourly rate"
              />
            </Form.Group>

            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Creating Profile...' : 'Create Profile'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div>
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-0">Mechanic Profile</h4>
            <p className="text-muted mb-0">Manage your profile and availability</p>
          </div>
          <div>
            <Badge bg={profile.isVerified ? 'success' : 'warning'} className="me-2">
              {profile.isVerified ? 'Verified' : 'Pending Verification'}
            </Badge>
            <Badge bg={availability ? 'success' : 'secondary'}>
              {availability ? 'Available' : 'Unavailable'}
            </Badge>
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={8}>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Skills & Specializations</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Pincode</Form.Label>
                      <Form.Control
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Hourly Rate (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    required
                    min="100"
                  />
                </Form.Group>

                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Profile'}
                </Button>
              </Form>
            </Col>
            
            <Col md={4}>
              <Card className="bg-light">
                <Card.Body>
                  <h6>Profile Statistics</h6>
                  <p className="mb-1">
                    <strong>Rating:</strong> {profile.rating.toFixed(1)} ⭐
                  </p>
                  <p className="mb-1">
                    <strong>Total Jobs:</strong> {profile.totalJobs}
                  </p>
                  <p className="mb-1">
                    <strong>Member Since:</strong> {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                  
                  <hr />
                  
                  <div className="d-grid">
                    <Button
                      variant={availability ? 'outline-danger' : 'outline-success'}
                      onClick={toggleAvailability}
                    >
                      {availability ? 'Set Unavailable' : 'Set Available'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default MechanicProfile;