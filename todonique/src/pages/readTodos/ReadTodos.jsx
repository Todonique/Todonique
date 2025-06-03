import React, { useEffect, useState } from "react";
import './ReadTodos.css';

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
  {
    todo_id: 3,
    title: "Refactor API endpoints",
    description: "Improve performance of user-related endpoints",
    status: "completed",
    created_at: "2025-05-03T14:15:00Z",
    assigned_to: "Dave",
    created_by: "Charlie",
    team: "Backend",
  },
  {
    todo_id: 4,
    title: "Design new landing page",
    description: "Create mockups for the new landing page",
    status: "in_progress",
    created_at: "2025-05-04T10:45:00Z",
    assigned_to: "Eve",
    created_by: "Dave",
    team: "Design",
  },
  {
    todo_id: 5,
    title: "Set up CI/CD pipeline",
    description: "Automate deployment process",
    status: "pending",
    created_at: "2025-05-05T09:00:00Z",
    assigned_to: "Frank",
    created_by: "Eve",
    team: "DevOps"
  }
];

export default function ReadTodos() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => setTodos(mockTodos), 500);
  }, []);

  return (
    <main className="todo">
      <header>
        <h1 className="todo__title">Todo List</h1>
      </header>

      {todos.length === 0 ? (
        <p className="todo__loading">Loading todos...</p>
      ) : (
        <section className="todo__grid">
          {todos.map((todo) => (
            <article key={todo.todo_id} className="todo-card">
              <header>
                <h2 className="todo-card__title">{todo.title}</h2>
              </header>
              <p><strong>Description:</strong> {todo.description}</p>
              <p><strong>Status:</strong> <span className={`status status--${todo.status}`}>{todo.status.replace('_', ' ')}</span></p>
              <p><strong>Created At:</strong> {new Date(todo.created_at).toLocaleString()}</p>
              <p><strong>Assigned To:</strong> {todo.assigned_to}</p>
              <p><strong>Created By:</strong> {todo.created_by}</p>
              <p><strong>Team:</strong> {todo.team}</p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
