import { useParams } from "react-router-dom";
import { apiRequest } from "../../utils/api";
import "./Reporting.css";
import { useEffect, useState } from "react";

const mockTodoHistory = [
  {
    todo_history_id: 1,
    todo_id: 101,
    updated_by: 3,
    updated_at: "2025-06-08T12:30:00Z",
    old_title: "Initial Title",
    new_title: "Updated Title",
    old_description: "Old description",
    new_description: "New description",
    old_assigned_to_value: 2,
    new_assigned_to_value: 4,
    old_status_value: 1,
    new_status_value: 2,
    change_type: "update",
  },
  {
    todo_history_id: 2,
    todo_id: 102,
    updated_by: 4,
    updated_at: "2025-06-07T09:15:00Z",
    old_title: null,
    new_title: null,
    old_description: null,
    new_description: null,
    old_assigned_to_value: 1,
    new_assigned_to_value: 5,
    old_status_value: null,
    new_status_value: null,
    change_type: "assign",
  },
];

const Reporting = () => {
  const { todoId } = useParams();
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchTodoHistory = async () => {
      const data = mockTodoHistory;
      setHistoryData(data);
    };

    fetchTodoHistory();
  }, []);

  // const fetchTodoHistory = async () => {
  //   try {
  //     // TODO need to align with backend
  //     const result = await apiRequest(`/todos/todo/${todoId}/history`, {
  //         method: 'GET',
  //         auth: true,
  //     });
  //     setHistoryData(result)
  //   } catch (error) {
  //     console.error("Error fetching todo history:", error);
  //   };
  //   // TODO loading state
  //   // TODO handle error
  // };

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
              <th>Change Type</th>
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
                <td>{entry.updated_by}</td>
                <td>{entry.change_type}</td>
                <td>
                  {entry.old_title || "-"} → {entry.new_title || "-"}
                </td>
                <td>
                  {entry.old_description || "-"} → {entry.new_description || "-"}
                </td>
                <td>
                  {entry.old_assigned_to_value ?? "-"} → {entry.new_assigned_to_value ?? "-"}
                </td>
                <td>
                  {entry.old_status_value ?? "-"} → {entry.new_status_value ?? "-"}
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
