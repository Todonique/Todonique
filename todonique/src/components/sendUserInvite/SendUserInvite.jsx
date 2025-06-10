import { useState, useEffect } from "react";
import "./SendUserInvite.css";
import { apiRequest } from "../../utils/api";

export const SendUserInvite = () => {
  const [username, setUsername] = useState("");
  const [teamId, setTeamId] = useState("");
  const [teams, setTeams] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [status, setStatus] = useState({ success: null, message: "" });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const result = await apiRequest(`/teams/team/teamlead`, {
        method: 'GET',
        auth: true
      });
      setTeams(result || []);
      if (result?.length > 0) {
        setTeamId(result[0].teamId);
      }
    } catch (error) {
      console.error('Failed to fetch teams:', error);
      setStatus({
        success: false,
        message: "Failed to load teams"
      });
    }
  };

  const searchUsers = async (searchText) => {
    if (!searchText.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const result = await apiRequest(`/users/${encodeURIComponent(searchText.trim())}`, {
        method: 'GET',
        body: {
          username: searchText.trim()
        },
        auth: true
      });
      setSearchResults(result || []);
    } catch (error) {
      console.error('Failed to search users:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    setSelectedUser(null);
    
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      searchUsers(value);
    }, 300);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setUsername(user.username);
    setSearchResults([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedUser) {
      setStatus({
        success: false,
        message: "Please select a user from the search results"
      });
      return;
    }

    setLoading(true);
    setStatus({ success: null, message: "" });

    try {
      await apiRequest("/invites/invite", {
        method: 'POST',
        body: {
          teamId: parseInt(teamId),
          invitedeUserId: selectedUser.id,
        },
        auth:true
      });

      setStatus({ 
        success: true, 
        message: `Invite sent to ${selectedUser.username}` 
      });
      setUsername("");
      setSelectedUser(null);
      setSearchResults([]);
      if (teams.length > 0) {
        setTeamId(teams[0].teamId);
      }
    } catch (error) {
      setStatus({
        success: false,
        message: error.message || "Failed to send invite",
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

          <p className="username-field">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={username}
              onChange={handleUsernameChange}
              placeholder="Start typing to search users..."
            />
            
            {searchLoading && (
              <div className="search-loading">Searching...</div>
            )}
            
            {searchResults.length > 0 && (
              <ul className="search-results">
                {searchResults.map((user) => (
                  <li 
                    key={user.id} 
                    onClick={() => handleUserSelect(user)}
                    className="search-result-item"
                  >
                    <strong>{user.username}</strong>
                    {user.email && <span> - {user.email}</span>}
                  </li>
                ))}
              </ul>
            )}
          </p>

          <p>
            <label htmlFor="team">Team</label>
            <select
              id="team"
              name="team"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              required
            >
              <option value="">Select a team</option>
              {teams.map((team) => (
  <option key={team.teamId} value={team.teamId}>
    {team.name}
  </option>
))}
            </select>
          </p>

          <p>
            <button type="submit" disabled={loading || !selectedUser}>
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