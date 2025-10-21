import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

import MechanicProfile from '../components/mechanic/MechanicProfile';
import BookingManagement from '../components/mechanic/BookingManagement';
import NotificationPanel from '../components/NotificationPanel';

const MechanicDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchBookings();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/mechanic/profile');
      setProfile(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        // Profile not created yet
        setProfile(null);
      } else {
        toast.error('Failed to fetch profile');
      }
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/mechanic/bookings');
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('/api/mechanic/profile', profileData);
      setProfile(response.data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const createProfile = async (profileData) => {
    try {
      const response = await axios.post('/api/mechanic/profile', profileData);
      setProfile(response.data);
      toast.success('Profile created successfully!');
    } catch (error) {
      toast.error('Failed to create profile');
    }
  };

  const updateBooking = async (bookingId, action) => {
    try {
      let response;
      switch (action) {
        case 'accept':
          response = await axios.put(`/api/mechanic/bookings/${bookingId}/accept`);
          break;
        case 'reject':
          response = await axios.put(`/api/mechanic/bookings/${bookingId}/reject`);
          break;
        case 'complete':
          response = await axios.put(`/api/mechanic/bookings/${bookingId}/complete`);
          break;
        default:
          throw new Error('Invalid action');
      }
      
      // Update local bookings state
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? response.data : booking
      ));
      
      toast.success(`Booking ${action}ed successfully!`);
    } catch (error) {
      toast.error(`Failed to ${action} booking`);
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="loading-spinner">Loading...</div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Mechanic Dashboard</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="list-group list-group-flush">
                <Link to="/mechanic" className="list-group-item list-group-item-action">
                  Profile
                </Link>
                <Link to="/mechanic/bookings" className="list-group-item list-group-item-action">
                  My Bookings
                </Link>
                <Link to="/mechanic/notifications" className="list-group-item list-group-item-action">
                  Notifications
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={9}>
          <Routes>
            <Route 
              path="/" 
              element={
                <MechanicProfile 
                  profile={profile}
                  onCreateProfile={createProfile}
                  onUpdateProfile={updateProfile}
                />
              } 
            />
            <Route 
              path="/bookings" 
              element={
                <BookingManagement 
                  bookings={bookings}
                  onUpdateBooking={updateBooking}
                  onRefresh={fetchBookings}
                />
              } 
            />
            <Route 
              path="/notifications" 
              element={<NotificationPanel />} 
            />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

export default MechanicDashboard;