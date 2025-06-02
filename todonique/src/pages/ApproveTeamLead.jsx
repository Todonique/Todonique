import React, { useState } from "react";

export default function ApproveTeamLead() {
  const [teamLeadUsername, setTeamLeadUsername] = useState("");
  const [approvedLeads, setApprovedLeads] = useState([]);
  const [message, setMessage] = useState("");

  const handleApprove = (e) => {
    e.preventDefault();
    if (teamLeadUsername) {
      setApprovedLeads((prev) => [...prev, teamLeadUsername]);
      setMessage(`${teamLeadUsername} has been approved as a team lead.`);
      setTeamLeadUsername("");
    }
  };

  return (
    <section>
      <h2>Approve Team Lead Request</h2>
      <form onSubmit={handleApprove}>
        <label htmlFor="teamLeadUsername">Username</label>
        <input
          id="teamLeadUsername"
          name="teamLeadUsername"
          type="text"
          value={teamLeadUsername}
          onChange={(e) => setTeamLeadUsername(e.target.value)}
          required
        />
        <button type="submit">Approve</button>
      </form>

      {message && <p>{message}</p>}

      <section>
        <h3>Approved Team Leads</h3>
        <ul>
          {approvedLeads.map((lead, idx) => (
            <li key={idx}>{lead}</li>
          ))}
        </ul>
      </section>
    </section>
  );
}