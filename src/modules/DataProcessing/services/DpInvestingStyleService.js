import * as axios from "axios";
import React from "react";
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

export default class DpInvestingStyleService {

    constructor() {
        this.token = CheckUserSession();
        this.client = null;
        this.api_url = Constants.BACKEND_SERVER_BASE_URL;
    }

    init = () => {
        this.client = axios.create({
            baseURL: this.api_url,
            timeout: Constants.APP_API_TIMEOUT,
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

    createInvestingStyle = (body) => {
        return this.init().post("/context/investingStyle", body)
    }

    editInvestingStyle = (body) => {
        return this.init().post("/context/investingStyle/edit", body)
    }

    deleteInvestingStyle = (id) => {
        return this.init().post("/context/investingStyle/delete", { id })
    }
}
