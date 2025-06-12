import { useParams } from "react-router-dom";
import { apiRequest } from "../../utils/api";
import "./Reporting.css";
import { useEffect, useState } from "react";

const Reporting = () => {
  const { todoId } = useParams();
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    fetchTodoHistory();
  }, []);

  const fetchTodoHistory = async () => {
    try {
      const result = await apiRequest(`/history/todo/history`, {
          method: 'POST',
          auth: true,
          body: {
            todoIds: todoId ? [todoId] : []
          }
      });
      setHistoryData(result)
    } catch (error) {
      console.error("Error fetching todo history:", error);
    };
  };
  const fetchTodoHistory = async () => {
    try {
      const result = await apiRequest(`/history/todo/history`, {
          method: 'POST',
          auth: true,
          body: {
            todoIds: todoId ? [todoId] : []
          }
      });
      setHistoryData(result)
    } catch (error) {
      console.error("Error fetching todo history:", error);
    };
  };

  return (
    <section className="reporting">
      <header>
          <h1 className="reporting__title">Reporting</h1>
      </header>
      <section className="reporting__content">
        <table className="reporting__table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Changed By</th>
              <th>Title</th>
              <th>Description</th>
              <th>Assigned To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((entry) => (
              <tr key={entry.todo_history_id}>
                <td>{new Date(entry.updated_at).toLocaleString()}</td>
                <td>{entry.updated_by_name}</td>
                <td>
                  {entry.old_title || "-"} → {entry.new_title || "-"}
                </td>
                <td>
                  {entry.old_description || "-"} → {entry.new_description || "-"}
                </td>
                <td>
                  {entry.old_assigned_name ?? "-"} → {entry.new_assigned_name ?? "-"}
                </td>
                <td>
                  {entry.old_status ?? "-"} → {entry.new_status ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </section>
  );
};

export default Reporting;
