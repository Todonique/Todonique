import { Link } from "react-router-dom";


export const NavigationBar = () => {

    // Get logged-in user role
    // Read JWT for role
    const userRole = "team-lead"; // team-lead, user, admin

    if (userRole === "admin") {
        return (
            <nav>
                <ul>
                    <li><Link to={"/admin/reset-password"}>Reset Password</Link></li>
                    <li><Link to={"/admin/approve-team-lead"}>Approve Team Lead</Link></li>
                    <li><Link to={"/setup-mfa"}>Setup MFA</Link></li>
                </ul>
            </nav>
        );
    };

    // Same as the user but will differ in returned infomration and actions on certain components

    // if (userRole === "team-lead") {
    //     return (
    //         <nav>
    //             <ul>
    //                 <li><Link to={"/todos"}>Todos</Link></li>
    //                 <li><Link to={"/todos/create"}>Create Todo</Link></li>
    //                 <li><Link to={"/invites"}>Invites</Link></li>
    //                 <li><Link to={"/setup-mfa"}>Setup MFA</Link></li>
    //             </ul>
    //         </nav>
    //     );
    // };

    return (
        <nav>
            <ul>
                <li><Link to={"/todos"}>Todos</Link></li>
                <li><Link to={"/todos/create"}>Create Todo</Link></li>
                <li><Link to={"/invites"}>Invites</Link></li>
                <li><Link to={"/setup-mfa"}>Setup MFA</Link></li>
            </ul>
        </nav>
    );
};