import axios from 'axios';

const API_BASE = 'http://localhost:8080';

export const registerUser = async (userData) => {
    try {
      const response = await axios.post(`${API_BASE}/register`, userData);
      return response.data; // Should include token and user info
    } catch (error) {
      throw error.response?.data || "Registration failed";
    }
  };

  export const loginUser = async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE}/login`, credentials);
      return response.data; // Should return token or user info
    } catch (error) {
      throw error.response?.data || "Login failed";
    }
  };

