import { useState, useEffect } from "react";
import "./ViewSentInvites.css";
import { apiRequest } from "../../utils/api";

export default function ViewSentInvites() {
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

  const handleRespond = async (id, response) => {
    // This is a placeholder for an API call to respond to an invite.
    // In a real application, you would replace this with a call to your backend service,
    // passing the invite ID and response (e.g., "accepted" or "declined") as parameters.
    // Example:
    try {
      await apiRequest(`/invites/${id}/respond`, {
        method: "POST",
        body: { response },
        // auth: true,
      });
      setMessage(`Invite ${id} marked as ${response}`);
    } catch (error) {
      setMessage(`Error responding to invite ${id}: ${error.message}`);
      return;
    }
    setInvites((prev) =>
      prev.map((invite) =>
        invite.id === id ? { ...invite, status: response } : invite
      )
    );
  };

  return (
    <section className="view-user-invites">
      <header className="view-user-invites__header">
        <h1 className="view-user-invites__title">Team Invites</h1>
      </header>
   
      {invites.length === 0 ? (
        <p>No invites available.</p>
      ) : (
        <ul className="invite-list">
  {invites.map(({ id, teamName, invitedBy, status, createdAt }) => (
    <li key={id} className="invite-card">
      <div className="invite-card__content">
        <p><strong>Team:</strong> {teamName}</p>
        <p><strong>Invited By:</strong> {invitedBy}</p>
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Created:</strong> {createdAt}</p>
      </div>
      {status === "pending" && (
        <div className="invite-card__actions">
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
