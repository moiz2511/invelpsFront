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

export default class DpAnalysisModelService {

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

    getDropDownOptions = () => {
        return this.init().get("/getmodel")
    }

    getAnalysisModelsData = (body) => {
        return this.init().post("/getmodel", body)
    }

    createAnalysisModel = (body) => {
        return this.init().post("/model", body)
    }

    editAnalysisModel = (body) => {
        return this.init().post("/editmodel", body)
    }

    deleteAnalysisModel = (id) => {
        return this.init().post("/deletemodel", { id })
    }

    getToolsDropDownOptions = () => {
        return this.init().get("/getAllTools")
    }

    getAllMetricsDropDownOptions = () => {
        return this.init().get("/getAllMetrics")
    }

    getMeasureDropDownOptions = (body) => {
        return this.init().post("/getMeasuresByTool", body)
    }

    getCategoryDropDownOptions = (body) => {
        return this.init().post("/getCategoryByMeasure", body)
    }

    getMetricDropDownOptions = (body) => {
        return this.init().post("/getMetricByCategory", body)
    }

    getRangesNamesDropDownOptions = (body) => {
        return this.init().post("/getRatiosNamesByMetric", body)
    }
}
