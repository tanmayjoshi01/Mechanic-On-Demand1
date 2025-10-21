import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';

const AdminStats = ({ stats, onRefresh }) => {
  if (!stats) {
    return <div>Loading statistics...</div>;
  }

  const StatCard = ({ title, value, icon, color = 'primary' }) => (
    <Col md={3} className="mb-4">
      <Card className={`stats-card border-${color}`}>
        <Card.Body className="text-center">
          <div className={`text-${color} mb-2`} style={{ fontSize: '2rem' }}>
            {icon}
          </div>
          <h3 className={`text-${color} mb-1`}>{value}</h3>
          <p className="text-muted mb-0">{title}</p>
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>System Statistics</h4>
        <Button variant="outline-primary" onClick={onRefresh}>
          Refresh
        </Button>
      </div>

      <Row>
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon="👥"
          color="primary"
        />
        <StatCard
          title="Total Mechanics"
          value={stats.totalMechanics}
          icon="🔧"
          color="success"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon="👤"
          color="info"
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon="📋"
          color="warning"
        />
      </Row>

      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Booking Status Overview</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Pending</span>
                <span className="text-warning fw-bold">{stats.pendingBookings}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Accepted</span>
                <span className="text-success fw-bold">{stats.acceptedBookings}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Completed</span>
                <span className="text-secondary fw-bold">{stats.completedBookings}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Cancelled</span>
                <span className="text-danger fw-bold">{stats.cancelledBookings}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button variant="outline-primary" size="sm">
                  View All Users
                </Button>
                <Button variant="outline-success" size="sm">
                  Verify Mechanics
                </Button>
                <Button variant="outline-info" size="sm">
                  View All Bookings
                </Button>
                <Button variant="outline-warning" size="sm">
                  System Settings
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminStats;