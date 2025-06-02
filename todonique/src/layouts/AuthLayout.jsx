import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
  return (
    <section>
      <header>
        <h1>Welcome to the Auth Portal</h1>
        <nav>
          <ul>
            <li><Link to="/auth/login">Login</Link></li>
            <li><Link to="/auth/register">Register</Link></li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </section>
  );
}