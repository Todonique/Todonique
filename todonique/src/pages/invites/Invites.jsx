import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ViewUserInvites from "../../components/viewUserInvites/ViewUserInvites";

const Invites = () => {
    const [userType, setUserType] = useState("user");
    const navigate = useNavigate();

    useEffect(() => {
        if (userType !== "user") {
            navigate("/");
        }
    }, [userType, navigate]);

    if (userType === "user") {
        return <ViewUserInvites />;
    }

    return null;
};

export default Invites;