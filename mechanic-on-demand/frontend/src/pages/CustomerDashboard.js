import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Tab, Card, Button, Form, Badge, Modal, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { customerAPI } from '../services/api';

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [mechanics, setMechanics] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    city: '',
    pincode: '',
    skill: ''
  });
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    problemDescription: '',
    vehicleType: '',
    vehicleModel: '',
    serviceLocation: '',
    preferredDateTime: ''
  });

  useEffect(() => {
    if (activeTab === 'search') {
      fetchMechanics();
    } else if (activeTab === 'bookings') {
      fetchBookings();
    }
  }, [activeTab]);

  const fetchMechanics = async () => {
    setLoading(true);
    try {
      let response;
      if (searchFilters.city) {
        response = await customerAPI.getMechanicsByCity(searchFilters.city);
      } else if (searchFilters.pincode) {
        response = await customerAPI.getMechanicsByPincode(searchFilters.pincode);
      } else if (searchFilters.skill) {
        response = await customerAPI.searchMechanics(searchFilters.skill);
      } else {
        response = await customerAPI.getMechanics();
      }
      setMechanics(response.data);
    } catch (error) {
      toast.error('Failed to fetch mechanics');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await customerAPI.getMyBookings();
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMechanics();
  };

  const handleBookMechanic = (mechanic) => {
    setSelectedMechanic(mechanic);
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const bookingData = {
        ...bookingForm,
        mechanicId: selectedMechanic.id,
        preferredDateTime: bookingForm.preferredDateTime || null
      };
      
      await customerAPI.createBooking(bookingData);
      toast.success('Booking created successfully!');
      setShowBookingModal(false);
      setBookingForm({
        problemDescription: '',
        vehicleType: '',
        vehicleModel: '',
        serviceLocation: '',
        preferredDateTime: ''
      });
      
      if (activeTab === 'bookings') {
        fetchBookings();
      }
    } catch (error) {
      toast.error('Failed to create booking');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { variant: 'warning', text: 'Pending' },
      ACCEPTED: { variant: 'info', text: 'Accepted' },
      IN_PROGRESS: { variant: 'primary', text: 'In Progress' },
      COMPLETED: { variant: 'success', text: 'Completed' },
      CANCELLED: { variant: 'danger', text: 'Cancelled' },
      REJECTED: { variant: 'secondary', text: 'Rejected' }
    };
    
    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const cancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await customerAPI.cancelBooking(bookingId);
        toast.success('Booking cancelled successfully');
        fetchBookings();
      } catch (error) {
        toast.error('Failed to cancel booking');
      }
    }
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={3}>
          <div className="sidebar">
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link 
                  active={activeTab === 'search'}
                  onClick={() => setActiveTab('search')}
                >
                  🔍 Find Mechanics
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  active={activeTab === 'bookings'}
                  onClick={() => setActiveTab('bookings')}
                >
                  📅 My Bookings
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
        </Col>
        
        <Col md={9}>
          <Tab.Content>
            {activeTab === 'search' && (
              <div>
                <h2 className="mb-4">Find Mechanics</h2>
                
                {/* Search Form */}
                <Card className="mb-4">
                  <Card.Body>
                    <Form onSubmit={handleSearch}>
                      <Row>
                        <Col md={3}>
                          <Form.Group className="mb-3">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                              type="text"
                              value={searchFilters.city}
                              onChange={(e) => setSearchFilters({...searchFilters, city: e.target.value, pincode: '', skill: ''})}
                              placeholder="Enter city"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group className="mb-3">
                            <Form.Label>Pincode</Form.Label>
                            <Form.Control
                              type="text"
                              value={searchFilters.pincode}
                              onChange={(e) => setSearchFilters({...searchFilters, pincode: e.target.value, city: '', skill: ''})}
                              placeholder="Enter pincode"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group className="mb-3">
                            <Form.Label>Skill</Form.Label>
                            <Form.Control
                              type="text"
                              value={searchFilters.skill}
                              onChange={(e) => setSearchFilters({...searchFilters, skill: e.target.value, city: '', pincode: ''})}
                              placeholder="e.g. Engine repair"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group className="mb-3">
                            <Form.Label>&nbsp;</Form.Label>
                            <div>
                              <Button type="submit" variant="primary" className="w-100">
                                Search
                              </Button>
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>

                {/* Mechanics List */}
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" />
                  </div>
                ) : (
                  <Row>
                    {mechanics.map((mechanic) => (
                      <Col md={6} lg={4} key={mechanic.id} className="mb-4">
                        <Card className="mechanic-card h-100">
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h5 className="card-title">{mechanic.user.fullName}</h5>
                              {mechanic.isVerified && (
                                <Badge bg="success">✓ Verified</Badge>
                              )}
                            </div>
                            
                            <p className="text-muted mb-2">
                              📍 {mechanic.user.city}, {mechanic.user.pincode}
                            </p>
                            
                            <p className="mb-2">
                              <strong>Skills:</strong> {mechanic.skills}
                            </p>
                            
                            <p className="mb-2">
                              <strong>Experience:</strong> {mechanic.yearsOfExperience} years
                            </p>
                            
                            <p className="mb-2">
                              <strong>Rate:</strong> ₹{mechanic.hourlyRate}/hour
                            </p>
                            
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="rating-stars">
                                ⭐ {mechanic.rating || 0} ({mechanic.totalReviews || 0} reviews)
                              </div>
                              <Button 
                                variant="primary" 
                                size="sm"
                                onClick={() => handleBookMechanic(mechanic)}
                                disabled={!mechanic.isAvailable}
                              >
                                {mechanic.isAvailable ? 'Book Now' : 'Unavailable'}
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h2 className="mb-4">My Bookings</h2>
                
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" />
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="empty-state">
                    <h4>No bookings yet</h4>
                    <p>Start by finding and booking a mechanic!</p>
                    <Button variant="primary" onClick={() => setActiveTab('search')}>
                      Find Mechanics
                    </Button>
                  </div>
                ) : (
                  <Row>
                    {bookings.map((booking) => (
                      <Col md={6} key={booking.id} className="mb-4">
                        <Card>
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <h5>Booking #{booking.id}</h5>
                              {getStatusBadge(booking.status)}
                            </div>
                            
                            <p><strong>Mechanic:</strong> {booking.mechanic.user.fullName}</p>
                            <p><strong>Problem:</strong> {booking.problemDescription}</p>
                            <p><strong>Vehicle:</strong> {booking.vehicleType} {booking.vehicleModel}</p>
                            <p><strong>Location:</strong> {booking.serviceLocation}</p>
                            <p><strong>Created:</strong> {new Date(booking.createdAt).toLocaleDateString()}</p>
                            
                            {booking.mechanicNotes && (
                              <div className="mt-3">
                                <strong>Mechanic Notes:</strong>
                                <p className="text-muted">{booking.mechanicNotes}</p>
                              </div>
                            )}
                            
                            {booking.status === 'PENDING' && (
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => cancelBooking(booking.id)}
                              >
                                Cancel Booking
                              </Button>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </div>
            )}
          </Tab.Content>
        </Col>
      </Row>

      {/* Booking Modal */}
      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Book Mechanic: {selectedMechanic?.user.fullName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleBookingSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Problem Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={bookingForm.problemDescription}
                onChange={(e) => setBookingForm({...bookingForm, problemDescription: e.target.value})}
                required
                placeholder="Describe the problem with your vehicle"
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Vehicle Type</Form.Label>
                  <Form.Select
                    value={bookingForm.vehicleType}
                    onChange={(e) => setBookingForm({...bookingForm, vehicleType: e.target.value})}
                  >
                    <option value="">Select vehicle type</option>
                    <option value="Car">Car</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Truck">Truck</option>
                    <option value="Bus">Bus</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Vehicle Model</Form.Label>
                  <Form.Control
                    type="text"
                    value={bookingForm.vehicleModel}
                    onChange={(e) => setBookingForm({...bookingForm, vehicleModel: e.target.value})}
                    placeholder="e.g. Honda City, Royal Enfield"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Service Location *</Form.Label>
              <Form.Control
                type="text"
                value={bookingForm.serviceLocation}
                onChange={(e) => setBookingForm({...bookingForm, serviceLocation: e.target.value})}
                required
                placeholder="Where should the mechanic come?"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Preferred Date & Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={bookingForm.preferredDateTime}
                onChange={(e) => setBookingForm({...bookingForm, preferredDateTime: e.target.value})}
              />
            </Form.Group>
            
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowBookingModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Book Now
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CustomerDashboard;