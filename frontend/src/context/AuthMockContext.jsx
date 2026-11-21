import React, { createContext, useContext, useState } from 'react';
import { mockUsers } from '../data/mockData';

const AuthMockContext = createContext();

export const AuthMockProvider = ({ children }) => {
  // Initial demo user: MEMBER
  const [currentUser, setCurrentUser] = useState(mockUsers.member);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const switchRole = (role) => {
    if (role === 'MEMBER') {
      setCurrentUser(mockUsers.member);
      setIsAuthenticated(true);
    } else if (role === 'TRAINER') {
      setCurrentUser(mockUsers.trainer);
      setIsAuthenticated(true);
    } else if (role === 'GYM_OWNER') {
      setCurrentUser(mockUsers.owner);
      setIsAuthenticated(true);
    } else {
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
  };

  const login = (role = 'MEMBER') => {
    switchRole(role);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthMockContext.Provider value={{ currentUser, isAuthenticated, currentRole: currentUser?.role || 'GUEST', switchRole, login, logout }}>
      {children}
    </AuthMockContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthMockContext);
  if (!context) throw new Error('useAuth must be used within an AuthMockProvider');
  return context;
};
