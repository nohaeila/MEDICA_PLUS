import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.31.33.64:5000/api',
});

export default api;