import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
  return (
    <section>
      <main>
        <Outlet />
      </main>
    </section>
  );
}