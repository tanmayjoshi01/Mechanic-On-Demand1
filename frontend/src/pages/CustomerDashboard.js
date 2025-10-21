import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Alert } from 'react-bootstrap';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

import MechanicSearch from '../components/customer/MechanicSearch';
import BookingForm from '../components/customer/BookingForm';
import BookingList from '../components/customer/BookingList';
import NotificationPanel from '../components/NotificationPanel';

const CustomerDashboard = () => {
  const [mechanics, setMechanics] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    city: '',
    pincode: '',
    skill: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/customer/bookings');
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const searchMechanics = async (params) => {
    setLoading(true);
    try {
      let response;
      if (params.city) {
        response = await axios.get(`/api/customer/mechanics/search/city/${params.city}`);
      } else if (params.pincode) {
        response = await axios.get(`/api/customer/mechanics/search/pincode/${params.pincode}`);
      } else if (params.skill) {
        response = await axios.get(`/api/customer/mechanics/search/skill/${params.skill}`);
      }
      
      setMechanics(response.data);
      setSearchParams(params);
    } catch (error) {
      toast.error('Failed to search mechanics');
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData) => {
    try {
      const response = await axios.post('/api/customer/book', bookingData);
      setBookings([response.data, ...bookings]);
      toast.success('Booking created successfully!');
      navigate('/customer/bookings');
    } catch (error) {
      toast.error('Failed to create booking');
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
              <h5 className="mb-0">Customer Dashboard</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="list-group list-group-flush">
                <Link to="/customer" className="list-group-item list-group-item-action">
                  Search Mechanics
                </Link>
                <Link to="/customer/bookings" className="list-group-item list-group-item-action">
                  My Bookings
                </Link>
                <Link to="/customer/notifications" className="list-group-item list-group-item-action">
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
                <MechanicSearch 
                  mechanics={mechanics}
                  onSearch={searchMechanics}
                  loading={loading}
                />
              } 
            />
            <Route 
              path="/book/:mechanicId" 
              element={
                <BookingForm 
                  onCreateBooking={createBooking}
                />
              } 
            />
            <Route 
              path="/bookings" 
              element={
                <BookingList 
                  bookings={bookings}
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

export default CustomerDashboard;