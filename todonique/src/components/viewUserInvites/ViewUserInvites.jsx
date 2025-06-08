import { useState, useEffect } from "react";
import "./ViewUserInvites.css";
import { apiRequest } from "../../utils/api";

export default function ViewUserInvites() {
  const [invites, setInvites] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [message, setMessage] = useState("");

  const fetchInvites = async () => {
    try {
      const response = await apiRequest('/invites', {
        method: 'GET',
        auth: true
      });
      setInvites(response || []);
    } catch (error) {
      console.error('Failed to fetch invites:', error);
      setInvites([]);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await apiRequest('/invites/statuses', {
          method: 'GET',
          auth: true
        });
        setStatuses(response || []);
      } catch (error) {
        console.error('Failed to fetch statuses:', error);
        setStatuses([]);
      }
    };
    fetchStatuses();
  }, []);

  const handleRespond = async (id, response) => {
    const matchedStatus = statuses.find((s) => s.statusname === response);
    if (!matchedStatus) {
      setMessage(`Invalid status: ${response}`);
      return;
    }

    try {
      await apiRequest(`/invites`, {
        method: "POST",
        body: { id, status: matchedStatus.id },
        auth: true
      });
      setMessage(`Invite ${id} marked as ${response}`);
    } catch (error) {
      setMessage(`Error responding to invite ${id}: ${error.message}`);
      return;
    }

    // ✅ Re-fetch invites after update
    fetchInvites();
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
          {invites.map(({ id, teamname, invited_by, status, created_at }) => (
            <li key={id} className="invite-card">
              <div className="invite-card__content">
                <p><strong>Team:</strong> {teamname}</p>
                <p><strong>Invited By:</strong> {invited_by}</p>
                <p><strong>Status:</strong> {status}</p>
                <p><strong>Created:</strong> {created_at}</p>
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
