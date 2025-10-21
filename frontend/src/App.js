import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import MechanicDashboard from './pages/MechanicDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SearchMechanics from './pages/SearchMechanics';
import BookingDetails from './pages/BookingDetails';
import Profile from './pages/Profile';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<SearchMechanics />} />
        
        {user && (
          <>
            <Route path="/customer" element={<CustomerDashboard />} />
            <Route path="/mechanic" element={<MechanicDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/booking/:id" element={<BookingDetails />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;