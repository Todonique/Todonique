import { useState } from "react";
import { SendUserInvite } from "../../components/sendUserInvite/SendUserInvite";
import ViewUserInvites from "../../components/viewUserInvites/ViewUserInvites";

const Invites = () => {

    const [userType, setUserType] = useState("user"); // user, team_lead, admin

    if (userType === "user") {
        return (
            <ViewUserInvites />
        );
    };

    if (userType === "team_lead") {
        return (
            <>
                <SendUserInvite />
                {/* <ViewSentInvites /> */}
            </>
        );
    };
};

export default Invites;