import { Outlet, Link } from "react-router-dom";
import { NavigationBar } from "../components/NavigationBar";

export default function Root() {
  return (
    <>
      <NavigationBar />
      <main><Outlet /></main>
    </>
  );
}