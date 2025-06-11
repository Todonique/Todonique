import { Link, useNavigate, useLocation } from "react-router-dom";
import "./NavigationBar.css";
import { HamburgerIcon } from "../hamburgerIcon/HamburgerIcon";
import { useEffect, useState } from "react";
import CtaButton from "../ctaButton.jsx/CtaButton";

export const NavigationBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const authToken = localStorage.getItem("authToken");
    const [userRole, setUserRole] = useState(null);
    const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

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

    // Helper function to determine if a link is active
    const isActiveLink = (path) => {
        return location.pathname === path;
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
                    <li className="navbar__item">
                        <Link 
                            className={`navbar__link ${isActiveLink("/admin/reset-password") ? "navbar__link--active" : ""}`} 
                            to="/admin/reset-password" 
                            onClick={closeMobileNav}
                        >
                            Reset Password
                        </Link>
                    </li>
                    <li className="navbar__item">
                        <Link 
                            className={`navbar__link ${isActiveLink("/admin/approve-team-lead") ? "navbar__link--active" : ""}`} 
                            to="/admin/approve-team-lead" 
                            onClick={closeMobileNav}
                        >
                            Approve Team Lead
                        </Link>
                    </li>
                    <li className="navbar__item">
                        <Link 
                            className={`navbar__link ${isActiveLink("/setup-mfa") ? "navbar__link--active" : ""}`} 
                            to="/setup-mfa" 
                            onClick={closeMobileNav}
                        >
                            Setup MFA
                        </Link>
                    </li>
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
                <li className="navbar__item">
                    <Link 
                        className={`navbar__link ${isActiveLink("/") ? "navbar__link--active" : ""}`} 
                        to="/" 
                        onClick={closeMobileNav}
                    >
                        Dashboard
                    </Link>
                </li>
                <li className="navbar__item">
                    <Link 
                        className={`navbar__link ${isActiveLink("/invites") ? "navbar__link--active" : ""}`} 
                        to="/invites" 
                        onClick={closeMobileNav}
                    >
                        Invites
                    </Link>
                </li>
                <li className="navbar__item">
                    <Link 
                        className={`navbar__link ${isActiveLink("/teams/create") ? "navbar__link--active" : ""}`} 
                        to="/teams/create" 
                        onClick={closeMobileNav}
                    >
                        Create Team
                    </Link>
                </li>
                 {mobileNavigationOpen && <li className="navbar__item"><Link className="navbar__link" onClick={handleLogout}>Logout</Link></li>}
            </ul>
            {!mobileNavigationOpen && (
                <section className="navbar__logout">
                    <CtaButton text={"Logout"} />
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
                <li className="navbar__item">
                    <Link 
                        className={`navbar__link ${isActiveLink("/") ? "navbar__link--active" : ""}`} 
                        to="/" 
                        onClick={closeMobileNav}
                    >
                        Dashboard
                    </Link>
                </li>
                <li className="navbar__item">
                    <Link 
                        className={`navbar__link ${isActiveLink("/invites") ? "navbar__link--active" : ""}`} 
                        to="/invites" 
                        onClick={closeMobileNav}
                    >
                        Invites
                    </Link>
                </li>
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