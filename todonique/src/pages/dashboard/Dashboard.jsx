import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

// Mock team data
const teams = [
  {
    team_id: 1,
    name: 'Engineering',
    team_lead: 'Alice Johnson',
    created_at: '2024-01-15',
  },
  {
    team_id: 2,
    name: 'Marketing',
    team_lead: 'Bob Smith',
    created_at: '2024-03-22',
  },
  {
    team_id: 3,
    name: 'Product Design',
    team_lead: 'Carla Gomez',
    created_at: '2023-11-02',
  },
  {
    team_id: 4,
    name: 'QA Team',
    team_lead: 'Daniel White',
    created_at: '2024-02-18',
  },
];
const Dashboard = () => {
  const navigate = useNavigate();

  const handleTeamClick = (teamId) => {
    navigate(`/teams/${teamId}/todos`);
  };

  return (
    <main className="dashboard">
      <header>
        <h1 className="dashboard__title">Teams</h1>
      </header>

      <section className="dashboard__grid">
        {teams.map((team) => (
          <article
            key={team.team_id}
            className="team-card"
            onClick={() => handleTeamClick(team.team_id)}
            role="button"
            tabIndex="0"
            onKeyDown={(e) => e.key === 'Enter' && handleTeamClick(team.team_id)}
          >
            <header>
              <h2 className="team-card__name">{team.name}</h2>
            </header>
            <p className="team-card__lead"><strong>Lead:</strong> {team.team_lead}</p>
            <p className="team-card__date"><strong>Created:</strong> {new Date(team.created_at).toLocaleDateString()}</p>
          </article>
        ))}
      </section>
    </main>
  );
};

export default Dashboard;
