import { Link } from "react-router-dom";
import "./NavigationBar.css";
import { HamburgerIcon } from "../hamburgerIcon/HamburgerIcon";
import { useState } from "react";

export const NavigationBar = () => {
    const userRole = "team-lead"; // "admin", "team-lead", "user"

  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

    const handleMobileNavToggle = () => {
        setMobileNavigationOpen((prev) => !prev);
    };

    const closeMobileNav = () => {
        setMobileNavigationOpen(false);
    };

    if (userRole === "admin") {
        return (
            <nav className="navbar">
                <ul className="navbar__list navbar__list--visible">
                    <li className="navbar__item"><Link className="navbar__link" to="/admin/reset-password" onClick={closeMobileNav}>Reset Password</Link></li>
                    <li className="navbar__item"><Link className="navbar__link" to="/admin/approve-team-lead" onClick={closeMobileNav}>Approve Team Lead</Link></li>
                    <li className="navbar__item"><Link className="navbar__link" to="/setup-mfa" onClick={closeMobileNav}>Setup MFA</Link></li>
                </ul>
            </nav>
        );
    }

    if (userRole === "team-lead") {
        return (
            <nav className="navbar">
                <ul className="navbar__list navbar__list--visible">
                    <li className="navbar__item"><Link className="navbar__link" to="/" onClick={closeMobileNav}>Dashboard</Link></li>
                    <li className="navbar__item"><Link className="navbar__link" to="/invites" onClick={closeMobileNav}>Invites</Link></li>
                    <li className="navbar__item"><Link className="navbar__link" to="/teams/create" onClick={closeMobileNav}>Create Team</Link></li>
                </ul>
            </nav>
        );
    }

    return (
        <nav className="navbar">
            <section className="navbar__mobile-header">
                <Link className="navbar__brand" to="/" onClick={closeMobileNav}>Todonique</Link>
                <HamburgerIcon isOpen={mobileNavigationOpen} onClick={handleMobileNavToggle} />
                
            </section>
            <ul className={`navbar__list ${mobileNavigationOpen ? "navbar__list--visible" : ""}`}>
                <li className="navbar__item"><Link className="navbar__link" to="/" onClick={closeMobileNav}>Dashboard</Link></li>
                <li className="navbar__item"><Link className="navbar__link" to="/invites" onClick={closeMobileNav}>Invites</Link></li>
                <li className="navbar__item"><Link className="navbar__link" to="/setup-mfa" onClick={closeMobileNav}>Setup MFA</Link></li>
            </ul>
        </nav>
    );
};
