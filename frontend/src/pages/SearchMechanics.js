import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const SearchMechanics = () => {
  const [searchType, setSearchType] = useState('city');
  const [searchQuery, setSearchQuery] = useState('');
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    setLoading(true);
    try {
      const endpoint = searchType === 'city' 
        ? `/api/mechanic/search/city/${encodeURIComponent(searchQuery)}`
        : `/api/mechanic/search/pincode/${encodeURIComponent(searchQuery)}`;
      
      const response = await axios.get(endpoint);
      setMechanics(response.data);
      
      if (response.data.length === 0) {
        toast.info('No mechanics found for your search');
      }
    } catch (error) {
      toast.error('Error searching for mechanics');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookMechanic = (mechanicId) => {
    // This would typically open a booking modal or navigate to booking page
    toast.info('Booking functionality will be implemented in the dashboard');
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-12">
          <div className="text-center mb-5">
            <h1 className="display-5 fw-bold mb-3">Find Mechanics</h1>
            <p className="lead text-muted">
              Search for skilled mechanics in your area
            </p>
          </div>

          {/* Search Form */}
          <div className="search-section">
            <form onSubmit={handleSearch}>
              <div className="row g-3">
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                  >
                    <option value="city">Search by City</option>
                    <option value="pincode">Search by Pincode</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={searchType === 'city' ? 'Enter city name' : 'Enter pincode'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Searching...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-search me-2"></i>
                        Search
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Results */}
          {loading && (
            <div className="loading-spinner">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {!loading && mechanics.length > 0 && (
            <div className="row">
              {mechanics.map((mechanic) => (
                <div key={mechanic.id} className="col-lg-6 col-xl-4 mb-4">
                  <div className="mechanic-card">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="mb-1">
                          {mechanic.user.firstName} {mechanic.user.lastName}
                        </h5>
                        <p className="text-muted mb-0">
                          <i className="bi bi-geo-alt me-1"></i>
                          {mechanic.city}, {mechanic.pincode}
                        </p>
                      </div>
                      <div className="text-end">
                        <div className="d-flex align-items-center mb-1">
                          <i className="bi bi-star-fill text-warning me-1"></i>
                          <span className="fw-bold">{mechanic.rating.toFixed(1)}</span>
                        </div>
                        <small className="text-muted">
                          {mechanic.totalJobs} jobs completed
                        </small>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h6 className="mb-2">Skills:</h6>
                      <div className="d-flex flex-wrap gap-1">
                        {mechanic.skills.split(',').map((skill, index) => (
                          <span
                            key={index}
                            className="badge bg-light text-dark border"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-muted mb-1">
                        <i className="bi bi-clock me-1"></i>
                        Available: {mechanic.isAvailable ? 'Yes' : 'No'}
                      </p>
                      <p className="text-muted mb-1">
                        <i className="bi bi-shield-check me-1"></i>
                        Verified: {mechanic.isVerified ? 'Yes' : 'No'}
                      </p>
                      <p className="text-muted mb-0">
                        <i className="bi bi-currency-rupee me-1"></i>
                        Rate: ₹{mechanic.hourlyRate}/hour
                      </p>
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-primary flex-fill"
                        onClick={() => handleBookMechanic(mechanic.id)}
                      >
                        <i className="bi bi-calendar-plus me-1"></i>
                        Book Now
                      </button>
                      <button className="btn btn-outline-primary">
                        <i className="bi bi-eye"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && mechanics.length === 0 && searchQuery && (
            <div className="text-center py-5">
              <i className="bi bi-search text-muted" style={{ fontSize: '4rem' }}></i>
              <h4 className="mt-3 text-muted">No mechanics found</h4>
              <p className="text-muted">
                Try searching with a different city or pincode
              </p>
            </div>
          )}

          {!loading && !searchQuery && (
            <div className="text-center py-5">
              <i className="bi bi-search text-muted" style={{ fontSize: '4rem' }}></i>
              <h4 className="mt-3 text-muted">Search for mechanics</h4>
              <p className="text-muted">
                Enter a city name or pincode to find mechanics in your area
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchMechanics;