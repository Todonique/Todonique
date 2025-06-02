import { useState } from "react";
import "./CreateTodo.css";

// Mock data source
const mockTeamData = {
  Engineering: [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ],
  Marketing: [
    { id: 3, name: "Charlie" },
  ],
  Design: [
    { id: 4, name: "Diana" },
    { id: 5, name: "Eli" },
  ],
};

// Mock API function
const mockFetchTeamMembers = async (team) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTeamData[team] || []);
    }, 300); // Simulate delay
  });
};

export default function CreateTodo() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    assigned_to: "",
    team: "",
    status: "Pending",
  });

  const [message, setMessage] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const userTeams = ["Engineering", "Marketing", "Design"];

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "team") {
      const members = await mockFetchTeamMembers(value);
      setTeamMembers(members);
      setForm({ ...form, team: value, assigned_to: "" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.title && form.description && form.assigned_to && form.team && form.status) {
      setMessage("Todo created successfully!");
      console.log(form); // Replace with API call
    } else {
      setMessage("Please fill in all fields.");
    }
  };

  return (
    <section className="create-todo">
      <h2 className="create-todo">Create Todo</h2>
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

        <label htmlFor="team">Team</label>
        <select
          id="team"
          name="team"
          value={form.team}
          onChange={handleChange}
          required
        >
          <option value="">Select a team</option>
          {userTeams.map((team) => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>

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

        <button type="submit">Create Todo</button>
      </form>
      {message && <p>{message}</p>}
    </section>
  );
}
