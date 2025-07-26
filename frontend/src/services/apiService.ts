import api from '../utils/axiosInstance';

// 🔐 Login user
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    console.error('Login Error:', error);
    throw new Error(error?.response?.data?.message || 'Login failed');
  }
};

// 🆕 Signup user
export const signupUser = async (name: string, email: string, password: string) => {
  try {
    const response = await api.post('/auth/signup', {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    console.error('Signup Error:', error);
    throw new Error(error?.response?.data?.message || 'Signup failed');
  }
};

// 👤 Fetch logged-in user's profile
export const fetchUser = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error: any) {
    console.error('Fetch User Error:', error);
    throw new Error(error?.response?.data?.message || 'Failed to fetch user profile');
  }
};

// 🚪 Logout user
export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error: any) {
    console.error('Logout Error:', error);
    throw new Error(error?.response?.data?.message || 'Logout failed');
  }
};

// ♻️ Refresh access token (If using httpOnly cookies)
export const refreshAccessToken = async () => {
  try {
    const response = await api.post('/auth/refresh-token', {}, { withCredentials: true });
    return response.data; // should contain new access token
  } catch (error: any) {
    console.error('Token Refresh Error (cookie-based):', error);
    throw new Error(error?.response?.data?.message || 'Token refresh failed');
  }
};

// ❗Less secure: If refresh token is sent in body (from localStorage)
export const refreshAccessTokenWithBody = async (refreshToken: string) => {
  try {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    return response.data; // should contain new access token
  } catch (error: any) {
    console.error('Token Refresh Error (body-based):', error);
    throw new Error(error?.response?.data?.message || 'Token refresh failed');
  }
};

// 💬 Chat with bot (updated to your backend's endpoint)
export const chatWithBot = async (payload: { question: string }) => {
  try {
    const response = await api.post('/chat', payload); // maps to http://localhost:8000/chat
    return response.data;
  } catch (error: any) {
    console.error('Chat Error:', error);
    throw new Error(error?.response?.data?.message || 'Chat request failed');
  }
};
