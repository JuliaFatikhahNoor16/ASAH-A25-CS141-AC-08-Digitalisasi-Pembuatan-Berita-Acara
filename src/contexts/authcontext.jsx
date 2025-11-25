import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const isLogin = localStorage.getItem('isLogin');
    const role = localStorage.getItem('userRole');
    const email = localStorage.getItem('userEmail');

    if (isLogin === 'true' && role && email) {
      setIsAuthenticated(true);
      setUserRole(role);
      setUserEmail(email);
    }
  }, []);

  const login = (role, email) => {
    localStorage.setItem('isLogin', 'true');
    localStorage.setItem('userRole', role);
    localStorage.setItem('userEmail', email);
    setIsAuthenticated(true);
    setUserRole(role);
    setUserEmail(email);
  };

  const logout = () => {
    localStorage.removeItem('isLogin');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setUserRole(null);
    setUserEmail(null);
  };

  const value = {
    isAuthenticated,
    userRole,
    userEmail,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};