// localStorage utility functions

export const storage = {
  // Get user from localStorage
  getUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error reading user from localStorage:', error);
      return null;
    }
  },

  // Save user to localStorage
  setUser: (userData) => {
    try {
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
      return false;
    }
  },

  // Remove user from localStorage
  removeUser: () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken'); // ✅ Also remove refresh token
      localStorage.removeItem('refreshTokenExpiry'); // ✅ Remove expiry
      return true;
    } catch (error) {
      console.error('Error removing user from localStorage:', error);
      return false;
    }
  },

  // Get access token from user
  getToken: () => {
    const user = storage.getUser();
    return user?.token || null;
  },

  // ✅ NEW: Get refresh token
  getRefreshToken: () => {
    try {
      return localStorage.getItem('refreshToken');
    } catch (error) {
      console.error('Error reading refresh token:', error);
      return null;
    }
  },

  // ✅ NEW: Set refresh token
  setRefreshToken: (refreshToken, expiry) => {
    try {
      localStorage.setItem('refreshToken', refreshToken);
      if (expiry) {
        localStorage.setItem('refreshTokenExpiry', expiry);
      }
      return true;
    } catch (error) {
      console.error('Error saving refresh token:', error);
      return false;
    }
  },

  // ✅ NEW: Check if refresh token is expired
  isRefreshTokenExpired: () => {
    try {
      const expiry = localStorage.getItem('refreshTokenExpiry');
      if (!expiry) return true;
      return new Date() > new Date(expiry);
    } catch (error) {
      return true;
    }
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return storage.getUser() !== null;
  },

  // Check if user is admin
  isAdmin: () => {
    const user = storage.getUser();
    return user?.role === 'admin';
  }
};
