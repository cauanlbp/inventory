const API_BASE_URL = 'http://localhost:5000/api';

export default {
  machines: {
    getAll: () => `${API_BASE_URL}/machines`,
    getById: (id) => `${API_BASE_URL}/machines/${id}`,
    create: () => `${API_BASE_URL}/machines`,
    update: (id) => `${API_BASE_URL}/machines/${id}`,
    delete: (id) => `${API_BASE_URL}/machines/${id}`
  },
  chips: {
    getAll: () => `${API_BASE_URL}/chips`,
    getById: (id) => `${API_BASE_URL}/chips/${id}`,
    create: () => `${API_BASE_URL}/chips`,
    update: (id) => `${API_BASE_URL}/chips/${id}`,
    delete: (id) => `${API_BASE_URL}/chips/${id}`,
  },
  telsystems: {
    getAll: () => `${API_BASE_URL}/telsystems`,
    getById: (id) => `${API_BASE_URL}/telsystems/${id}`,
    create: () => `${API_BASE_URL}/telsystems`,
    update: (id) => `${API_BASE_URL}/telsystems/${id}`,
    delete: (id) => `${API_BASE_URL}/telsystems/${id}`,
  }
};
