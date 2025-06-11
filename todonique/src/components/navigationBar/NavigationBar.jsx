import { Link, useNavigate } from "react-router-dom";
import "./NavigationBar.css";
import { HamburgerIcon } from "../hamburgerIcon/HamburgerIcon";
import { useEffect, useState } from "react";
import CtaButton from "../ctaButton.jsx/CtaButton";

export const NavigationBar = () => {
    const navigate = useNavigate();
    const authToken = localStorage.getItem("authToken");
    const [userRole, setUserRole] = useState(null);
    const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

    useEffect(() => {
        if (!authToken) {
            navigate("/auth/login");
        }
    }, [authToken]);

    const handleMobileNavToggle = () => {
        setMobileNavigationOpen((prev) => !prev);
    };

    const closeMobileNav = () => {
        setMobileNavigationOpen(false);
    };

    const getRoleFromToken = (token) => {
        if (!token) return null;
        try {
            const base64Payload = token.split('.')[1];
            const payload = JSON.parse(atob(base64Payload));
            return payload.role;
        } catch {
            return null;
        }
    };

    useEffect(() => {
        if (authToken) {
            const role = getRoleFromToken(authToken);
            setUserRole(role);
        };
    }, [authToken, userRole]);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate("/auth/login");
    };

    if (userRole === "admin") {
        return (
            <nav className="navbar">
                <ul className="navbar__list navbar__list--visible">
                    <li className="navbar__item"><Link className="navbar__link" to="admin/roles" onClick={closeMobileNav}>Roles</Link></li>
                </ul>
            </nav>
        );
    }

    if (userRole === "team_lead") {
        return (
            <nav className="navbar">
            <section className="navbar__mobile-header">
                <Link className="navbar__brand" to="/" onClick={closeMobileNav}>Todonique</Link>
                <HamburgerIcon isOpen={mobileNavigationOpen} onClick={handleMobileNavToggle} />
            </section>
            <ul className={`navbar__list ${mobileNavigationOpen ? "navbar__list--visible" : ""}`}>
                <li className="navbar__item"><Link className="navbar__link" to="/" onClick={closeMobileNav}>Dashboard</Link></li>
                <li className="navbar__item"><Link className="navbar__link" to="/invites/send" onClick={closeMobileNav}>Send Invite</Link></li>
                <li className="navbar__item"><Link className="navbar__link" to="/teams/create" onClick={closeMobileNav}>Create Team</Link></li>
                 {mobileNavigationOpen && <li className="navbar__item"><Link className="navbar__link" onClick={handleLogout}>Logout</Link></li>}
            </ul>
            {!mobileNavigationOpen && (
                <section className="navbar__logout">
                    <CtaButton text={"Logout"} onClick={handleLogout} />
                </section>
            )}
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
                 {mobileNavigationOpen && <li className="navbar__item"><Link className="navbar__link" onClick={handleLogout}>Logout</Link></li>}

            </ul>
            {!mobileNavigationOpen && (
                <section className="navbar__logout">
                    <CtaButton text={"Logout"} onClick={handleLogout} />
                </section>
            )}
        </nav>
    );
};
