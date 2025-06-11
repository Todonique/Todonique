import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/api";
import "./Admin.css";

export default function AdminRoleManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await apiRequest("/admin/users");
        setUsers(data);
      } catch {
        setMessage("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (user) => {
    const newRole = prompt(`Change role for ${user.username} (current: ${user.role}) to:`, user.role);
    if (!newRole || newRole === user.role) return;

    const allowedRoles = ['user', 'team_lead', 'admin'];
    if (!allowedRoles.includes(newRole)) {
      setMessage("Invalid role selected.");
      return;
    }

    try {
      await apiRequest(`/admin/user/${user.user_id}/role`, {
        method: "PATCH",
        body: {
          role: newRole,
          currentRole: user.role,
          userId: user.user_id
        },
      });
      setUsers(prev =>
        prev.map(u => u.user_id === user.user_id ? { ...u, role: newRole } : u)
      );
      setMessage("Role updated successfully!");
    } catch {
      setMessage("Error updating role.");
    }
  };

  return (
    <section className="admin-panel">
      <h1 className="title">Admin Role Management</h1>
      {loading ? <p>Loading users...</p> : (
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.user_id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleRoleChange(user)}>
                    Change Role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {message && <p>{message}</p>}
    </section>
  );
}
