import { useState } from "react";
import axios from "axios";
import "./SendUserInvite.css";

const mockTeams = [
  { team_id: 1, name: "Frontend" },
  { team_id: 2, name: "Backend" },
  { team_id: 3, name: "Docs" },
];

export const SendUserInvite = () => {
  const [username, setUsername] = useState("");
  const [teamId, setTeamId] = useState(mockTeams[0].team_id);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ success: null, message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ success: null, message: "" });

    try {
      await axios.post("todonique/url/api/invite", {
        username,
        team_id: teamId,
      });

      setStatus({ success: true, message: `Invite sent to ${username}` });
      setUsername("");
      setTeamId(mockTeams[0].team_id);
    } catch (error) {
      setStatus({
        success: false,
        message: error.response?.data?.message || "Failed to send invite",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="invite-section" aria-labelledby="invite-heading">
      <header>
        <h1 className="title">Send Todo User Invite</h1>
      </header>

      <form className="invite-form" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Invite Details</legend>

          <p>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </p>

          <p>
            <label htmlFor="team">Team</label>
            <select
              id="team"
              name="team"
              value={teamId}
              onChange={(e) => setTeamId(Number(e.target.value))}
            >
              {mockTeams.map((team) => (
                <option key={team.team_id} value={team.team_id}>
                  {team.name}
                </option>
              ))}
            </select>
          </p>

          <p>
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Invite"}
            </button>
          </p>
        </fieldset>
      </form>

      {status.message && (
        <aside role="status" aria-live="polite">
          <p className={`invite-status ${status.success ? "success" : "error"}`}>
            {status.message}
          </p>
        </aside>
      )}
    </section>
  );
};
