import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('imovies_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle expired sessions
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, remove bad/expired token
      const isAuthRoute = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      if (!isAuthRoute) {
        localStorage.removeItem('imovies_token');
        localStorage.removeItem('imovies_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  logout: () => api.post('/auth/logout'),
};

// Movies endpoints
export const movieService = {
  getMovies: (params) => api.get('/movies', { params }),
  getMovieById: (id) => api.get(`/movies/${id}`),
  getMovieShows: (id, params) => api.get(`/movies/${id}/shows`, { params }),
  createMovie: (movieData) => api.post('/movies', movieData),
  updateMovie: (id, data) => api.put(`/movies/${id}`, data),
  deleteMovie: (id) => api.delete(`/movies/${id}`),
};

// Theatres endpoints
export const theatreService = {
  getTheatres: (params) => api.get('/theatres', { params }),
  getTheatreById: (id) => api.get(`/theatres/${id}`),
  createTheatre: (theatreData) => api.post('/theatres', theatreData),
};

// Shows endpoints
export const showService = {
  getShows: (params) => api.get('/shows', { params }),
  getShowById: (id) => api.get(`/shows/${id}`),
  getShowSeats: (id) => api.get(`/shows/${id}/seats`),
  createShow: (showData) => api.post('/shows', showData),
  deleteShow: (id) => api.delete(`/shows/${id}`),
};

// Bookings endpoints
export const bookingService = {
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getMyBookings: () => api.get('/bookings/my'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id, reason) => api.patch(`/bookings/${id}/cancel`, { reason }),
  getAllBookings: () => api.get('/bookings'),
};

export default api;
