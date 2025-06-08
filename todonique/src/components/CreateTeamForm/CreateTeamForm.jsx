import { useState } from "react";
import "./CreateTeamForm.css";
import { apiRequest } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

const CreateTeamForm = () => {
    const navigate = useNavigate();
    const [teamName, setTeamName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await apiRequest('/teams/team', {
                method: 'POST',
                body: { name: teamName.trim() },
                auth: true,
            });
            setTeamName("");
            toast.success('Successfuly created team.', {
                position: "bottom-right",
                autoClose: 4000,
                closeOnClick: true,
                draggable: false
            });
        } catch (error) {
            toast.error(`Error creating team. ${error}`, {
                position: "bottom-right",
                autoClose: 4000,
                closeOnClick: true,
                draggable: false
            });
        } finally {
            setIsSubmitting(false);
        };
    };
    
    const handleCancel = () => {
        navigate('/');
    };

  return (
    <form className="create-team-form" onSubmit={handleSubmit}>
      <h1 className="form-title">Create a New Team</h1>

      <div className="form-group">
        <label htmlFor="teamName">Team Name</label>
        <input
          type="text"
          id="teamName"
          name="teamName"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Enter team name"
          required
          autoFocus
        />
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn-submit"
          disabled={isSubmitting || !teamName.trim()}
        >
          {isSubmitting ? "Creating..." : "Create Team"}
        </button>
        <button
          type="button"
          className="btn-cancel"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
      <ToastContainer />
    </form>
  );
};

export default CreateTeamForm;
