import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/button/Button";
import Message from "../../components/message/Message";
import Input from "../../components/inputField/Input";
import AuthNav from "../../components/AuthNav/AuthNav";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { apiRequest } from "../../utils/api";

export const setAuthToken = (token) => {
  localStorage.setItem("authToken", token);
};

const PasswordRequirement = ({ met, children }) => (
  <div className={`password-requirement ${met ? 'met' : 'unmet'}`}>
    <span className="requirement-icon">
      {met ? '✓' : '✗'}
    </span>
    {children}
  </div>
);

const useRegister = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ 
    username: "", 
    password: "",
    confirmPassword: "",
    roleId: ""
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      setRolesLoading(true);
      try {
        const result = await apiRequest('/roles?forRegister=true', {
          method: 'GET',
          auth: false
        });
        setRoles(result);
      } catch (error) {
        console.error('Failed to fetch roles:', error);
        setMessage("Failed to load roles. Please try again.");
        setMessageType("error");
      } finally {
        setRolesLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const hasMinLength = (password) => password.length >= 8;
  const hasUpperCase = (password) => /[A-Z]/.test(password);
  const hasLowerCase = (password) => /[a-z]/.test(password);
  const hasSpecialChar = (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const hasNumber = (password) => /\d/.test(password);
  const isNotCommon = (password) => {
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123', 
      'password123', 'admin', 'letmein', 'welcome', '123123'
    ];
    return !commonPasswords.includes(password.toLowerCase());
  };

  const isPasswordValid = (password) => {
    return hasMinLength(password) && 
           hasUpperCase(password) && 
           hasSpecialChar(password) &&
           isNotCommon(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    if (name === 'password') {
      setShowPasswordRequirements(value.length > 0);
    }
    
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
    
    if (!isPasswordValid(form.password)) {
      setMessage("Password does not meet the required criteria.");
      setMessageType("error");
      return false;
    }

    if (!form.confirmPassword.trim()) {
      setMessage("Please confirm your password.");
      setMessageType("error");
      return false;
    }

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return false;
    }

    if (!form.roleId) {
      setMessage("Please select a role.");
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
      const result = await apiRequest('/auth/register', {
        method: 'POST',
        body: {
          username: form.username.trim(),
          password: form.password,
          roleId: parseInt(form.roleId)
        },
        auth: false
      });

      setMessage("Registration successful! Welcome to our platform.");
      setMessageType("success");
      if (result.token) {
        setAuthToken(result.token);
      }
      navigate("/2fa/setup", { 
        state: { username: form.username.trim() }
      });

    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    message,
    messageType,
    isLoading,
    rolesLoading,
    roles,
    showPasswordRequirements,
    handleChange,
    handleSubmit,
    passwordValidation: {
      hasMinLength: hasMinLength(form.password),
      hasUpperCase: hasUpperCase(form.password),
      hasLowerCase: hasLowerCase(form.password),
      hasSpecialChar: hasSpecialChar(form.password),
      hasNumber: hasNumber(form.password),
      isNotCommon: isNotCommon(form.password),
      isValid: isPasswordValid(form.password)
    }
  };
};

const Register = () => {
  const { 
    form, 
    message, 
    messageType, 
    isLoading,
    rolesLoading,
    roles,
    showPasswordRequirements,
    handleChange, 
    handleSubmit,
    passwordValidation
  } = useRegister();

  return (
  <main className="register-container">
    <section className="register-wrapper">
      <header className="register-header">
        <h2 className="register-title">
          Create your account
        </h2>
        <p className="register-subtitle">
          Join us today and get started
        </p>
      </header>
      
      <article className="register-card">
        
        <form onSubmit={handleSubmit} className="form-container">
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
            <label htmlFor="roleId" className="input-label">
              Role
            </label>
            <select
              name="roleId"
              id="roleId"
              value={form.roleId}
              onChange={handleChange}
              disabled={isLoading || rolesLoading}
              required
              className="role-select"
            >
              <option value="">
                {rolesLoading ? "Loading roles..." : "Select a role"}
              </option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.role_name.charAt(0).toUpperCase() + role.role_name.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
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
            
            {showPasswordRequirements && (
              <aside className="password-requirements">
                <h4 className="requirements-title">Password must:</h4>
                <PasswordRequirement met={passwordValidation.hasMinLength}>
                  Have at least 8 characters
                </PasswordRequirement>
                <PasswordRequirement met={passwordValidation.hasUpperCase}>
                  Have at least one capital letter
                </PasswordRequirement>
                <PasswordRequirement met={passwordValidation.hasLowerCase}>
                  Have at least one lower case character
                </PasswordRequirement>
                <PasswordRequirement met={passwordValidation.hasSpecialChar}>
                  Have at least one special character
                </PasswordRequirement>
                <PasswordRequirement met={passwordValidation.hasNumber}>
                  Have at least one number
                </PasswordRequirement>
                <PasswordRequirement met={passwordValidation.isNotCommon}>
                  Not be a common password
                </PasswordRequirement>
              </aside>
            )}
          </section>
          
          <section className="input-group">
            <label htmlFor="confirmPassword" className="input-label">
              Confirm Password
            </label>
            <Input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <output className="password-mismatch">
                Passwords do not match
              </output>
            )}
          </section>
          
          <nav className="auth-link">
            <p>Already have an account? <Link to="/auth/login">Log in</Link></p>
          </nav>
          
          <section className="submit-section">
            <Button 
              type="submit" 
              disabled={isLoading || !passwordValidation.isValid || form.password !== form.confirmPassword || !form.roleId}
            >
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </section>
        </form>
        <Message message={message} type={messageType} />
      </article>
    </section>
  </main>
  );
};

export default Register;