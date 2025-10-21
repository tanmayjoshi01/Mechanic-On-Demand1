import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: 'CUSTOMER',
    // Mechanic specific fields
    skills: '',
    city: '',
    pincode: '',
    address: '',
    hourlyRate: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data based on role
      const submitData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        role: formData.role
      };

      // Add mechanic specific fields if role is MECHANIC
      if (formData.role === 'MECHANIC') {
        submitData.skills = formData.skills;
        submitData.city = formData.city;
        submitData.pincode = formData.pincode;
        submitData.address = formData.address;
        submitData.hourlyRate = parseFloat(formData.hourlyRate) || 0;
      }

      const result = await register(submitData);
      
      if (result.success) {
        toast.success('Registration successful!');
        // Redirect based on user role
        switch (formData.role) {
          case 'CUSTOMER':
            navigate('/customer');
            break;
          case 'MECHANIC':
            navigate('/mechanic');
            break;
          case 'ADMIN':
            navigate('/admin');
            break;
          default:
            navigate('/');
        }
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Create Account</h2>
                <p className="text-muted">Join our platform today</p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Role Selection */}
                <div className="mb-4">
                  <label className="form-label">I want to register as:</label>
                  <div className="row">
                    <div className="col-md-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="role"
                          id="customer"
                          value="CUSTOMER"
                          checked={formData.role === 'CUSTOMER'}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="customer">
                          Customer
                        </label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="role"
                          id="mechanic"
                          value="MECHANIC"
                          checked={formData.role === 'MECHANIC'}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="mechanic">
                          Mechanic
                        </label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="role"
                          id="admin"
                          value="ADMIN"
                          checked={formData.role === 'ADMIN'}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="admin">
                          Admin
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="firstName" className="form-label">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="lastName" className="form-label">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="phoneNumber" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                  />
                </div>

                {/* Mechanic Specific Fields */}
                {formData.role === 'MECHANIC' && (
                  <>
                    <hr className="my-4" />
                    <h5 className="mb-3">Mechanic Information</h5>
                    
                    <div className="mb-3">
                      <label htmlFor="skills" className="form-label">
                        Skills (comma separated)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="skills"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="e.g., Engine Repair, Brake Service, AC Repair"
                        required
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="city" className="form-label">
                            City
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="pincode" className="form-label">
                            Pincode
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="pincode"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="address" className="form-label">
                        Address
                      </label>
                      <textarea
                        className="form-control"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        required
                      ></textarea>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="hourlyRate" className="form-label">
                        Hourly Rate (₹)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="hourlyRate"
                        name="hourlyRate"
                        value={formData.hourlyRate}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <p className="text-muted">
                  Already have an account?{' '}
                  <Link to="/login" className="text-decoration-none">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;