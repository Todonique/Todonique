import { useEffect, useState } from "react";
import "./CreateTodo.css";
import { apiRequest } from "../../utils/api";
import { useParams } from "react-router-dom";

export default function CreateTodo() {
  const { teamId } = useParams();
  const [form, setForm] = useState({
    title: "",
    description: "",
    assigned_to: "",
    team: teamId,
    status: "Pending",
  });
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const teamMembers = await apiRequest(`/teams/team/${teamId}/members`);
      setTeamMembers(teamMembers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teamId) {
      fetchTeamMembers();
    }
  }, [teamId]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.title && form.description && form.status) {

      const requestBody = {
        title: form.title.trim(),
        description: form.description.trim(),
        team: parseInt(form.team, 10),
        assigned_to: form.assigned_to,
        status: form.status,
      };

      try {
        setSubmitLoading(true);
        await apiRequest('todos/todo', {
          method: 'POST',
          body: requestBody,
          auth: false,
        });
        setMessage("Todo created successfully!");
        setForm((prev) => ({
          ...prev,
          title: "",
          description: "",
          assigned_to: "",
          status: "Pending",
        }));
      } catch {
        setMessage("Error creating todo.");
      } finally {
        setSubmitLoading(false);
      }
    } else {
      setMessage("Please fill in all fields.");
    }
  };

  return (
    <section className="create-todo">
      <header className="title-container">
        <h1 className="title">Create Todo</h1>
      </header>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        ></textarea>

        <label htmlFor="assigned_to">Assign To</label>
        <select
          id="assigned_to"
          name="assigned_to"
          value={form.assigned_to}
          onChange={handleChange}
          required
          disabled={!teamMembers.length}
        >
          <option value="">Select a team member</option>
          {teamMembers.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
        {loading && <p>Loading team members...</p>}
        {!loading && teamMembers.length === 0 && (
          <p>No team members available for this team.</p>
        )}

        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={form.status}
          onChange={handleChange}
          required
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <button type="submit" disabled={submitLoading}>
          {submitLoading ? "Creating..." : "Create Todo"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </section>
  );
}
