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

export default class DpFundamentalChartService {

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

    getFundamentalChartData = (body) => {
        return this.init().post("/dataProcessing/fundamentalchart", body)
    }

    createFundamentalChartData = (body) => {
        return this.init().post("/dataProcessing/fundamentalchart/create", body)
    }

    editFundamentalChartData = (body) => {
        return this.init().post("/dataProcessing/fundamentalchart/update", body)
    }

    deleteFundamentalChartData = (id) => {
        return this.init().post("/dataProcessing/fundamentalchart/delete", { id })
    }
}
