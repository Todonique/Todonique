// NavigationBar.jsx
import { Link } from "react-router-dom";
import "./NavigationBar.css";

export const NavigationBar = () => {
    const userRole = "team-lead"; // "admin", "team-lead", "user"

    if (userRole === "admin") {
        return (
            <nav className="navbar">
                <ul className="navbar__list">
                    <li className="navbar__item"><Link className="navbar__link" to="/admin/reset-password">Reset Password</Link></li>
                    <li className="navbar__item"><Link className="navbar__link" to="/admin/approve-team-lead">Approve Team Lead</Link></li>
                    <li className="navbar__item"><Link className="navbar__link" to="/setup-mfa">Setup MFA</Link></li>
                </ul>
            </nav>
        );
    }

    return (
        <nav className="navbar">
            <ul className="navbar__list">
                <li className="navbar__item"><Link className="navbar__link" to="/todos">Todos</Link></li>
                <li className="navbar__item"><Link className="navbar__link" to="/todos/create">Create Todo</Link></li>
                <li className="navbar__item"><Link className="navbar__link" to="/invites">Invites</Link></li>
                <li className="navbar__item"><Link className="navbar__link" to="/setup-mfa">Setup MFA</Link></li>
            </ul>
        </nav>
    );
};
