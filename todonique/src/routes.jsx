import { createBrowserRouter } from "react-router-dom";

import Root from "./layouts/Root";
import AuthLayout from "./layouts/AuthLayout";

import Register from "./pages/Register";
import Login from "./pages/Login";
import CreateTodo from "./pages/createTodo/CreateTodo";
import UpdateTodo from "./pages/UpdateTodo";
import ReadTodos from "./pages/ReadTodos";
import ResetPassword from "./pages/ResetPassword";
import ApproveTeamLead from "./pages/ApproveTeamLead";
import ViewInvites from "./pages/ViewInvites";
import SetupMFA from "./pages/SetupMFA";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "todos", element: <ReadTodos /> },
      { path: "todos/create", element: <CreateTodo /> },
      { path: "todos/:id/update", element: <UpdateTodo /> },
      { path: "admin/reset-password", element: <ResetPassword /> },
      { path: "admin/approve-team-lead", element: <ApproveTeamLead /> },
      { path: "invites", element: <ViewInvites /> },
      { path: "setup-mfa", element: <SetupMFA /> },
      {
        path: "auth",
        element: <AuthLayout />,
        children: [
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
        ],
      },
    ],
  },
]);

export default router;