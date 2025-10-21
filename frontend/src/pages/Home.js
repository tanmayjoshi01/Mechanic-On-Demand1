import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h1 className="display-4 fw-bold mb-4">
                Find Mechanics On Demand
              </h1>
              <p className="lead mb-4">
                Connect with skilled mechanics in your area for quick and reliable service.
                Book instantly, get quality work done.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/search" className="btn btn-primary btn-lg">
                  <i className="bi bi-search me-2"></i>
                  Find Mechanics
                </Link>
                {!user && (
                  <Link to="/register" className="btn btn-outline-light btn-lg">
                    <i className="bi bi-person-plus me-2"></i>
                    Join Now
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-lg-8 mx-auto">
              <h2 className="display-5 fw-bold mb-3">Why Choose Us?</h2>
              <p className="lead text-muted">
                We make finding and booking mechanics simple, fast, and reliable.
              </p>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 text-center p-4">
                <div className="card-body">
                  <i className="bi bi-lightning-charge text-primary" style={{ fontSize: '3rem' }}></i>
                  <h5 className="card-title mt-3">Quick Service</h5>
                  <p className="card-text">
                    Find and book mechanics in your area within minutes. 
                    No more waiting for appointments.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 text-center p-4">
                <div className="card-body">
                  <i className="bi bi-shield-check text-primary" style={{ fontSize: '3rem' }}></i>
                  <h5 className="card-title mt-3">Verified Mechanics</h5>
                  <p className="card-text">
                    All our mechanics are verified professionals with 
                    proven track records and customer reviews.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 text-center p-4">
                <div className="card-body">
                  <i className="bi bi-clock text-primary" style={{ fontSize: '3rem' }}></i>
                  <h5 className="card-title mt-3">Real-time Updates</h5>
                  <p className="card-text">
                    Get instant notifications about your booking status 
                    and stay informed throughout the process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-lg-8 mx-auto">
              <h2 className="display-5 fw-bold mb-3">How It Works</h2>
              <p className="lead text-muted">
                Simple steps to get your vehicle serviced by professionals.
              </p>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4 text-center">
              <div className="position-relative">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '60px', height: '60px' }}>
                  <span className="fw-bold fs-4">1</span>
                </div>
                <h5>Search & Select</h5>
                <p className="text-muted">
                  Search for mechanics in your area by city or pincode. 
                  View profiles, ratings, and reviews.
                </p>
              </div>
            </div>
            
            <div className="col-md-4 text-center">
              <div className="position-relative">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '60px', height: '60px' }}>
                  <span className="fw-bold fs-4">2</span>
                </div>
                <h5>Book Service</h5>
                <p className="text-muted">
                  Fill out the booking form with your requirements 
                  and preferred time slot.
                </p>
              </div>
            </div>
            
            <div className="col-md-4 text-center">
              <div className="position-relative">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '60px', height: '60px' }}>
                  <span className="fw-bold fs-4">3</span>
                </div>
                <h5>Get Service</h5>
                <p className="text-muted">
                  Receive confirmation and get your vehicle serviced 
                  by the selected mechanic.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="display-5 fw-bold mb-3">Ready to Get Started?</h2>
              <p className="lead text-muted mb-4">
                Join thousands of satisfied customers who trust us for their vehicle service needs.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/search" className="btn btn-primary btn-lg">
                  <i className="bi bi-search me-2"></i>
                  Find Mechanics Now
                </Link>
                {!user && (
                  <Link to="/register" className="btn btn-outline-primary btn-lg">
                    <i className="bi bi-person-plus me-2"></i>
                    Sign Up Today
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;