// context/AuthContext.jsx - JWT-based auth context
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const isValidJWT = (token) => {
  if (!token) return false;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Invalid JWT format:", error);
    return false;
  }
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("authToken");
        
        if (token && isValidJWT(token)) {
          // Decode token to get user info
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUser(payload);
          setIsAuthenticated(true);
        } else {
          // Token is invalid or expired, remove it
          localStorage.removeItem("authToken");
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Optional: Set up token expiration check interval
    const interval = setInterval(() => {
      const token = localStorage.getItem("authToken");
      if (token && !isValidJWT(token)) {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        setUser(null);
        // Optionally redirect to login or show notification
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const setAuthToken = (token) => {
    if (isValidJWT(token)) {
      localStorage.setItem("authToken", token);
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      loading,
      user,
      setAuthToken,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};