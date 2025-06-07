import React, { useState } from "react";

export default function SetupMFA() {
  const [secret, setSecret] = useState("ABC123DEF456"); // Mock secret
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code === "123456") {
      setStatus("MFA successfully set up!");
    } else {
      setStatus("Invalid code. Please try again.");
    }
  };

  return (
    <section>
      <h2>Set Up Multi-Factor Authentication (MFA)</h2>

      <p><strong>Your secret key:</strong> {secret}</p>
      <p>
        Use this key in your authenticator app (e.g., Google Authenticator or Authy).
        Then enter the code below to verify setup.
      </p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="code">Authenticator Code</label>
        <input
          type="text"
          id="code"
          name="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button type="submit">Verify</button>
      </form>

      {status && <p>{status}</p>}
    </section>
  );
}