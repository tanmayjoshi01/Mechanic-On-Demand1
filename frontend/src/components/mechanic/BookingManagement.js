import React, { useState } from 'react';
import { Card, Badge, Button, Row, Col, Alert, Tabs, Tab } from 'react-bootstrap';

const BookingManagement = ({ bookings, onUpdateBooking, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('pending');

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { variant: 'warning', text: 'Pending' },
      ACCEPTED: { variant: 'success', text: 'Accepted' },
      IN_PROGRESS: { variant: 'info', text: 'In Progress' },
      COMPLETED: { variant: 'secondary', text: 'Completed' },
      CANCELLED: { variant: 'danger', text: 'Cancelled' },
      REJECTED: { variant: 'danger', text: 'Rejected' }
    };
    
    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pendingBookings = bookings.filter(booking => booking.status === 'PENDING');
  const acceptedBookings = bookings.filter(booking => booking.status === 'ACCEPTED');
  const completedBookings = bookings.filter(booking => booking.status === 'COMPLETED');

  const BookingCard = ({ booking }) => (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h6 className="card-title mb-0">
            {booking.serviceDescription.substring(0, 40)}...
          </h6>
          {getStatusBadge(booking.status)}
        </div>
        
        <p className="text-muted mb-2">
          <strong>Customer:</strong> {booking.customer.firstName} {booking.customer.lastName}
        </p>
        
        <p className="text-muted mb-2">
          <strong>Location:</strong> {booking.city}, {booking.pincode}
        </p>
        
        <p className="text-muted mb-2">
          <strong>Preferred Date:</strong> {formatDate(booking.preferredDate)}
        </p>
        
        <p className="text-muted mb-2">
          <strong>Duration:</strong> {booking.estimatedDuration} hours
        </p>
        
        {booking.totalCost && (
          <p className="text-muted mb-2">
            <strong>Earnings:</strong> ₹{booking.totalCost}
          </p>
        )}
        
        {booking.notes && (
          <p className="text-muted mb-2">
            <strong>Notes:</strong> {booking.notes}
          </p>
        )}
        
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">
            Created: {formatDate(booking.createdAt)}
          </small>
          
          <div className="d-flex gap-2">
            {booking.status === 'PENDING' && (
              <>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => onUpdateBooking(booking.id, 'accept')}
                >
                  Accept
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onUpdateBooking(booking.id, 'reject')}
                >
                  Reject
                </Button>
              </>
            )}
            
            {booking.status === 'ACCEPTED' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onUpdateBooking(booking.id, 'complete')}
              >
                Mark Complete
              </Button>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Booking Management</h4>
        <Button variant="outline-primary" onClick={onRefresh}>
          Refresh
        </Button>
      </div>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="pending" title={`Pending (${pendingBookings.length})`}>
          {pendingBookings.length === 0 ? (
            <Alert variant="info">
              No pending bookings at the moment.
            </Alert>
          ) : (
            <Row>
              {pendingBookings.map((booking) => (
                <Col md={6} key={booking.id}>
                  <BookingCard booking={booking} />
                </Col>
              ))}
            </Row>
          )}
        </Tab>
        
        <Tab eventKey="accepted" title={`Accepted (${acceptedBookings.length})`}>
          {acceptedBookings.length === 0 ? (
            <Alert variant="info">
              No accepted bookings at the moment.
            </Alert>
          ) : (
            <Row>
              {acceptedBookings.map((booking) => (
                <Col md={6} key={booking.id}>
                  <BookingCard booking={booking} />
                </Col>
              ))}
            </Row>
          )}
        </Tab>
        
        <Tab eventKey="completed" title={`Completed (${completedBookings.length})`}>
          {completedBookings.length === 0 ? (
            <Alert variant="info">
              No completed bookings yet.
            </Alert>
          ) : (
            <Row>
              {completedBookings.map((booking) => (
                <Col md={6} key={booking.id}>
                  <BookingCard booking={booking} />
                </Col>
              ))}
            </Row>
          )}
        </Tab>
      </Tabs>
    </div>
  );
};

export default BookingManagement;