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

export default class ScreenerService {

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

    getAllCountries = () => {
        return this.init().get("/screener/company/countries")
    }
    getAllExchanges = () => {
        return this.init().get("/screener/company/exchanges")
    }

    getExchangesByCountry = (country) => {
        return this.init().post("/screener/countries/exchange", {country});
    }

    getCityByCountryAndExchange = (country, exchange) => {
        return this.init().post("/screener/city", {country, exchange});
    }
    getSectorByExchange = (exchange) => {
        return this.init().post("/getSectorByExchange", {exchange});
    }
    getIndustryByExchangeSector = (exchange, sector) => {
        return this.init().post("/getIndustryByExchangeSector", {exchange, sector});
    }

    getCategories = () => {
        return this.init().get("/screener/getCategories");
    }

    getMetricsByCategory = (category) => {
        return this.init().post("/screener/getMetrics", {category});
    }

    getCompanies = (body) => {
        return this.init().post("/screener/getCompanies/filers", body);
    }

    getCompaniesData = (symbols, period) => {
        return this.init().post("/screener/company/data", {symbols, period})
    }

    getCompaniesDataWithMetricFilters = (body) => {
        return this.init().post("screener/filter/companies", body)
    }
}
