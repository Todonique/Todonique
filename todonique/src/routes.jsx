import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import Root from "./layouts/Root";
import AuthLayout from "./layouts/AuthLayout";

import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import CreateTodo from "./pages/createTodo/CreateTodo";
import UpdateTodo from "./pages/updateTodo/UpdateTodo";
import ReadTodos from "./pages/readTodos/ReadTodos";
import ResetPassword from "./pages/ResetPassword";
import ApproveTeamLead from "./pages/ApproveTeamLead";
import Invites from "./pages/invites/Invites";
import SetupMFA from "./pages/SetupMFA";
import Setup2FA from "./pages/setup2FA/Setup2FA";
import Verify2FA from "./pages/verify2FA/Verify2FA";
import Dashboard from "./pages/dashboard/Dashboard";
import { SendUserInvite } from "./components/sendUserInvite/SendUserInvite";
import ViewSentInvites from "./components/viewSentInvites/viewSentInvites";
import LandingPage from "./pages/landingPage/LandingPage";
import Reporting from "./components/Reporting/Reporting";
import CreateTeamForm from "./components/CreateTeamForm/CreateTeamForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Root />
      </ProtectedRoute>
    ),
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "teams/:teamId/todos", element: <ReadTodos /> },
      { path: "teams/:teamId/todos/create", element: <CreateTodo /> },
      { path: "teams/:teamId/todos/:todoId", element: <UpdateTodo /> },
      { path: "teams/:teamId/todos/:todoId/reporting", element: <Reporting /> },
      { path: "teams/create", element: <CreateTeamForm /> },
      { path: "admin/reset-password", element: <ResetPassword /> },
      { path: "admin/approve-team-lead", element: <ApproveTeamLead /> },
      { path: "invites", element: <Invites /> },
      { path: "invites/send", element: <SendUserInvite /> },
      { path: "invites/sent", element: <ViewSentInvites /> },
      { path: "setup-mfa", element: <SetupMFA /> },
      { path: "landing", element: <LandingPage /> },
    ],
  },

  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },

  {
    path: "/2fa",
    element: <AuthLayout />,
    children: [
      { path: "setup", element: <Setup2FA /> },
      { path: "verify", element: <Verify2FA /> },
    ],
  },
]);

export default router;

