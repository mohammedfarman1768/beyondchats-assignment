import axios from 'axios';

// Get the backend URL from environment variables
// This ensures the frontend talks to https://beyondchats-api-k93h.onrender.com
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  // Adding /api here so all calls automatically start with the correct path
  baseURL: `${API_BASE}/api`, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const articlesAPI = {
  getAll: async () => {
    // This will now correctly call: https://beyondchats-api-k93h.onrender.com/api/articles...
    const response = await api.get('/articles?with_updated=1&with_original=1');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/articles/${id}`);
    return response.data;
  },

  create: async (articleData) => {
    const response = await api.post('/articles', articleData);
    return response.data;
  },

  update: async (id, articleData) => {
    const response = await api.put(`/articles/${id}`, articleData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/articles/${id}`);
    return response.data;
  },

  getLatest: async () => {
    const response = await api.get('/articles/latest');
    return response.data;
  }
};

export default api;