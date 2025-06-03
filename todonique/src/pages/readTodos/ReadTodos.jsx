import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './ReadTodos.css';
import CtaButton from "../../components/ctaButton.jsx/CtaButton";

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
  },
  {
    todo_id: 6,
    title: "Conduct user testing",
    description: "Gather feedback on the new features",
    status: "completed",
    created_at: "2025-05-06T11:30:00Z",
    assigned_to: "Grace",
    created_by: "Frank",
    team: "QA"
  },
  {
    todo_id: 7,
    title: "Implement dark mode",
    description: "Add dark mode support to the app",
    status: "pending",
    created_at: "2025-05-07T13:00:00Z",
    assigned_to: "Hannah",
    created_by: "Grace",
    team: "Frontend"
  },
  {
    todo_id: 8,
    title: "Optimize database queries",
    description: "Reduce load times for user data retrieval",
    status: "in_progress",
    created_at: "2025-05-08T15:30:00Z",
    assigned_to: "Ian",
    created_by: "Hannah",
    team: "Backend"
  },
  {
    todo_id: 9,
    title: "Create marketing materials",
    description: "Design flyers and social media posts for the launch",
    status: "completed",
    created_at: "2025-05-09T16:45:00Z",
    assigned_to: "Jack",
    created_by: "Ian",
    team: "Marketing"
  },
  {
    todo_id: 10,
    title: "Review security protocols",
    description: "Ensure all security measures are up to date",
    status: "pending",
    created_at: "2025-05-10T17:00:00Z",
    assigned_to: "Kathy",
    created_by: "Jack",
    team: "Security"
  }, 
  {
    todo_id: 11,
    title: "Prepare for product launch",
    description: "Finalize all features and marketing strategies",
    status: "in_progress",
    created_at: "2025-05-11T18:30:00Z",
    assigned_to: "Leo",
    created_by: "Kathy",
    team: "Product"
  },
  {
    todo_id: 12,
    title: "Conduct team retrospective",
    description: "Discuss what went well and what can be improved",
    status: "completed",
    created_at: "2025-05-12T19:15:00Z",
    assigned_to: "Mia",
    created_by: "Leo",
    team: "Management"
  },
  {
    todo_id: 13,
    title: "Update project roadmap",
    description: "Revise timelines and deliverables for the next quarter",
    status: "pending",
    created_at: "2025-05-13T20:00:00Z",
    assigned_to: "Nina",
    created_by: "Mia",
    team: "Planning"
  },
  {
    todo_id: 14,
    title: "Conduct code review",
    description: "Review pull requests for the latest features",
    status: "in_progress",
    created_at: "2025-05-14T21:30:00Z",
    assigned_to: "Oscar",
    created_by: "Nina",
    team: "Code Review"
  },
  {
    todo_id: 15,
    title: "Set up user feedback system",
    description: "Implement a system to collect user feedback on features",
    status: "completed",
    created_at: "2025-05-15T22:45:00Z",
    assigned_to: "Paul",
    created_by: "Oscar",
    team: "Feedback"
  }
];

function formatStatus(status) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function TodoCard({ todo }) {
  const navigate = useNavigate();
  return (
    <article className="todo-card" role="listitem" onClick={() => navigate(`update/${todo.todo_id}`, { relative: 'path' })}>
      <header className="todo-card__header">
        <h2 className="todo-card__title">{todo.title}</h2>
      </header>
      <div className="todo-card__body">
        <p><strong>Description:</strong> {todo.description}</p>
        <p>
          <strong>Status:</strong>{" "}
          <span className={`status status--${todo.status}`}>
            {formatStatus(todo.status)}
          </span>
        </p>
        <p><strong>Created At:</strong> {new Date(todo.created_at).toLocaleString()}</p>
        <p><strong>Assigned To:</strong> {todo.assigned_to}</p>
        <p><strong>Created By:</strong> {todo.created_by}</p>
        <p><strong>Team:</strong> {todo.team}</p>
      </div>
    </article>
  );
}

export default function ReadTodos() {
  const [todos, setTodos] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAssignedTo, setFilterAssignedTo] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 6;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodos = () => {
      setTimeout(() => setTodos(mockTodos), 500);
    };
    fetchTodos();
  }, []);

  const uniqueAssignees = [...new Set(todos.map(todo => todo.assigned_to))];

  const filteredTodos = todos.filter(todo =>
    (filterStatus === "all" || todo.status === filterStatus) &&
    (filterAssignedTo === "all" || todo.assigned_to === filterAssignedTo)
  );

  const totalPages = Math.ceil(filteredTodos.length / todosPerPage);
  const paginatedTodos = filteredTodos.slice(
    (currentPage - 1) * todosPerPage,
    currentPage * todosPerPage
  );

  const resetPagination = () => setCurrentPage(1);

  return (
    <main className="todo">
      <header className="todo__header">
        <h1 className="todo__title">DevOps Todos</h1>
        <CtaButton
          text={"Create Todo"}
          onClick={() => navigate('create', { relative: 'path' })}
        />
      </header>

      <div className="todo__controls">
        <label htmlFor="filterStatus">Filter by status: </label>
        <select
          id="filterStatus"
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            resetPagination();
          }}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <label htmlFor="filterAssignedTo">Filter by assigned to: </label>
        <select
          id="filterAssignedTo"
          value={filterAssignedTo}
          onChange={(e) => {
            setFilterAssignedTo(e.target.value);
            resetPagination();
          }}
        >
          <option value="all">All</option>
          {uniqueAssignees.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      {todos.length === 0 ? (
        <p className="todo__loading">Loading todos...</p>
      ) : filteredTodos.length === 0 ? (
        <p className="todo__loading">No todos found.</p>
      ) : (
        <>
          <section className="todo__grid" role="list">
            {paginatedTodos.map((todo) => (
              <TodoCard key={todo.todo_id} todo={todo} />
            ))}
          </section>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
