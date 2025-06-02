import React, { useState, useEffect } from "react";

export default function ViewInvites() {
  const [invites, setInvites] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Mock data fetch
    const mockInvites = [
      {
        id: 1,
        teamName: "Frontend Wizards",
        invitedBy: "alice",
        status: "pending",
        createdAt: "2025-05-30",
      },
      {
        id: 2,
        teamName: "Backend Gurus",
        invitedBy: "bob",
        status: "accepted",
        createdAt: "2025-05-28",
      },
    ];
    setInvites(mockInvites);
  }, []);

  const handleRespond = (id, response) => {
    setInvites((prev) =>
      prev.map((invite) =>
        invite.id === id ? { ...invite, status: response } : invite
      )
    );
    setMessage(`Invite ${id} marked as ${response}`);
  };

  return (
    <section>
      <h2>Team Invites</h2>
      {invites.length === 0 ? (
        <p>No invites available.</p>
      ) : (
        <ul>
          {invites.map(({ id, teamName, invitedBy, status, createdAt }) => (
            <li key={id}>
              <p>
                <strong>Team:</strong> {teamName}<br />
                <strong>Invited By:</strong> {invitedBy}<br />
                <strong>Status:</strong> {status}<br />
                <strong>Created:</strong> {createdAt}
              </p>
              {status === "pending" && (
                <div>
                  <button onClick={() => handleRespond(id, "accepted")}>Accept</button>
                  <button onClick={() => handleRespond(id, "declined")}>Decline</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      {message && <p>{message}</p>}
    </section>
  );
}
