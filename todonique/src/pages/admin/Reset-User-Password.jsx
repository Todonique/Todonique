import { useState } from "react";
import { apiRequest } from "../../utils/api";
import "./Admin.css";

export default function AdminResetPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await apiRequest("/admin/reset-password", {
        method: "POST",
        body: { email, new_password: newPassword },
      });
      setMessage("Password reset successfully.");
      setEmail("");
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
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </section>
  );
}
