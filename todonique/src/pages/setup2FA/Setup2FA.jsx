import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../components/button/Button";
import Message from "../../components/message/Message";
import { apiRequest } from "../../utils/api";
import "./Setup2FA.css";

const Setup2FA = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const user = location.state?.user;
  console.log("Username from location state:", user.username);

  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("Username from state:", user);
    if (!user) {
      navigate("/auth/register");
    }
  }, [user, navigate]);

  // Auto-setup 2FA when component mounts
  useEffect(() => {
    if (user) {
      setup2FA();
    }
  }, [user]);

  const setup2FA = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const result = await apiRequest('/auth/setup-2fa', {
        method: 'POST',
        body: { username: user.username },
      });

      setQrCode(result.qrCode);
      setSecret(result.secret);
      setMessage("Scan the QR code with your authenticator app, then proceed to verification.");
      setMessageType("info");

    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const proceedToVerification = () => {
    navigate("/2fa/verify", { 
      state: { 
        username: user.username,
        secret,
        qrCode 
      }
    });
  };

  const skipSetup = () => {
    navigate("/auth/login", { 
      state: { message: "Registration complete! You can set up 2FA later in your account settings." }
    });
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
          {isLoading ? (
            <div className="setup-step">
              <div className="loading-container">
                <p>Setting up 2FA for your account...</p>
                <div className="spinner"></div>
              </div>
            </div>
          ) : (
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

              <div className="button-group">
                <Button 
                  onClick={proceedToVerification}
                  disabled={!qrCode || !secret}
                  className="proceed-button"
                >
                  Proceed to Verification
                </Button>
              </div>

              <div className="skip-section">
                <button 
                  type="button"
                  onClick={skipSetup}
                  className="skip-button"
                >
                  Skip for now (set up later)
                </button>
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