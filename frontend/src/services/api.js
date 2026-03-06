import axios from 'axios';


const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('darshanease_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('darshanease_token');
      localStorage.removeItem('darshanease_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};


export const templeAPI = {
  getAll: () => api.get('/temples'),
  getOne: (id) => api.get(`/temples/${id}`),
  create: (data) => api.post('/temples', data),
  update: (id, data) => api.put(`/temples/${id}`, data),
  delete: (id) => api.delete(`/temples/${id}`),
};

export const slotAPI = {
  getByTemple: (templeId) => api.get(`/slots?templeId=${templeId}`),
  create: (data) => api.post('/slots', data),
  delete: (id) => api.delete(`/slots/${id}`),
};


export const bookingAPI = {
  book: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my'),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  getAll: () => api.get('/bookings'),
};


export const donationAPI = {
  donate: (data) => api.post('/donations', data),
  getMy: () => api.get('/donations/my'),
  getAll: () => api.get('/donations'),
};

export default api;