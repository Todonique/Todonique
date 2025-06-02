import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../components/button/Button";
import Message from "../../components/message/Message";
import Input from "../../components/inputField/Input";
import { apiRequest } from "../../utils/api";

const Verify2FA = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { username, secret, qrCode } = location.state || {};

  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if no required data provided
  useEffect(() => {
    if (!username || !secret) {
      navigate("/auth/register");
    }
  }, [username, secret, navigate]);

  const verify2FA = async (e) => {
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
      await apiRequest('/auth/verify-2fa', {
        method: 'POST',
        body: {
          username,
          token: token.trim(),
          secret
        },
        auth: true 
      });

      setMessage("2FA has been successfully activated for your account!");
      setMessageType("success");
      
      setTimeout(() => {
        navigate("/", { 
          state: { message: "Registration and 2FA setup complete! Please log in." }
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

  const goBackToSetup = () => {
    navigate("/auth/setup-2fa", { 
      state: { username }
    });
  };

  const skipSetup = () => {
    navigate("/auth/login", { 
      state: { message: "Registration complete! You can set up 2FA later in your account settings." }
    });
  };

  if (!username || !secret) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="setup-2fa-container">
      <div className="setup-2fa-wrapper">
        <div className="setup-2fa-header">
          <h2 className="setup-2fa-title">
            Verify Your Setup
          </h2>
          <p className="setup-2fa-subtitle">
            Enter the code from your authenticator app
          </p>
        </div>
        
        <div className="setup-2fa-card">
          <div className="verify-step">
            {qrCode && (
              <div className="qr-reminder">
                <p><strong>Reminder:</strong> Make sure you've scanned the QR code with your authenticator app.</p>
                <button 
                  type="button"
                  onClick={goBackToSetup}
                  className="back-button"
                  disabled={isLoading}
                >
                  ← Back to QR Code
                </button>
              </div>
            )}

            <div className="verify-section">
              <h3>Step 2: Verify Setup</h3>
              <p>Enter the 6-digit code from your authenticator app:</p>
              
              <form onSubmit={verify2FA} className="verify-form">
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
                    className="verify-button"
                  >
                    {isLoading ? "Verifying..." : "Verify & Activate"}
                  </Button>
                </div>
              </form>
            </div>

            
          </div>
          
          <Message message={message} type={messageType} />
        </div>
      </div>
    </div>
  );
};

export default Verify2FA;