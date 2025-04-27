import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export const registerUser = (userData) => {
  return axios.post(`${API_BASE_URL}/auth/register`, userData);
};

// Example login API added user
export const loginUser = (credentials) => {
  return axios.post(`${API_BASE_URL}/auth/login`, credentials);
};

// Fetch profile (secured endpoint)
export const getUserProfile = (token) => {
  return axios.get(`${API_BASE_URL}/user/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
