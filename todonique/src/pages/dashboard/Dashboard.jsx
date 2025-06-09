import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { apiRequest } from '../../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleTeamClick = (teamId, teamName) => {
    navigate(`/teams/${teamId}/todos?name=${encodeURIComponent(teamName)}`);
  };

  const fetchTeams = async () => {
    try {
      const result = await apiRequest(`/teams/teams`, {
        method: 'GET',
        auth: true,
      });
      setTeams(result);
    } catch (error) {
      console.error("Error fetching teams:", error);
      // TODO Handle error
    };
    // Loading state
  };
  

  return (
    <main className="dashboard">
      <header className='dashboard__header'>
        <h1 className="dashboard__title">Teams</h1>
      </header>

      {teams && teams.length > 0 ? (

      <section className="dashboard__grid">
        {teams.map((team) => (
          <article
            key={team.teamId}
            className="team-card"
            onClick={() => handleTeamClick(team.teamId, team.name)}
            role="button"
            tabIndex="0"
            onKeyDown={(e) => e.key === 'Enter' && handleTeamClick(team.teamId, team.name)}
          >
            <header>
              <h2 className="team-card__name">{team.name}</h2>
            </header>
            <p className="team-card__lead"><strong>Lead:</strong> {team.teamLeadName}</p>
            <p className="team-card__date"><strong>Created:</strong> {new Date(team.createdAt).toLocaleDateString()}</p>
          </article>
        ))}
      </section>
      ) : (
        <p className="dashboard__no-teams">No teams available.</p>
      )}
    </main>
  );
};

export default Dashboard;
