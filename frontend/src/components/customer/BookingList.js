import React from 'react';
import { Card, Badge, Button, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const BookingList = ({ bookings, onRefresh }) => {
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

  if (bookings.length === 0) {
    return (
      <Card>
        <Card.Body className="text-center py-5">
          <h5 className="text-muted">No bookings found</h5>
          <p className="text-muted">Start by searching for mechanics and creating your first booking.</p>
          <Button as={Link} to="/customer" variant="primary">
            Search Mechanics
          </Button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>My Bookings</h4>
        <Button variant="outline-primary" onClick={onRefresh}>
          Refresh
        </Button>
      </div>

      <Row>
        {bookings.map((booking) => (
          <Col md={6} lg={4} key={booking.id} className="mb-4">
            <Card className="booking-card h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="card-title mb-0">
                    {booking.serviceDescription.substring(0, 30)}...
                  </h6>
                  {getStatusBadge(booking.status)}
                </div>
                
                <p className="text-muted mb-2">
                  <strong>Mechanic:</strong> {booking.mechanic.user.firstName} {booking.mechanic.user.lastName}
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
                    <strong>Cost:</strong> ₹{booking.totalCost}
                  </p>
                )}
                
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    Created: {formatDate(booking.createdAt)}
                  </small>
                  <Button
                    as={Link}
                    to={`/customer/bookings/${booking.id}`}
                    variant="outline-primary"
                    size="sm"
                  >
                    View Details
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default BookingList;