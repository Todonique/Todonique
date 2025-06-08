import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './ReadTodos.css';
import CtaButton from "../../components/ctaButton.jsx/CtaButton";
import { apiRequest } from "../../utils/api";

function formatStatus(status) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function TodoCard({ todo }) {
  const navigate = useNavigate();
  return (
    <article className="todo-card" role="listitem" onClick={() => navigate(`${todo.todo_id}`, { relative: 'path' })}>
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
        <p><strong>Assigned To:</strong> {todo.assigned_name}</p>
        <p><strong>Created By:</strong> {todo.created_by_name}</p>
      </div>
    </article>
  );
}

export default function ReadTodos() {
  const { teamId } = useParams();
  const [todos, setTodos] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAssignedTo, setFilterAssignedTo] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 6;

  const navigate = useNavigate();

  useEffect(() => {
    if (teamId) {
      fetchTeamTodos();
    }
  }, [teamId]);

  const fetchTeamTodos = async () => {
    try {
      const result = await apiRequest(`/todos/todo/team/${teamId}`, {
        method: 'GET',
        auth: true,
      });
      setTodos(result);
    } catch (error) {
      console.error("Error fetching todos:", error);
      // TODO Handle error
    };
    // Loading state
  };

  const uniqueAssignees = [...new Set(todos.map(todo => todo.assigned_name))];

  const filteredTodos = todos.filter(todo =>
    (filterStatus === "all" || todo.status === filterStatus) &&
    (filterAssignedTo === "all" || todo.assigned_name === filterAssignedTo)
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
