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

export default class FundamentalChartService {

    constructor() {
        this.token = CheckUserSession();
        this.client = null;
        this.api_url = Constants.BACKEND_SERVER_BASE_URL;
    }

    init = () => {
        this.client = axios.create({
            baseURL: this.api_url,
            timeout: 96666861000,
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

    getAllCompanies = () => {
        return this.init().get("/getAllCompanies")
    }

    getMeasuresByTool = (body) => {
        // if (tool === "customratios") {
        //     tool = "CustomRatios"
        // }
        return this.init().post("/getMeasuresByTool",  body)
    }
    getCategoriesByMeasure = (body) => {
        return this.init().post("/getCategoryByMeasure",  body)
    }
    getMetricsByCategory = (body) => {
        return this.init().post("/getMetricByCategory",  body)
    }
    getMetricsByTool = (body) => {
        return this.init().post("/getMetricsByTool",  body)
    }
    getRangesByMetric = (filter) => {
        return this.init().get("/suggest_ranges/" + filter)
    }
    submitData = (body) => {
        return this.init().post("/dataanalysis/fundamentalchart", body)
    }
}
