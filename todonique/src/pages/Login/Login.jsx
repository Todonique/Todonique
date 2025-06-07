import React, { useState } from "react";
import Button from "../../components/button/Button";
import Message from "../../components/message/Message";
import Input from "../../components/inputField/Input";
import AuthNav from "../../components/AuthNav/AuthNav";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { apiRequest } from "../../utils/api";

export const setAuthToken = (token) => {
  localStorage.setItem("authToken", token);
};

export const getAuthToken = () => {
  return localStorage.getItem("authToken");;
};

export const clearAuthToken = () => {
  localStorage.removeItem("authToken");
};

const useLogin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ 
    username: "", 
    password: "",
    token: "" // For 2FA token
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [isLoading, setIsLoading] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear message when user starts typing
    if (message) {
      setMessage("");
    }
  };

  const validateForm = () => {
    if (!form.username.trim()) {
      setMessage("Username is required.");
      setMessageType("error");
      return false;
    }
    
    if (!form.password.trim()) {
      setMessage("Password is required.");
      setMessageType("error");
      return false;
    }

    if (requires2FA && !form.token.trim()) {
      setMessage("2FA token is required.");
      setMessageType("error");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const requestBody = {
        username: form.username.trim(),
        password: form.password
      };

      if (requires2FA && form.token.trim()) {
        requestBody.token = form.token.trim();
      }

      const result = await apiRequest('/auth/login', {
        method: 'POST',
        body: requestBody,
        auth: false
      });

      if (result.requires2FA) {
        setRequires2FA(true);
        setUserInfo(result.user);
        setMessage(result.message || "Please enter your 2FA token to continue.");
        setMessageType("info");
      } else {
        setMessage(result.message || "Login successful! Welcome back.");
        setMessageType("success");
        
        if (result.token) {
          setAuthToken(result.token);
        }
        if(result.user.has2FA){
          navigate("/2fa/verify", { 
            state: { user: result.user }
          });
        } else {
          navigate("/2fa/setup", { 
            state: { user: result.user }
          });
        }
        
      }

    } catch (error) {
      setMessage(error.message || "Login failed. Please try again.");
      setMessageType("error");
      // Reset 2FA state on error
      setRequires2FA(false);
      setUserInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setRequires2FA(false);
    setUserInfo(null);
    setForm({ ...form, token: "" });
    setMessage("");
  };

  return {
    form,
    message,
    messageType,
    isLoading,
    requires2FA,
    userInfo,
    handleChange,
    handleSubmit,
    handleBackToLogin
  };
};

const Login = () => {
  const { 
    form, 
    message, 
    messageType, 
    isLoading,
    requires2FA,
    userInfo,
    handleChange, 
    handleSubmit,
    handleBackToLogin
  } = useLogin();

  return (
    <main className="login-container">
  <section className="login-wrapper">
    <header className="login-header">
      <h2 className="login-title">
        {requires2FA ? "Two-Factor Authentication" : "Sign in to your account"}
      </h2>
      <p className="login-subtitle">
        {requires2FA 
          ? `Enter the 6-digit code from your authenticator app for ${userInfo?.username}`
          : "Welcome back! Please sign in to continue"
        }
      </p>
    </header>
    <article className="login-card">
      <form onSubmit={handleSubmit} className="form-container">
        {!requires2FA ? (
          <>
            <section className="input-group">
              <label htmlFor="username" className="input-label">
                Username
              </label>
              <Input
                type="text"
                name="username"
                id="username"
                value={form.username}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </section>
            
            <section className="input-group">
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <Input
                type="password"
                name="password"
                id="password"
                value={form.password}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </section>
          </>
        ) : (
          <section className="input-group">
            <label htmlFor="token" className="input-label">
              2FA Token
            </label>
            <Input
              type="text"
              name="token"
              id="token"
              value={form.token}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Enter 6-digit code"
              maxLength="6"
              required
            />
          </section>
        )}
        <nav className="auth-link">
          <p>Dont have an account? <Link to="/auth/register">Sign up</Link></p>
        </nav>
        <section className="submit-section">
          <Button 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading 
              ? (requires2FA ? "Verifying..." : "Signing in...") 
              : (requires2FA ? "Verify" : "Sign In")
            }
          </Button>
          
          {requires2FA && (
            <Button 
              type="button" 
              onClick={handleBackToLogin}
              disabled={isLoading}
              style={{ marginTop: '10px', background: 'transparent', color: '#666' }}
            >
              Back to Login
            </Button>
          )}
        </section>
      </form>
      
      <Message message={message} type={messageType} />
    </article>
  </section>
</main>
  );
};

export default Login;