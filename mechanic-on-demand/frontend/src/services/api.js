import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/signin', credentials),
  register: (userData) => api.post('/auth/signup', userData),
};

// Customer API
export const customerAPI = {
  getMechanics: () => api.get('/customer/mechanics'),
  getMechanicsByCity: (city) => api.get(`/customer/mechanics/city/${city}`),
  getMechanicsByPincode: (pincode) => api.get(`/customer/mechanics/pincode/${pincode}`),
  searchMechanics: (skill) => api.get(`/customer/mechanics/search?skill=${skill}`),
  getMechanicById: (id) => api.get(`/customer/mechanics/${id}`),
  createBooking: (bookingData) => api.post('/customer/bookings', bookingData),
  getMyBookings: () => api.get('/customer/bookings'),
  getBookingById: (id) => api.get(`/customer/bookings/${id}`),
  cancelBooking: (id) => api.put(`/customer/bookings/${id}/cancel`),
};

// Mechanic API
export const mechanicAPI = {
  getProfile: () => api.get('/mechanic/profile'),
  createProfile: (profileData) => api.post('/mechanic/profile', profileData),
  updateProfile: (profileData) => api.put('/mechanic/profile', profileData),
  getMyBookings: () => api.get('/mechanic/bookings'),
  getBookingById: (id) => api.get(`/mechanic/bookings/${id}`),
  acceptBooking: (id, notes) => api.put(`/mechanic/bookings/${id}/accept?notes=${notes || ''}`),
  rejectBooking: (id, notes) => api.put(`/mechanic/bookings/${id}/reject?notes=${notes || ''}`),
  completeBooking: (id, notes) => api.put(`/mechanic/bookings/${id}/complete?notes=${notes || ''}`),
  updateAvailability: (available) => api.put(`/mechanic/availability?available=${available}`),
};

// Admin API
export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  getAllCustomers: () => api.get('/admin/users/customers'),
  getAllMechanicUsers: () => api.get('/admin/users/mechanics'),
  getAllMechanics: () => api.get('/admin/mechanics'),
  getUnverifiedMechanics: () => api.get('/admin/mechanics/unverified'),
  verifyMechanic: (id) => api.put(`/admin/mechanics/${id}/verify`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAllBookings: () => api.get('/admin/bookings'),
  getBookingsByStatus: (status) => api.get(`/admin/bookings/status/${status}`),
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  activateUser: (id) => api.put(`/admin/users/${id}/activate`),
  deactivateUser: (id) => api.put(`/admin/users/${id}/deactivate`),
};

// Notifications API
export const notificationAPI = {
  getMyNotifications: () => api.get('/notifications'),
  getUnreadNotifications: () => api.get('/notifications/unread'),
  getUnreadCount: () => api.get('/notifications/unread/count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

export default api;