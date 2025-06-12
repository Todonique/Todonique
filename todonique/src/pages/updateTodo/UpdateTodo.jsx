import { useState, useEffect } from "react";
import "./UpdateTodo.css";
import { useNavigate, useParams } from "react-router-dom";
import CtaButton from "../../components/ctaButton.jsx/CtaButton";
import { apiRequest } from "../../utils/api";
import { ToastContainer, toast } from 'react-toastify';

export default function UpdateTodo() {
  const { teamId, todoId } = useParams();
  const [form, setForm] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [message, setMessage] = useState("");

  const [edit, setEdit] = useState(false);

  const authToken = localStorage.getItem("authToken");
  const [userRole, setUserRole] = useState(null);

  const getRoleFromToken = (token) => {
      if (!token) return null;
      try {
          const base64Payload = token.split('.')[1];
          const payload = JSON.parse(atob(base64Payload));
          return payload.role;
      } catch {
          return null;
      }
  };

  useEffect(() => {
      if (authToken) {
          const role = getRoleFromToken(authToken);
          setUserRole(role);
      };
  }, [authToken, userRole]);

  const fetchTeamMemebers = async () => {
    const result = await apiRequest(`/teams/team/${teamId}/members`, {
      method: "GET",
      auth: true,
    });
    setTeamMembers(result);
  };

  const fetchTodo = async () => {
    const result = await apiRequest(`/todos/todo/${todoId}`,
      {
        method: "GET",
        auth: true,
      }
    );
    setForm(result);
  };



  useEffect(() => {
    if (teamId && todoId) {
      fetchTeamMemebers();
      fetchTodo();
    }
  }, [teamId, todoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (form.title && form.description && form.assigned_to && form.status) {
      try {
        await apiRequest(`/todos/todo/${todoId}`, {
          method: "PATCH",
          body: form,
          auth: true,
        });
        toast.success('Successfuly updated todo.', {
          position: "bottom-right",
          autoClose: 4000,
          closeOnClick: true,
          draggable: false
        });
        setEdit(false);
      } catch (error) {
        toast.error(`Error updating todo. ${error}`, {
          position: "bottom-right",
          autoClose: 4000,
          closeOnClick: true,
          draggable: false
        });
      }
    } else {
      toast.warn('Please fill in all fields.', {
        position: "bottom-right",
        autoClose: 4000,
        closeOnClick: true,
        draggable: false
      });
    };
  };

  const navigate = useNavigate();

  const handleViewReporting = () => {
    navigate(`/teams/${teamId}/todos/${todoId}/reporting`);
  };

  if (!form) return <p>Loading...</p>;

  return (
    <>
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
            <option key={member.userId} value={member.userId}>
              {member.userName}
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
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        {edit && (
          <CtaButton
          type="submit"
          text="Update Todo"
          />
        )}
      </form>
      {message && edit && <p>{message}</p>}

      <section className="reporting-container">
        {userRole === "team_lead" && (
          <CtaButton text={"View Reporting"} onClick={handleViewReporting} />
        )}
      </section>
      
      
    </section>
    
    <ToastContainer />
    </>
  );
}