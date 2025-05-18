// src/api/apiService.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// ✅ Automatically attach JWT token to each request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// POST: Register user
export const registerUser = (userData) => API.post('/auth/register', userData);

// POST: Login user
export const loginUser = (credentials) => API.post('/auth/login', credentials);

// GET: Fetch user profile
export const getUserProfile = () => API.get('/user/profile');

export const createFarmer = async (data) => {
  const response = await fetch("http://localhost:8080/api/farmers", {
    method: "POST",
    body: data,
  });
  if (!response.ok) {
    throw new Error("Failed to create farmer");
  }
  return response.json();
};

export const updateFarmer = async (id, data) => {
  const response = await fetch(`http://localhost:8080/api/farmers/${id}`, {
    method: "PUT",
    body: data,
  });
  if (!response.ok) {
    throw new Error("Failed to update farmer");
  }
  return response.json();
};

export const getFarmerById = async (id) => {
  const response = await fetch(`http://localhost:8080/api/farmers/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch farmer");
  }
  return response.json();
};
