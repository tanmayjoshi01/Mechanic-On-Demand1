import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({});
  const [users, setUsers] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, usersRes, mechanicsRes, bookingsRes, notificationsRes] = await Promise.all([
        axios.get('/api/admin/dashboard'),
        axios.get('/api/admin/users'),
        axios.get('/api/admin/mechanics'),
        axios.get('/api/admin/bookings'),
        axios.get('/api/admin/notifications')
      ]);

      setDashboardStats(statsRes.data);
      setUsers(usersRes.data);
      setMechanics(mechanicsRes.data);
      setBookings(bookingsRes.data);
      setNotifications(notificationsRes.data);
    } catch (error) {
      toast.error('Error fetching dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMechanic = async (mechanicId) => {
    try {
      await axios.put(`/api/admin/mechanics/${mechanicId}/verify`);
      setMechanics(mechanics.map(m => 
        m.id === mechanicId ? { ...m, isVerified: true } : m
      ));
      toast.success('Mechanic verified successfully');
    } catch (error) {
      toast.error('Error verifying mechanic');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/admin/users/${userId}`);
        setUsers(users.filter(u => u.id !== userId));
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error('Error deleting user');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      PENDING: 'status-pending',
      ACCEPTED: 'status-accepted',
      IN_PROGRESS: 'status-in-progress',
      COMPLETED: 'status-completed',
      CANCELLED: 'status-cancelled',
      REJECTED: 'status-rejected'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status] || 'status-pending'}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-12">
          <h1 className="display-6 fw-bold mb-4">Admin Dashboard</h1>

          {/* Navigation Tabs */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                Dashboard
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                Users
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'mechanics' ? 'active' : ''}`}
                onClick={() => setActiveTab('mechanics')}
              >
                Mechanics
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`}
                onClick={() => setActiveTab('bookings')}
              >
                Bookings
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                Notifications
              </button>
            </li>
          </ul>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="row mb-4">
                <div className="col-md-3">
                  <div className="dashboard-card text-center">
                    <div className="dashboard-stat">
                      <h3>{dashboardStats.totalUsers || 0}</h3>
                      <p>Total Users</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="dashboard-card text-center">
                    <div className="dashboard-stat">
                      <h3>{dashboardStats.totalMechanics || 0}</h3>
                      <p>Total Mechanics</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="dashboard-card text-center">
                    <div className="dashboard-stat">
                      <h3>{dashboardStats.totalBookings || 0}</h3>
                      <p>Total Bookings</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="dashboard-card text-center">
                    <div className="dashboard-stat">
                      <h3>{dashboardStats.completedBookings || 0}</h3>
                      <p>Completed Jobs</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="dashboard-card">
                    <h5 className="mb-3">Recent Bookings</h5>
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                          <small className="text-muted">
                            {booking.customer.firstName} {booking.customer.lastName}
                          </small>
                          <br />
                          <small>{booking.description}</small>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="dashboard-card">
                    <h5 className="mb-3">Pending Verifications</h5>
                    {mechanics.filter(m => !m.isVerified).slice(0, 5).map((mechanic) => (
                      <div key={mechanic.id} className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                          <small className="text-muted">
                            {mechanic.user.firstName} {mechanic.user.lastName}
                          </small>
                          <br />
                          <small>{mechanic.city}</small>
                        </div>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleVerifyMechanic(mechanic.id)}
                        >
                          Verify
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="dashboard-card">
              <h5 className="mb-3">All Users</h5>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Phone</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.firstName} {user.lastName}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge ${
                            user.role === 'ADMIN' ? 'bg-danger' :
                            user.role === 'MECHANIC' ? 'bg-warning' : 'bg-info'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{user.phoneNumber}</td>
                        <td>{formatDate(user.createdAt)}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Mechanics Tab */}
          {activeTab === 'mechanics' && (
            <div className="dashboard-card">
              <h5 className="mb-3">All Mechanics</h5>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>City</th>
                      <th>Skills</th>
                      <th>Rating</th>
                      <th>Jobs</th>
                      <th>Verified</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mechanics.map((mechanic) => (
                      <tr key={mechanic.id}>
                        <td>{mechanic.user.firstName} {mechanic.user.lastName}</td>
                        <td>{mechanic.city}</td>
                        <td>
                          <small>{mechanic.skills}</small>
                        </td>
                        <td>
                          <i className="bi bi-star-fill text-warning me-1"></i>
                          {mechanic.rating.toFixed(1)}
                        </td>
                        <td>{mechanic.totalJobs}</td>
                        <td>
                          <span className={`badge ${mechanic.isVerified ? 'bg-success' : 'bg-warning'}`}>
                            {mechanic.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td>
                          {!mechanic.isVerified && (
                            <button
                              className="btn btn-success btn-sm me-2"
                              onClick={() => handleVerifyMechanic(mechanic.id)}
                            >
                              Verify
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="dashboard-card">
              <h5 className="mb-3">All Bookings</h5>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Mechanic</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>{booking.customer.firstName} {booking.customer.lastName}</td>
                        <td>{booking.mechanic.user.firstName} {booking.mechanic.user.lastName}</td>
                        <td>
                          <small>{booking.description}</small>
                        </td>
                        <td>{getStatusBadge(booking.status)}</td>
                        <td>{formatDate(booking.createdAt)}</td>
                        <td>₹{booking.totalCost || 'TBD'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="dashboard-card">
              <h5 className="mb-3">All Notifications</h5>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Title</th>
                      <th>Message</th>
                      <th>Type</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notifications.map((notification) => (
                      <tr key={notification.id}>
                        <td>{notification.user.firstName} {notification.user.lastName}</td>
                        <td>{notification.title}</td>
                        <td>
                          <small>{notification.message}</small>
                        </td>
                        <td>
                          <span className="badge bg-info">
                            {notification.type.replace('_', ' ')}
                          </span>
                        </td>
                        <td>{formatDate(notification.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;