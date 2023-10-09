import React, { createContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { onAuthStateChanged, auth } from 'firebase/auth';
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const checkLoginStatus = async () => {
    onAuthStateChanged(auth, (user) => {
      console.log('User:', user);
      if (user) {
        setUser({ email: user.email });
      } else {
        setUser(null);
      }
    });
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  // other authentication methods: login, logout, etc.

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };