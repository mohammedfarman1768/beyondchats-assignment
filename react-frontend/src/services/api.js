import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: `${API_BASE}/api`, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const articlesAPI = {
  getAll: async () => {
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