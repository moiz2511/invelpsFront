import React from 'react';
import * as axios from 'axios';
import Constants from '../../../Constants.json';
import AuthContext from '../../Core/store/auth-context';

let requestHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

function CheckUserSession() {
  const authCtx = React.useContext(AuthContext);
  return authCtx.isLoggedIn ? authCtx.token : '';
}

export default class DataAcquisitionService {
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
    this.client.interceptors.request.use((request) => {
      if (this.token !== '') {
        request.headers.common.Authorization = `Bearer ${this.token}`;
      }
      return request;
    });
    return this.client;
  };

  getExchangeValues = () => {
    return this.init().post('/getExchangeValues');
  };

  getUniqueExchanges = () => {
    return this.init().post('/getUniqueExchanges');
  };
  GetSectorsByExchnage = (body) => {
    return this.init().post('/getSectorByExchange', body);
  };

  getIndustryByExchangeAndSector = (body) => {
    return this.init().post('/getIndustryByExchangeSector', body);
  };

  getCompaniesByIndustryExchangeAndSector = (body) => {
    return this.init().post('/getCompaniesByExchangeSectorIndustry', body);
  };

  getDataAcquisitionTypes = () => {
    return this.init().get('/dataAcquisitionApiTypes');
  };

  getDataAcquisitionYearLimits = () => {
    return this.init().get('/dataAcquisitionYearLimits');
  };

  dataAcquisitionApi = (body) => {
    return this.init().post('/dataAcquisition/Api', body);
  };

  dataAcquisitionFileUpload = (body) => {
    return this.init().post('/dataAcquisition/fileUpload', body);
  };
}
