import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Card, Button, Form, Badge, Modal, Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { mechanicAPI } from '../services/api';

const MechanicDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [profileForm, setProfileForm] = useState({
    skills: '',
    description: '',
    hourlyRate: '',
    yearsOfExperience: '',
    certifications: '',
    isAvailable: true
  });
  const [bookingNotes, setBookingNotes] = useState('');

  useEffect(() => {
    if (activeTab === 'profile') {
      fetchProfile();
    } else if (activeTab === 'bookings') {
      fetchBookings();
    }
  }, [activeTab]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await mechanicAPI.getProfile();
      setProfile(response.data);
      setProfileForm({
        skills: response.data.skills || '',
        description: response.data.description || '',
        hourlyRate: response.data.hourlyRate || '',
        yearsOfExperience: response.data.yearsOfExperience || '',
        certifications: response.data.certifications || '',
        isAvailable: response.data.isAvailable !== false
      });
    } catch (error) {
      if (error.response?.status === 404) {
        // No profile exists yet
        setProfile(null);
      } else {
        toast.error('Failed to fetch profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await mechanicAPI.getMyBookings();
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      if (profile) {
        await mechanicAPI.updateProfile(profileForm);
        toast.success('Profile updated successfully!');
      } else {
        await mechanicAPI.createProfile(profileForm);
        toast.success('Profile created successfully!');
      }
      setShowProfileModal(false);
      fetchProfile();
    } catch (error) {
      toast.error('Failed to save profile');
    }
  };

  const handleBookingAction = async (bookingId, action, notes = '') => {
    try {
      switch (action) {
        case 'accept':
          await mechanicAPI.acceptBooking(bookingId, notes);
          toast.success('Booking accepted!');
          break;
        case 'reject':
          await mechanicAPI.rejectBooking(bookingId, notes);
          toast.success('Booking rejected!');
          break;
        case 'complete':
          await mechanicAPI.completeBooking(bookingId, notes);
          toast.success('Booking completed!');
          break;
        default:
          break;
      }
      setShowBookingModal(false);
      setBookingNotes('');
      fetchBookings();
    } catch (error) {
      toast.error(`Failed to ${action} booking`);
    }
  };

  const toggleAvailability = async () => {
    try {
      const newAvailability = !profile.isAvailable;
      await mechanicAPI.updateAvailability(newAvailability);
      toast.success(`You are now ${newAvailability ? 'available' : 'unavailable'}`);
      fetchProfile();
    } catch (error) {
      toast.error('Failed to update availability');
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

  const openBookingModal = (booking) => {
    setSelectedBooking(booking);
    setShowBookingModal(true);
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={3}>
          <div className="sidebar">
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link 
                  active={activeTab === 'profile'}
                  onClick={() => setActiveTab('profile')}
                >
                  👤 My Profile
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  active={activeTab === 'bookings'}
                  onClick={() => setActiveTab('bookings')}
                >
                  📅 Bookings
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
        </Col>
        
        <Col md={9}>
          {activeTab === 'profile' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>My Profile</h2>
                <div>
                  {profile && (
                    <Button 
                      variant={profile.isAvailable ? 'success' : 'secondary'}
                      className="me-2"
                      onClick={toggleAvailability}
                    >
                      {profile.isAvailable ? '✓ Available' : '✗ Unavailable'}
                    </Button>
                  )}
                  <Button 
                    variant="primary"
                    onClick={() => setShowProfileModal(true)}
                  >
                    {profile ? 'Edit Profile' : 'Create Profile'}
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" />
                </div>
              ) : profile ? (
                <Row>
                  <Col md={8}>
                    <Card>
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <h4>{profile.user.fullName}</h4>
                          <div>
                            {profile.isVerified ? (
                              <Badge bg="success">✓ Verified</Badge>
                            ) : (
                              <Badge bg="warning">⏳ Pending Verification</Badge>
                            )}
                          </div>
                        </div>
                        
                        <p><strong>Email:</strong> {profile.user.email}</p>
                        <p><strong>Phone:</strong> {profile.user.phoneNumber}</p>
                        <p><strong>Location:</strong> {profile.user.city}, {profile.user.pincode}</p>
                        
                        <hr />
                        
                        <p><strong>Skills:</strong> {profile.skills}</p>
                        <p><strong>Description:</strong> {profile.description}</p>
                        <p><strong>Hourly Rate:</strong> ₹{profile.hourlyRate}</p>
                        <p><strong>Experience:</strong> {profile.yearsOfExperience} years</p>
                        <p><strong>Certifications:</strong> {profile.certifications}</p>
                        
                        <div className="mt-3">
                          <div className="rating-stars">
                            ⭐ {profile.rating || 0} ({profile.totalReviews || 0} reviews)
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="dashboard-card">
                      <Card.Body className="text-center">
                        <h3>Status</h3>
                        <p className="mb-0">
                          {profile.isAvailable ? 'Available for bookings' : 'Currently unavailable'}
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              ) : (
                <Alert variant="info">
                  <h4>Welcome to Mechanic On Demand!</h4>
                  <p>Please create your mechanic profile to start receiving booking requests.</p>
                  <Button variant="primary" onClick={() => setShowProfileModal(true)}>
                    Create Profile
                  </Button>
                </Alert>
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
                  <p>Bookings will appear here when customers book your services.</p>
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
                          
                          <p><strong>Customer:</strong> {booking.customer.fullName}</p>
                          <p><strong>Phone:</strong> {booking.customer.phoneNumber}</p>
                          <p><strong>Problem:</strong> {booking.problemDescription}</p>
                          <p><strong>Vehicle:</strong> {booking.vehicleType} {booking.vehicleModel}</p>
                          <p><strong>Location:</strong> {booking.serviceLocation}</p>
                          <p><strong>Created:</strong> {new Date(booking.createdAt).toLocaleDateString()}</p>
                          
                          {booking.preferredDateTime && (
                            <p><strong>Preferred Time:</strong> {new Date(booking.preferredDateTime).toLocaleString()}</p>
                          )}
                          
                          <div className="mt-3">
                            {booking.status === 'PENDING' && (
                              <>
                                <Button 
                                  variant="success" 
                                  size="sm" 
                                  className="me-2"
                                  onClick={() => openBookingModal(booking)}
                                >
                                  Accept
                                </Button>
                                <Button 
                                  variant="danger" 
                                  size="sm"
                                  onClick={() => handleBookingAction(booking.id, 'reject')}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            
                            {booking.status === 'ACCEPTED' && (
                              <Button 
                                variant="primary" 
                                size="sm"
                                onClick={() => openBookingModal(booking)}
                              >
                                Mark Complete
                              </Button>
                            )}
                            
                            {booking.mechanicNotes && (
                              <div className="mt-3">
                                <strong>Your Notes:</strong>
                                <p className="text-muted">{booking.mechanicNotes}</p>
                              </div>
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          )}
        </Col>
      </Row>

      {/* Profile Modal */}
      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{profile ? 'Edit Profile' : 'Create Profile'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleProfileSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Skills *</Form.Label>
              <Form.Control
                type="text"
                value={profileForm.skills}
                onChange={(e) => setProfileForm({...profileForm, skills: e.target.value})}
                required
                placeholder="e.g. Engine repair, Brake service, AC repair"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={profileForm.description}
                onChange={(e) => setProfileForm({...profileForm, description: e.target.value})}
                placeholder="Brief description about your services"
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hourly Rate (₹) *</Form.Label>
                  <Form.Control
                    type="number"
                    value={profileForm.hourlyRate}
                    onChange={(e) => setProfileForm({...profileForm, hourlyRate: e.target.value})}
                    required
                    min="0"
                    step="0.01"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Years of Experience</Form.Label>
                  <Form.Control
                    type="number"
                    value={profileForm.yearsOfExperience}
                    onChange={(e) => setProfileForm({...profileForm, yearsOfExperience: e.target.value})}
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Certifications</Form.Label>
              <Form.Control
                type="text"
                value={profileForm.certifications}
                onChange={(e) => setProfileForm({...profileForm, certifications: e.target.value})}
                placeholder="Any relevant certifications"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Available for bookings"
                checked={profileForm.isAvailable}
                onChange={(e) => setProfileForm({...profileForm, isAvailable: e.target.checked})}
              />
            </Form.Group>
            
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowProfileModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {profile ? 'Update Profile' : 'Create Profile'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Booking Action Modal */}
      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedBooking?.status === 'PENDING' ? 'Accept Booking' : 'Complete Booking'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            e.preventDefault();
            const action = selectedBooking?.status === 'PENDING' ? 'accept' : 'complete';
            handleBookingAction(selectedBooking.id, action, bookingNotes);
          }}>
            <Form.Group className="mb-3">
              <Form.Label>Notes (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
                placeholder="Add any notes for the customer..."
              />
            </Form.Group>
            
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowBookingModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {selectedBooking?.status === 'PENDING' ? 'Accept Booking' : 'Mark Complete'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default MechanicDashboard;