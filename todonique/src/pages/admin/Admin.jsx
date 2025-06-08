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

  const handleRoleChange = async (userId, newRole) => {
    try {
      await apiRequest(`/admin/user/${userId}/role`, {
        method: "PATCH",
        body: { role: newRole },
      });
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
            <tr>
              <th>Name</th><th>Email</th><th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td><td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="member">Member</option>
                    <option value="team_lead">Team Lead</option>
                    <option value="admin">Admin</option>
                  </select>
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
