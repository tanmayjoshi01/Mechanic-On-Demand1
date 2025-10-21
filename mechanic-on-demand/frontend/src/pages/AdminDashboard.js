import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Card, Button, Table, Badge, Spinner, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { adminAPI } from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchStats();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'mechanics') {
      fetchMechanics();
    } else if (activeTab === 'bookings') {
      fetchBookings();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchMechanics = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllMechanics();
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
      const response = await adminAPI.getAllBookings();
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMechanic = async (mechanicId) => {
    try {
      await adminAPI.verifyMechanic(mechanicId);
      toast.success('Mechanic verified successfully');
      fetchMechanics();
    } catch (error) {
      toast.error('Failed to verify mechanic');
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      if (action === 'activate') {
        await adminAPI.activateUser(userId);
        toast.success('User activated successfully');
      } else if (action === 'deactivate') {
        await adminAPI.deactivateUser(userId);
        toast.success('User deactivated successfully');
      } else if (action === 'delete') {
        await adminAPI.deleteUser(userId);
        toast.success('User deleted successfully');
      }
      fetchUsers();
    } catch (error) {
      toast.error(`Failed to ${action} user`);
    }
  };

  const confirmAction = (action, userId) => {
    setConfirmAction({ action, userId });
    setShowConfirmModal(true);
  };

  const executeAction = () => {
    if (confirmAction) {
      handleUserAction(confirmAction.userId, confirmAction.action);
      setShowConfirmModal(false);
      setConfirmAction(null);
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

  const getRoleBadge = (role) => {
    const roleConfig = {
      CUSTOMER: { variant: 'primary', text: 'Customer' },
      MECHANIC: { variant: 'success', text: 'Mechanic' },
      ADMIN: { variant: 'danger', text: 'Admin' }
    };
    
    const config = roleConfig[role] || { variant: 'secondary', text: role };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={3}>
          <div className="sidebar">
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link 
                  active={activeTab === 'dashboard'}
                  onClick={() => setActiveTab('dashboard')}
                >
                  📊 Dashboard
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  active={activeTab === 'users'}
                  onClick={() => setActiveTab('users')}
                >
                  👥 Users
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  active={activeTab === 'mechanics'}
                  onClick={() => setActiveTab('mechanics')}
                >
                  🔧 Mechanics
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
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="mb-4">Admin Dashboard</h2>
              
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" />
                </div>
              ) : (
                <>
                  {/* Stats Cards */}
                  <Row className="mb-4">
                    <Col md={3} className="mb-3">
                      <Card className="dashboard-card">
                        <Card.Body className="text-center">
                          <h3>{stats.totalUsers || 0}</h3>
                          <p className="mb-0">Total Users</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={3} className="mb-3">
                      <Card className="dashboard-card">
                        <Card.Body className="text-center">
                          <h3>{stats.totalMechanics || 0}</h3>
                          <p className="mb-0">Total Mechanics</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={3} className="mb-3">
                      <Card className="dashboard-card">
                        <Card.Body className="text-center">
                          <h3>{stats.totalBookings || 0}</h3>
                          <p className="mb-0">Total Bookings</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={3} className="mb-3">
                      <Card className="dashboard-card">
                        <Card.Body className="text-center">
                          <h3>{stats.verifiedMechanics || 0}</h3>
                          <p className="mb-0">Verified Mechanics</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  {/* Additional Stats */}
                  <Row>
                    <Col md={6}>
                      <Card>
                        <Card.Header>
                          <h5>User Statistics</h5>
                        </Card.Header>
                        <Card.Body>
                          <p>Active Users: <strong>{stats.activeUsers || 0}</strong></p>
                          <p>Customers: <strong>{stats.totalCustomers || 0}</strong></p>
                          <p>Available Mechanics: <strong>{stats.availableMechanics || 0}</strong></p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card>
                        <Card.Header>
                          <h5>Booking Statistics</h5>
                        </Card.Header>
                        <Card.Body>
                          <p>Pending: <strong>{stats.pendingBookings || 0}</strong></p>
                          <p>Accepted: <strong>{stats.acceptedBookings || 0}</strong></p>
                          <p>Completed: <strong>{stats.completedBookings || 0}</strong></p>
                          <p>Cancelled: <strong>{stats.cancelledBookings || 0}</strong></p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 className="mb-4">Users Management</h2>
              
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" />
                </div>
              ) : (
                <Card>
                  <Card.Body>
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>City</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.fullName}</td>
                            <td>{user.email}</td>
                            <td>{getRoleBadge(user.role)}</td>
                            <td>{user.city}</td>
                            <td>
                              <Badge bg={user.isActive ? 'success' : 'secondary'}>
                                {user.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                            <td>
                              {user.isActive ? (
                                <Button 
                                  variant="outline-warning" 
                                  size="sm" 
                                  className="me-1"
                                  onClick={() => confirmAction('deactivate', user.id)}
                                >
                                  Deactivate
                                </Button>
                              ) : (
                                <Button 
                                  variant="outline-success" 
                                  size="sm" 
                                  className="me-1"
                                  onClick={() => confirmAction('activate', user.id)}
                                >
                                  Activate
                                </Button>
                              )}
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => confirmAction('delete', user.id)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'mechanics' && (
            <div>
              <h2 className="mb-4">Mechanics Management</h2>
              
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" />
                </div>
              ) : (
                <Card>
                  <Card.Body>
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Skills</th>
                          <th>Experience</th>
                          <th>Rate</th>
                          <th>Rating</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mechanics.map((mechanic) => (
                          <tr key={mechanic.id}>
                            <td>{mechanic.id}</td>
                            <td>{mechanic.user.fullName}</td>
                            <td>{mechanic.skills}</td>
                            <td>{mechanic.yearsOfExperience} years</td>
                            <td>₹{mechanic.hourlyRate}/hr</td>
                            <td>⭐ {mechanic.rating || 0}</td>
                            <td>
                              <div>
                                <Badge bg={mechanic.isVerified ? 'success' : 'warning'}>
                                  {mechanic.isVerified ? 'Verified' : 'Unverified'}
                                </Badge>
                                <br />
                                <Badge bg={mechanic.isAvailable ? 'info' : 'secondary'}>
                                  {mechanic.isAvailable ? 'Available' : 'Unavailable'}
                                </Badge>
                              </div>
                            </td>
                            <td>
                              {!mechanic.isVerified && (
                                <Button 
                                  variant="success" 
                                  size="sm"
                                  onClick={() => handleVerifyMechanic(mechanic.id)}
                                >
                                  Verify
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div>
              <h2 className="mb-4">Bookings Management</h2>
              
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" />
                </div>
              ) : (
                <Card>
                  <Card.Body>
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Customer</th>
                          <th>Mechanic</th>
                          <th>Problem</th>
                          <th>Status</th>
                          <th>Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking) => (
                          <tr key={booking.id}>
                            <td>{booking.id}</td>
                            <td>{booking.customer.fullName}</td>
                            <td>{booking.mechanic.user.fullName}</td>
                            <td>{booking.problemDescription.substring(0, 50)}...</td>
                            <td>{getStatusBadge(booking.status)}</td>
                            <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              )}
            </div>
          )}
        </Col>
      </Row>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to {confirmAction?.action} this user?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={executeAction}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;