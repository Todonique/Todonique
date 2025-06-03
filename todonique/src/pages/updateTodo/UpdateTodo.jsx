import { useState, useEffect } from "react";
import "./UpdateTodo.css";

// Mock existing todo to update
const todoToEdit = {
  id: 42,
  title: "Fix login bug",
  description: "Users can't log in after the last patch",
  assigned_to: 1,
  team: "Engineering",
  status: "In Progress"
};

// Mock team data for dropdown
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

const mockFetchTeamMembers = async (team) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTeamData[team] || []);
    }, 300);
  });
};

export default function UpdateTodo() {
  const [form, setForm] = useState({ ...todoToEdit });
  const [teamMembers, setTeamMembers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      const members = await mockFetchTeamMembers(todoToEdit.team);
      setTeamMembers(members);
    };
    fetchMembers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.title && form.description && form.assigned_to && form.status) {
      setMessage("Todo updated successfully!");
      console.log("Updated Todo:", form); // Replace with actual API call
    } else {
      setMessage("Please fill in all fields.");
    }
  };

  return (
    <section className="update-todo">
      <h2>Update Todo</h2>
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

        <label>Team</label>
        <input
          type="text"
          value={form.team}
          disabled
          readOnly
        />

        <label htmlFor="assigned_to">Assign To</label>
        <select
          id="assigned_to"
          name="assigned_to"
          value={form.assigned_to}
          onChange={handleChange}
          required
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

        <button type="submit">Update Todo</button>
      </form>
      {message && <p>{message}</p>}
    </section>
  );
}
