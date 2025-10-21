import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const CustomerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [mechanics, setMechanics] = useState([]);
  const [bookingForm, setBookingForm] = useState({
    mechanicId: '',
    description: '',
    address: '',
    city: '',
    pincode: '',
    preferredDate: '',
    estimatedDuration: '',
    notes: ''
  });

  useEffect(() => {
    fetchBookings();
    fetchMechanics();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/booking/customer');
      setBookings(response.data);
    } catch (error) {
      toast.error('Error fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchMechanics = async () => {
    try {
      const response = await axios.get('/api/mechanic/all');
      setMechanics(response.data);
    } catch (error) {
      console.error('Error fetching mechanics:', error);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/booking/create', bookingForm);
      setBookings([response.data, ...bookings]);
      setShowBookingForm(false);
      setBookingForm({
        mechanicId: '',
        description: '',
        address: '',
        city: '',
        pincode: '',
        preferredDate: '',
        estimatedDuration: '',
        notes: ''
      });
      toast.success('Booking created successfully!');
    } catch (error) {
      toast.error('Error creating booking');
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
            <h1 className="display-6 fw-bold">My Bookings</h1>
            <button
              className="btn btn-primary"
              onClick={() => setShowBookingForm(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>
              New Booking
            </button>
          </div>

          {/* Booking Form Modal */}
          {showBookingForm && (
            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Create New Booking</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowBookingForm(false)}
                    ></button>
                  </div>
                  <form onSubmit={handleBookingSubmit}>
                    <div className="modal-body">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Select Mechanic</label>
                            <select
                              className="form-select"
                              value={bookingForm.mechanicId}
                              onChange={(e) => setBookingForm({...bookingForm, mechanicId: e.target.value})}
                              required
                            >
                              <option value="">Choose a mechanic</option>
                              {mechanics.map((mechanic) => (
                                <option key={mechanic.id} value={mechanic.id}>
                                  {mechanic.user.firstName} {mechanic.user.lastName} - {mechanic.city}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Preferred Date & Time</label>
                            <input
                              type="datetime-local"
                              className="form-control"
                              value={bookingForm.preferredDate}
                              onChange={(e) => setBookingForm({...bookingForm, preferredDate: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Service Description</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={bookingForm.description}
                          onChange={(e) => setBookingForm({...bookingForm, description: e.target.value})}
                          placeholder="Describe the service you need..."
                          required
                        ></textarea>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Address</label>
                            <input
                              type="text"
                              className="form-control"
                              value={bookingForm.address}
                              onChange={(e) => setBookingForm({...bookingForm, address: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <label className="form-label">City</label>
                            <input
                              type="text"
                              className="form-control"
                              value={bookingForm.city}
                              onChange={(e) => setBookingForm({...bookingForm, city: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <label className="form-label">Pincode</label>
                            <input
                              type="text"
                              className="form-control"
                              value={bookingForm.pincode}
                              onChange={(e) => setBookingForm({...bookingForm, pincode: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Estimated Duration (hours)</label>
                            <input
                              type="number"
                              className="form-control"
                              value={bookingForm.estimatedDuration}
                              onChange={(e) => setBookingForm({...bookingForm, estimatedDuration: e.target.value})}
                              min="1"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Notes (optional)</label>
                            <input
                              type="text"
                              className="form-control"
                              value={bookingForm.notes}
                              onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowBookingForm(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Create Booking
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
              <h4 className="mt-3 text-muted">No bookings yet</h4>
              <p className="text-muted">
                Create your first booking to get started
              </p>
              <button
                className="btn btn-primary"
                onClick={() => setShowBookingForm(true)}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Create Booking
              </button>
            </div>
          ) : (
            <div className="row">
              {bookings.map((booking) => (
                <div key={booking.id} className="col-lg-6 mb-4">
                  <div className="booking-card">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="mb-1">
                          {booking.mechanic.user.firstName} {booking.mechanic.user.lastName}
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

                    <div className="d-flex gap-2">
                      <Link
                        to={`/booking/${booking.id}`}
                        className="btn btn-outline-primary flex-fill"
                      >
                        <i className="bi bi-eye me-1"></i>
                        View Details
                      </Link>
                      {booking.status === 'PENDING' && (
                        <button className="btn btn-outline-danger">
                          <i className="bi bi-x-circle me-1"></i>
                          Cancel
                        </button>
                      )}
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

export default CustomerDashboard;