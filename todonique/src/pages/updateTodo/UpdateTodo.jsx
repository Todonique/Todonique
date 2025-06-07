import { useState, useEffect } from "react";
import "./UpdateTodo.css";
import { useParams } from "react-router-dom";
import CtaButton from "../../components/ctaButton.jsx/CtaButton";

// Simulate GET /teams/:teamId/todos/:todoId
const mockGetTodoById = async (teamId, todoId) => {
  const mockDatabase =  [
      { id: 1, title: "Update logo", description: "New brand guidelines", assigned_to: 5, team: "Design", status: "Completed" },
  ];

  const todos = mockDatabase;
  return todos.find((todo) => todo.id === parseInt(todoId));
};

// Simulate GET /teams/:teamId/members
const mockGetTeamMembers = async () => {
  const teamMembersDB = [
      { id: 6, name: "Frank" },
      { id: 7, name: "Grace" },
  ];

  return teamMembersDB;
};

export default function UpdateTodo() {
  const { teamId, todoId } = useParams();
  const [form, setForm] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [message, setMessage] = useState("");

  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const todo = await mockGetTodoById(teamId, todoId);
      if (todo) setForm(todo);
      else setMessage("Todo not found.");

      const members = await mockGetTeamMembers(teamId);
      setTeamMembers(members);
    };

    fetchData();
  }, [teamId, todoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.title && form.description && form.assigned_to && form.status) {
      setMessage("Todo updated successfully!");
      console.log("PUT /teams/" + teamId + "/todos/" + todoId, form); // Simulate update
    } else {
      setMessage("Please fill in all fields.");
    }
  };

  if (!form) return <p>Loading...</p>;

  return (
    <section className="update-todo">
      <header className="title-container">
        <h1 className="title">{edit ? "Update Todo" : "View Todo"}</h1>
        <CtaButton text={edit ? "Cancel" : "Update Todo"} onClick={() => setEdit(!edit)} />
      </header>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          disabled={!edit}
          required
        />
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          disabled={!edit}
          required
        ></textarea>

        <label htmlFor="assigned_to">Assign To</label>
        <select
          id="assigned_to"
          name="assigned_to"
          value={form.assigned_to}
          onChange={handleChange}
          disabled={!edit}
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
          disabled={!edit}
          required
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        {edit && (
          <CtaButton
          type="submit"
          text="Update Todo"
          />
        )}
      </form>
      {message && edit && <p>{message}</p>}
    </section>
  );
}