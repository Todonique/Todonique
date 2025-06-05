import { createBrowserRouter } from "react-router-dom";

import Root from "./layouts/Root";
import AuthLayout from "./layouts/AuthLayout";

import Register from "./pages/Register";
import Login from "./pages/Login";
import CreateTodo from "./pages/createTodo/CreateTodo";
import UpdateTodo from "./pages/updateTodo/UpdateTodo";
import ReadTodos from "./pages/readTodos/ReadTodos";
import ResetPassword from "./pages/ResetPassword";
import ApproveTeamLead from "./pages/ApproveTeamLead";
import Invites from "./pages/invites/Invites";
import SetupMFA from "./pages/SetupMFA";
import Dashboard from "./pages/dashboard/Dashboard";
import { SendUserInvite } from "./components/sendUserInvite/SendUserInvite";
import ViewSentInvites from "./components/viewSentInvites/viewSentInvites";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {path : "/", element: <Dashboard />},
      { path: "teams/:teamId/todos", element: <ReadTodos /> },
      { path: "teams/:teamId/todos/create", element: <CreateTodo /> },
      { path: "teams/:teamId/todos/update/:todoId", element: <UpdateTodo /> },
      { path: "admin/reset-password", element: <ResetPassword /> },
      { path: "admin/approve-team-lead", element: <ApproveTeamLead /> },
      { path: "invites", element: <Invites /> },
      { path: "invites/send", element: <SendUserInvite /> },
      { path: "invites/sent", element: <ViewSentInvites /> },
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