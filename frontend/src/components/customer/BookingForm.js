import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const BookingForm = ({ onCreateBooking }) => {
  const { mechanicId } = useParams();
  const navigate = useNavigate();
  
  const [mechanic, setMechanic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    serviceDescription: '',
    address: '',
    city: '',
    pincode: '',
    preferredDate: '',
    estimatedDuration: 1,
    notes: ''
  });

  useEffect(() => {
    fetchMechanic();
  }, [mechanicId]);

  const fetchMechanic = async () => {
    try {
      // Since we don't have a direct mechanic endpoint, we'll search and find the mechanic
      const response = await axios.get('/api/customer/mechanics/search/city/');
      const foundMechanic = response.data.find(m => m.id === parseInt(mechanicId));
      if (foundMechanic) {
        setMechanic(foundMechanic);
        setFormData(prev => ({
          ...prev,
          city: foundMechanic.city,
          pincode: foundMechanic.pincode
        }));
      }
    } catch (error) {
      toast.error('Failed to fetch mechanic details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const bookingData = {
        ...formData,
        mechanicId: parseInt(mechanicId),
        preferredDate: new Date(formData.preferredDate).toISOString(),
        estimatedDuration: parseInt(formData.estimatedDuration)
      };

      await onCreateBooking(bookingData);
    } catch (error) {
      toast.error('Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!mechanic) {
    return <Alert variant="danger">Mechanic not found</Alert>;
  }

  return (
    <Card>
      <Card.Header>
        <h4 className="mb-0">Book Mechanic</h4>
        <p className="text-muted mb-0">
          Booking with {mechanic.user.firstName} {mechanic.user.lastName}
        </p>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Service Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="serviceDescription"
              value={formData.serviceDescription}
              onChange={handleChange}
              required
              placeholder="Describe the service you need..."
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Enter your address"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
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
            <Col md={3}>
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

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Preferred Date & Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Estimated Duration (hours)</Form.Label>
                <Form.Control
                  type="number"
                  name="estimatedDuration"
                  value={formData.estimatedDuration}
                  onChange={handleChange}
                  required
                  min="1"
                  max="8"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Additional Notes (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional information..."
            />
          </Form.Group>

          <div className="bg-light p-3 rounded mb-3">
            <h6>Booking Summary</h6>
            <p className="mb-1">
              <strong>Mechanic:</strong> {mechanic.user.firstName} {mechanic.user.lastName}
            </p>
            <p className="mb-1">
              <strong>Rate:</strong> ₹{mechanic.hourlyRate}/hour
            </p>
            <p className="mb-0">
              <strong>Estimated Cost:</strong> ₹{mechanic.hourlyRate * formData.estimatedDuration}
            </p>
          </div>

          <div className="d-flex gap-2">
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Creating Booking...' : 'Create Booking'}
            </Button>
            <Button variant="secondary" onClick={() => navigate('/customer')}>
              Cancel
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default BookingForm;