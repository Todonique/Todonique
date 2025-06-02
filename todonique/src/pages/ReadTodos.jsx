import React, { useEffect, useState } from "react";

const mockTodos = [
  {
    todo_id: 1,
    title: "Fix login bug",
    description: "Users can't log in after the last patch",
    status: "in_progress",
    created_at: "2025-05-01T12:00:00Z",
    assigned_to: "Alice",
    created_by: "Bob",
    team: "Frontend",
  },
  {
    todo_id: 2,
    title: "Update user docs",
    description: "Add MFA setup instructions",
    status: "pending",
    created_at: "2025-05-02T08:30:00Z",
    assigned_to: "Charlie",
    created_by: "Alice",
    team: "Docs",
  },
];

export default function ReadTodos() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => setTodos(mockTodos), 500);
  }, []);

  return (
    <section>
      <h1>Todo List</h1>
      {todos.length === 0 ? (
        <p>Loading todos...</p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <li key={todo.todo_id}>
              <article>
                <h2>{todo.title}</h2>
                <p><strong>Description:</strong> {todo.description}</p>
                <p><strong>Status:</strong> {todo.status}</p>
                <p><strong>Created At:</strong> {new Date(todo.created_at).toLocaleString()}</p>
                <p><strong>Assigned To:</strong> {todo.assigned_to}</p>
                <p><strong>Created By:</strong> {todo.created_by}</p>
                <p><strong>Team:</strong> {todo.team}</p>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
