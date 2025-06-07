import React, { useState } from "react";

export default function ResetPassword() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username) {
      setMessage(`Password reset link sent to user: ${username}`);
      setUsername("");
    }
  };

  return (
    <section>
      <h2>Reset User Password</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </section>
  );
}
