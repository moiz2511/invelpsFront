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

export default class DpCreateMetricsService {

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

    getMetricsData = (body) => {
        return this.init().post("/dataProcessing/advancedRatios", body)
    }

    createMetric = (body) => {
        return this.init().post("/advanceratio", body)
    }

    editMetric = (body) => {
        return this.init().post("/editadvanceratio", body)
    }

    deleteMetric = (id) => {
        return this.init().post("/deleteadvanceratio", { id })
    }

    getMeasureDropDownOptions = () => {
        return this.init().get("/getAllMeasures")
    }

    getCategoryDropDownOptions = (body) => {
        return this.init().post("/getCategoryByMeasure", body)
    }

    getMetricDropDownOptions = (body) => {
        return this.init().post("/getMetricByCategory", body)
    }
}
