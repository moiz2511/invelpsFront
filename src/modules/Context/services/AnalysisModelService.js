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

export default class AnalysisModelService {

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

    getAllCompanies = () => {
        return this.init().get("/getAllCompanies")
    }

    getExchangesByCompany = (body) => {
        return this.init().post("/getExchangesByCompanyName", body)
    }

    getAllTools = () => {
        return this.init().get("/getAllTools")
    }

    getAnalysisModels = (data) => {
        return this.init().post("context/analysisModel/get", data)
    }

    getStyles = () => {
        return this.init().get("/context/getAllStyles")
    }

    getMentorByStyle = (data) => {
        return this.init().post("/context/mentorsByStyle", data)
    }

    getScreenModelByModel = (data) => {
        return this.init().post("/context/analysisModelsByMentor", data)
    }

    getMeasuresByAnalysisModel = (data) => {
        return this.init().post("/context/getMeasuresByAnalysisModel", data)
    }

    getCategoryByAnalysisModel = (data) => {
        return this.init().post("/context/categoryByAnalysisModel", data)
    }

    getMetricsDropDown = (data) => {
        return this.init().post("/context/getMetrics", data)
    }
}
