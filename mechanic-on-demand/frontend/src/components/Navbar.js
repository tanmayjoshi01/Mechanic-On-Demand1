import React, { useState, useEffect } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { isAuthenticated, getUser, getUserRole, logout } from '../utils/auth';
import { notificationAPI } from '../services/api';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getUser());
      setUserRole(getUserRole());
      fetchUnreadCount();
    }
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationAPI.getUnreadCount();
      setUnreadCount(response.data);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setUserRole(null);
    setUnreadCount(0);
  };

  const getDashboardPath = () => {
    switch (userRole) {
      case 'CUSTOMER':
        return '/customer';
      case 'MECHANIC':
        return '/mechanic';
      case 'ADMIN':
        return '/admin';
      default:
        return '/';
    }
  };

  return (
    <BootstrapNavbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <LinkContainer to="/">
          <BootstrapNavbar.Brand>
            🔧 Mechanic On Demand
          </BootstrapNavbar.Brand>
        </LinkContainer>
        
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            
            {isAuthenticated() && (
              <LinkContainer to={getDashboardPath()}>
                <Nav.Link>Dashboard</Nav.Link>
              </LinkContainer>
            )}
          </Nav>
          
          <Nav>
            {!isAuthenticated() ? (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>Register</Nav.Link>
                </LinkContainer>
              </>
            ) : (
              <>
                {unreadCount > 0 && (
                  <Nav.Link className="position-relative">
                    🔔
                    <Badge 
                      bg="danger" 
                      className="notification-badge"
                    >
                      {unreadCount}
                    </Badge>
                  </Nav.Link>
                )}
                
                <NavDropdown 
                  title={`👤 ${user?.fullName || user?.username}`} 
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item>
                    Role: {userRole}
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;