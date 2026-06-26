import axios from 'axios';

const api = axios.create({
  baseURL: 'https://postly-6g5f.onrender.com',
  withCredentials: true,
});

export default api;
