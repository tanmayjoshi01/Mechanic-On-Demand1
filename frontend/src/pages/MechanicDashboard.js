import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const MechanicDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [mechanicProfile, setMechanicProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileForm, setProfileForm] = useState({
    skills: '',
    city: '',
    pincode: '',
    address: '',
    hourlyRate: '',
    isAvailable: true
  });

  useEffect(() => {
    fetchBookings();
    fetchMechanicProfile();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/booking/mechanic');
      setBookings(response.data);
    } catch (error) {
      toast.error('Error fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchMechanicProfile = async () => {
    try {
      const response = await axios.get('/api/mechanic/profile');
      setMechanicProfile(response.data);
      setProfileForm({
        skills: response.data.skills || '',
        city: response.data.city || '',
        pincode: response.data.pincode || '',
        address: response.data.address || '',
        hourlyRate: response.data.hourlyRate || '',
        isAvailable: response.data.isAvailable
      });
    } catch (error) {
      console.error('Error fetching mechanic profile:', error);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await axios.put(`/api/booking/${bookingId}/status/${newStatus}`);
      fetchBookings();
      toast.success(`Booking ${newStatus.toLowerCase()} successfully`);
    } catch (error) {
      toast.error('Error updating booking status');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/mechanic/profile', profileForm);
      fetchMechanicProfile();
      setShowProfileForm(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Error updating profile');
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusActions = (booking) => {
    switch (booking.status) {
      case 'PENDING':
        return (
          <div className="d-flex gap-2">
            <button
              className="btn btn-success btn-sm"
              onClick={() => handleStatusUpdate(booking.id, 'ACCEPTED')}
            >
              <i className="bi bi-check-circle me-1"></i>
              Accept
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleStatusUpdate(booking.id, 'REJECTED')}
            >
              <i className="bi bi-x-circle me-1"></i>
              Reject
            </button>
          </div>
        );
      case 'ACCEPTED':
        return (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => handleStatusUpdate(booking.id, 'IN_PROGRESS')}
          >
            <i className="bi bi-play-circle me-1"></i>
            Start Work
          </button>
        );
      case 'IN_PROGRESS':
        return (
          <button
            className="btn btn-success btn-sm"
            onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}
          >
            <i className="bi bi-check-circle me-1"></i>
            Mark Complete
          </button>
        );
      default:
        return null;
    }
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
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="display-6 fw-bold">My Jobs</h1>
            <button
              className="btn btn-outline-primary"
              onClick={() => setShowProfileForm(true)}
            >
              <i className="bi bi-person-gear me-2"></i>
              Update Profile
            </button>
          </div>

          {/* Profile Summary */}
          {mechanicProfile && (
            <div className="dashboard-card mb-4">
              <div className="row">
                <div className="col-md-3 text-center">
                  <div className="dashboard-stat">
                    <h3>{mechanicProfile.totalJobs}</h3>
                    <p>Total Jobs</p>
                  </div>
                </div>
                <div className="col-md-3 text-center">
                  <div className="dashboard-stat">
                    <h3>{mechanicProfile.rating.toFixed(1)}</h3>
                    <p>Rating</p>
                  </div>
                </div>
                <div className="col-md-3 text-center">
                  <div className="dashboard-stat">
                    <h3>₹{mechanicProfile.hourlyRate}</h3>
                    <p>Hourly Rate</p>
                  </div>
                </div>
                <div className="col-md-3 text-center">
                  <div className="dashboard-stat">
                    <h3 className={mechanicProfile.isAvailable ? 'text-success' : 'text-danger'}>
                      {mechanicProfile.isAvailable ? 'Available' : 'Busy'}
                    </h3>
                    <p>Status</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile Update Modal */}
          {showProfileForm && (
            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Update Profile</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowProfileForm(false)}
                    ></button>
                  </div>
                  <form onSubmit={handleProfileUpdate}>
                    <div className="modal-body">
                      <div className="mb-3">
                        <label className="form-label">Skills (comma separated)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={profileForm.skills}
                          onChange={(e) => setProfileForm({...profileForm, skills: e.target.value})}
                          placeholder="e.g., Engine Repair, Brake Service, AC Repair"
                        />
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">City</label>
                            <input
                              type="text"
                              className="form-control"
                              value={profileForm.city}
                              onChange={(e) => setProfileForm({...profileForm, city: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Pincode</label>
                            <input
                              type="text"
                              className="form-control"
                              value={profileForm.pincode}
                              onChange={(e) => setProfileForm({...profileForm, pincode: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Address</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={profileForm.address}
                          onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                        ></textarea>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Hourly Rate (₹)</label>
                            <input
                              type="number"
                              className="form-control"
                              value={profileForm.hourlyRate}
                              onChange={(e) => setProfileForm({...profileForm, hourlyRate: e.target.value})}
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Availability</label>
                            <select
                              className="form-select"
                              value={profileForm.isAvailable}
                              onChange={(e) => setProfileForm({...profileForm, isAvailable: e.target.value === 'true'})}
                            >
                              <option value={true}>Available</option>
                              <option value={false}>Busy</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowProfileForm(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Update Profile
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Bookings List */}
          {bookings.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-calendar-x text-muted" style={{ fontSize: '4rem' }}></i>
              <h4 className="mt-3 text-muted">No job requests yet</h4>
              <p className="text-muted">
                Your job requests will appear here when customers book your services
              </p>
            </div>
          ) : (
            <div className="row">
              {bookings.map((booking) => (
                <div key={booking.id} className="col-lg-6 mb-4">
                  <div className="booking-card">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="mb-1">
                          {booking.customer.firstName} {booking.customer.lastName}
                        </h5>
                        <p className="text-muted mb-0">
                          <i className="bi bi-geo-alt me-1"></i>
                          {booking.city}, {booking.pincode}
                        </p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>

                    <div className="mb-3">
                      <h6 className="mb-2">Service Description:</h6>
                      <p className="text-muted">{booking.description}</p>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <p className="text-muted mb-1">
                          <i className="bi bi-calendar me-1"></i>
                          Preferred: {formatDate(booking.preferredDate)}
                        </p>
                        <p className="text-muted mb-0">
                          <i className="bi bi-clock me-1"></i>
                          Duration: {booking.estimatedDuration || 'N/A'} hours
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p className="text-muted mb-1">
                          <i className="bi bi-currency-rupee me-1"></i>
                          Cost: ₹{booking.totalCost || 'TBD'}
                        </p>
                        <p className="text-muted mb-0">
                          <i className="bi bi-calendar-plus me-1"></i>
                          Created: {formatDate(booking.createdAt)}
                        </p>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="mb-3">
                        <h6 className="mb-2">Notes:</h6>
                        <p className="text-muted">{booking.notes}</p>
                      </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center">
                      <Link
                        to={`/booking/${booking.id}`}
                        className="btn btn-outline-primary"
                      >
                        <i className="bi bi-eye me-1"></i>
                        View Details
                      </Link>
                      {getStatusActions(booking)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MechanicDashboard;