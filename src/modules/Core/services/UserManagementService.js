import React from "react";
import * as axios from "axios";
import Constants from '../../../Constants.json'
import AuthContext from "../../Core/store/auth-context";

let requestHeaders = {
    "Content-Type": "application/json",
    "Accept": "application/json"
}

function CheckUserSession() {
    const authCtx = React.useContext(AuthContext);
    return authCtx.isLoggedIn ? authCtx.token : "";
}

export default class ManageUsersService {

    constructor() {
        this.token = CheckUserSession();
        this.client = null;
        this.api_url = Constants.BACKEND_SERVER_BASE_URL;
    }

    init = () => {
        this.client = axios.create({
            baseURL: this.api_url,
            timeout: 0,
            headers: requestHeaders,
        });
        this.client.interceptors.request.use(request => {
            if (this.token !== "") {
                request.headers.common.Authorization = `Bearer ${this.token}`
            }
            return request;
        });
        return this.client;
    };

    signUpUser = (body) => {
        return this.init().post("/user/register", body)
    }

    getAllUsers = () => {
        return this.init().get("/users")
    }

    UpdateUser = (id, body) => {
        return this.init().put("/users/"+ id +"/update", body)
    }

    getAllContacts = () => {
        return this.init().get("/contactpage/get")
    }

    createContact = (body) => {
        return this.init().post("/contactpage", body)
    }

    UpdateContactStatus = (body) => {
        return this.init().put("/contactpage/update", body)
    }

    updateUserPassword = (body) => {
        return this.init().put("/user/password/update", body)
    }
    
}
