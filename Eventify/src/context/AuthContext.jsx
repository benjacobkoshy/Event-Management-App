import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null); // Add state for refresh token
  const [role, setRole] = useState(null);

  // Axios instance for API requests
  const axiosInstance = axios.create({
    baseURL: 'http://192.168.189.32:8000', // Replace with your API base URL
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Axios interceptor to include the token in requests
  axiosInstance.interceptors.request.use(
    async (config) => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Refresh the access token using the refresh token
  const refreshAccessToken = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token found');

      const response = await axios.post('http://192.168.189.32:8000/auth/token/refresh/', {
        refresh: refreshToken,
      });

      const newAccessToken = response.data.access;
      setUserToken(newAccessToken);
      await AsyncStorage.setItem('userToken', newAccessToken);

      return newAccessToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      logout(); // Log out the user if the refresh fails
    }
  };

  // Interceptor for handling 401 responses and refreshing the token
  axiosInstance.interceptors.response.use(
    (response) => response, // If response is successful, return it
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Mark request as retried
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          axios.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest); // Retry the original request
        }
      }
      return Promise.reject(error);
    }
  );

  // Login function with access and refresh tokens
  const login = async (accessToken, refreshToken, role) => {
    setIsLoading(true);

    if (!accessToken || !refreshToken || !role) {
      console.error('Access token, refresh token, and role are required for login');
      setIsLoading(false);
      return;
    }

    setUserToken(accessToken);
    setRefreshToken(refreshToken);
    setRole(role);

    try {
      await AsyncStorage.setItem('userToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken); // Save the refresh token
      await AsyncStorage.setItem('role', role);
    } catch (error) {
      console.error('Failed to save tokens to AsyncStorage', error);
    }

    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    setUserToken(null);
    setRefreshToken(null);
    setRole(null);
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('refreshToken'); // Clear the refresh token
      await AsyncStorage.removeItem('role');
    } catch (error) {
      console.error('Error clearing AsyncStorage', error);
    }
    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const refresh = await AsyncStorage.getItem('refreshToken'); // Retrieve refresh token
      const savedRole = await AsyncStorage.getItem('role');

      if (token && refresh) {
        setUserToken(token);
        setRefreshToken(refresh);
        setRole(savedRole);
      }
    } catch (error) {
      console.error('Error checking login status', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        axiosInstance, // Provide the Axios instance
        userToken,
        isLoading,
        role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
