import React, {useContext} from "react";
import { useNavigate } from "react-router-dom";
import { useNavigate } from 'react-router';



const Logout = () => {
    const navigate = useNavigate();
    const authCtx = useContext(AuthContext);
    authCtx.logout();
    navigate("/login");
    // return(<></>);
};

export default Logout;