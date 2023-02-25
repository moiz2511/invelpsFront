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

export default class ScreenModelService {

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

    tickersApi = () => {
        this.client = axios.create({
            baseURL: Constants.FINANCIAL_MODELLING_API_BASE_URL,
            timeout: Constants.APP_API_TIMEOUT,
            headers: requestHeaders,
        });
        return this.client;
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

    getScreenModelsData = (data) => {
        return this.init().post("/context/getScreenModels", data)
    }

    getCompaniesByScreenModels = (data) => {
        return this.init().post("/context/companies/filter", data)
    }

    // getCompanyStockPrice = (companySymbol, apiKey) => {
    //     return this.tickersApi().get("/v3/quote-short/" + companySymbol + "?apikey=" + apiKey)
    // }

    // getCompanyMktCap = (companySymbol, apiKey) => {
    //     return this.tickersApi().get("/v3/market-capitalization/" + companySymbol + "?apikey=" + apiKey)
    // }

    getCompaniesQuote = (companySymbols) => {
        return this.init().get("/company/quote/" + companySymbols)
    }

    getCompanyStockPrice = (companySymbol) => {
        return this.init().get("/getStockPrice/company/" + companySymbol)
    }

    getCompanyMktCap = (companySymbol) => {
        return this.init().get("/getMarketCap/company/" + companySymbol)
    }

    getStategies = () => {
        return this.init().get("/getstrategy")
    }
}
