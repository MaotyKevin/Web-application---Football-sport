import axios from 'axios';

const API_BASE_URL = 'http://192.165.18.122:8080'; 
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

const apiEndpoints = {
  get: '/ligue',
  post: '/ligue',
  delete: (ligue_id) => `/ligue/${ligue_id}`,
  put: (ligue_id) => `/ligue/${ligue_id}`,
};

const apiService = {
  get: () => api.get(apiEndpoints.get),

  post: (newLigue) => api.post(apiEndpoints.post, { ligue_nom: newLigue }),

  delete: (ligue_id) => api.delete(apiEndpoints.delete(ligue_id)),

  put: (ligue_id, updatedLigueName) => api.put(apiEndpoints.put(ligue_id), { ligue_nom: updatedLigueName }),
};

export default apiService;
