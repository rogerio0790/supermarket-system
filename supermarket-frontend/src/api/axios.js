import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',  // Changed from 127.0.0.1
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;