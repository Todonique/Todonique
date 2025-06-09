import { useState } from "react";
import Input from "../../components/inputField/Input";
import Button from "../../components/button/Button";
import Message from "../../components/message/Message";
import { apiRequest } from "../../utils/api";
import "./Admin.css";


const PasswordRequirement = ({ met, children }) => (
  <div className={`password-requirement ${met ? "met" : "unmet"}`}>
    <span className="requirement-icon">{met ? "✓" : "✗"}</span>
    {children}
  </div>
);

export default function AdminResetPassword() {
  const [user_name, setUserName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const hasMinLength = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const isNotCommon = ![
    "password", "123456", "123456789", "qwerty", "abc123",
    "password123", "admin", "letmein", "welcome", "123123"
  ].includes(newPassword.toLowerCase());

  const isPasswordValid =
    hasMinLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasSpecialChar &&
    hasNumber &&
    isNotCommon;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!isPasswordValid) {
      setMessage("Password does not meet the required criteria.");
      return;
    }

    setLoading(true);
    try {
      await apiRequest("/admin/reset-password", {
        method: "POST",
        body: { user_name, new_password: newPassword },
        auth: true,
      });
      setMessage("Password reset successfully.");
      setUserName("");
      setNewPassword("");
    } catch {
      setMessage("Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="admin-panel">
      <h1 className="title">Reset User Password</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <label htmlFor="username">Username</label>
        <Input
          type="text"
          name="username"
          id="username"
          value={user_name}
          onChange={(e) => setUserName(e.target.value)}
          disabled={loading}
          required
        />

        <label htmlFor="newPassword">New Password</label>
        <Input
          type="password"
          name="newPassword"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={loading}
          required
        />

        {newPassword && (
          <aside className="password-requirements">
            <h4 className="requirements-title">Password must:</h4>
            <PasswordRequirement met={hasMinLength}>
              Have at least 8 characters
            </PasswordRequirement>
            <PasswordRequirement met={hasUpperCase}>
              Have at least one capital letter
            </PasswordRequirement>
            <PasswordRequirement met={hasLowerCase}>
              Have at least one lower case character
            </PasswordRequirement>
            <PasswordRequirement met={hasSpecialChar}>
              Have at least one special character
            </PasswordRequirement>
            <PasswordRequirement met={hasNumber}>
              Have at least one number
            </PasswordRequirement>
            <PasswordRequirement met={isNotCommon}>
              Not be a common password
            </PasswordRequirement>
          </aside>
        )}

        <Button type="submit" disabled={loading || !isPasswordValid}>
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>

      <Message message={message} type={message.includes("successfully") ? "success" : "error"} />
    </section>
  );
}
