import axios from 'axios';

// ✅ Backend URL from environment variable (.env)
// Using Vite's environment variables for flexibility
const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

// ✅ Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,        // Use the correct backend URL
  withCredentials: true,        // Send cookies/auth headers with each request
});

// ✅ Get token from localStorage
const getAuthToken = (): string | null => localStorage.getItem('token');

// ✅ Auth headers for protected requests
const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getAuthToken()}`, // Attach the token from localStorage
  },
});

// ✅ SIGNUP user
export const signupUser = async (name: string, email: string, password: string) => {
  try {
    const response = await api.post('/auth/signup', { name, email, password });
    return response.data;
  } catch (error: any) {
    console.error('Signup Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Signup failed');
  }
};

// ✅ LOGIN user
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });

    // Save token to localStorage (if backend returns it)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }

    return response.data;
  } catch (error: any) {
    console.error('Login Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

// ✅ GET user profile (protected route)
export const getProfile = async () => {
  try {
    const response = await api.get('/user/profile', authHeaders()); // ✅ Cleaned URL
    return response.data;
  } catch (error: any) {
    console.error('Profile fetch error:', error.response?.data || error.message);
    throw new Error('Failed to fetch profile');
  }
};

// ✅ LOGOUT user
export const logoutUser = () => {
  localStorage.removeItem('token'); // Clear token from localStorage on logout
};
