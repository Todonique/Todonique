import { Outlet } from "react-router-dom";
import { NavigationBar } from "../components/navigationBar/NavigationBar";
import { useState } from "react";

export default function Root() {

  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(true);

  return (
    <>
      <NavigationBar mobileNavigationOpen={mobileNavigationOpen} setMobileNavigationOpen={setMobileNavigationOpen} />
      <main><Outlet /></main>
    </>
  );
}