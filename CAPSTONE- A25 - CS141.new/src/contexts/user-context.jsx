import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const response = await profileAPI.getProfile();
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (data) => {
    try {
      const response = await profileAPI.updateProfile(data);
      setUser(response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.response?.data?.message || 'Update failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{
      user,
      loading,
      updateUserProfile,
      fetchUserProfile,
      logout
    }}>
      {children}
    </UserContext.Provider>
  );
};
