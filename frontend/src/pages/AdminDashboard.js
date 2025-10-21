import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

import AdminStats from '../components/admin/AdminStats';
import UserManagement from '../components/admin/UserManagement';
import MechanicManagement from '../components/admin/MechanicManagement';
import BookingManagement from '../components/admin/BookingManagement';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/statistics');
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch statistics');
    } finally {
      setLoading(false);
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
              <h5 className="mb-0">Admin Dashboard</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="list-group list-group-flush">
                <Link to="/admin" className="list-group-item list-group-item-action">
                  Statistics
                </Link>
                <Link to="/admin/users" className="list-group-item list-group-item-action">
                  User Management
                </Link>
                <Link to="/admin/mechanics" className="list-group-item list-group-item-action">
                  Mechanic Management
                </Link>
                <Link to="/admin/bookings" className="list-group-item list-group-item-action">
                  Booking Management
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={9}>
          <Routes>
            <Route 
              path="/" 
              element={<AdminStats stats={stats} onRefresh={fetchStats} />} 
            />
            <Route 
              path="/users" 
              element={<UserManagement />} 
            />
            <Route 
              path="/mechanics" 
              element={<MechanicManagement />} 
            />
            <Route 
              path="/bookings" 
              element={<BookingManagement />} 
            />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;