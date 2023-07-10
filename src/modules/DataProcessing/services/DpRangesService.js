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

export default class DpRangesService {

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

    getAllDropDownValues = () => {
        return this.init().get("/getmetric")
    }
    
    getRangesByMetric = (filter) => {
        return this.init().get("/suggest_ranges/" + filter)
    }

    submitData = (body) => {
        return this.init().post("/getmetric", body)
    }

    createRange = (body) => {
        return this.init().post("/metric", body)
    }

    editRange = (body) => {
        return this.init().post("/editmetric", body)
    }

    deleteRange = (id) => {
        return this.init().post("/deletemetric", { id })
    }

    getMetricsOptions = () => {
        return this.init().get("/getAllMetrics");
    }
}
