import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../components/button/Button";
import Message from "../../components/message/Message";
import Input from "../../components/inputField/Input";
import { apiRequest } from "../../utils/api";
import "./Setup2FA.css";

const Setup2FA = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const user = location.state?.user || location.state?.username || undefined;

  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialSetup, setIsInitialSetup] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth/register");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      generateQRCode();
    }
  }, [user]);

  const generateQRCode = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const result = await apiRequest('/auth/setup-2fa', {
        method: 'POST',
        body: { username: user.username || user },
      });

      setQrCode(result.qrCode);
      setSecret(result.secret);
      setMessage("Scan the QR code with your authenticator app, then enter the verification code below.");
      setMessageType("info");
      setIsInitialSetup(false);

    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token.trim()) {
      setMessage("Please enter the 6-digit code from your authenticator app.");
      setMessageType("error");
      return;
    }

    if (token.length !== 6) {
      setMessage("Code must be exactly 6 digits.");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      await apiRequest('/auth/setup-2fa', {
        method: 'POST',
        body: {
          username: user.username || user,
          token: token.trim(),
          secret
        },
      });

      setMessage("2FA has been successfully activated for your account!");
      setMessageType("success");
      
      setTimeout(() => {
        
        navigate("/", { 
          state: { user: "Registration and 2FA setup complete! Please log in." }
        });
      }, 2000);

    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenChange = (e) => {
    // Only allow numbers and limit to 6 digits
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setToken(value);
    
    // Clear message when user starts typing
    if (message && messageType === "error") {
      setMessage("");
    }
  };

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="setup-2fa-container">
      <div className="setup-2fa-wrapper">
        <div className="setup-2fa-header">
          <h2 className="setup-2fa-title">
            Secure Your Account
          </h2>
          <p className="setup-2fa-subtitle">
            Set up two-factor authentication for enhanced security
          </p>
        </div>
        
        <div className="setup-2fa-card">
          {isInitialSetup && isLoading ? (
            <div className="setup-step">
              <div className="loading-container">
                <p>Setting up 2FA for your account...</p>
                <div className="spinner"></div>
              </div>
            </div>
          ) : (
            <div className="setup-content">
              <div className="qr-section">
                <h3>Step 1: Scan QR Code</h3>
                <p>Use your authenticator app (Google Authenticator, Authy, etc.) to scan this QR code:</p>
                
                {qrCode && (
                  <div className="qr-code-container">
                    <img src={qrCode} alt="2FA QR Code" className="qr-code" />
                  </div>
                )}
                
                <div className="manual-entry">
                  <p><strong>Manual entry key:</strong></p>
                  <code className="secret-key">{secret}</code>
                </div>
              </div>

              <div className="verify-section">
                <h3>Step 2: Verify Setup</h3>
                <p>Enter the 6-digit code from your authenticator app:</p>
                
                <form onSubmit={handleSubmit} className="verify-form">
                  <div className="input-group">
                    <Input
                      type="text"
                      name="token"
                      id="token"
                      value={token}
                      onChange={handleTokenChange}
                      placeholder="000000"
                      disabled={isLoading}
                      maxLength={6}
                      className="token-input"
                      autoComplete="one-time-code"
                      required
                      autoFocus
                    />
                  </div>
                  
                  <div className="button-group">
                    <Button 
                      type="submit" 
                      disabled={isLoading || token.length !== 6}
                      className="setup-button"
                    >
                      {isLoading ? "Activating..." : "Activate 2FA"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          <Message message={message} type={messageType} />
        </div>
      </div>
    </div>
  );
};

export default Setup2FA;