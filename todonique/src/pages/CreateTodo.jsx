import React, { useState } from "react";

export default function CreateTodo() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    assigned_to: "",
    team: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.title && form.description && form.assigned_to && form.team) {
      setMessage("Todo created successfully!");
    } else {
      setMessage("Please fill in all fields.");
    }
  };

  return (
    <section>
      <h2>Create Todo</h2>
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
        <input
          type="text"
          id="assigned_to"
          name="assigned_to"
          value={form.assigned_to}
          onChange={handleChange}
          required
        />

        {/* Team would be auto assigned to the team from whom created it */}
        {/* Need to confirm usecase of can members be part of two teams? preferably not? */}
        {/* <label htmlFor="team">Team</label>
        <input
          type="text"
          id="team"
          name="team"
          value={form.team}
          onChange={handleChange}
          required
        /> */}

        <button type="submit">Create Todo</button>
      </form>
      {message && <p>{message}</p>}
    </section>
  );
}
