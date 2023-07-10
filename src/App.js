import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './modules/Core/components/Layout/Layout';
import Landing from './modules/Core/components/LangingPage/Landing';
import './App.css';
import ScreenModel from './modules/Context/components/ScreenModel';
import AnalysisModel from './modules/Context/components/AnalysisModel';
import CompanyProfile from './modules/DataAnalysis/components/CompanyProfile';
import DAFundamentalChart from './modules/DataAnalysis/components/FundamentalChart';
import DataProcessingRanges from './modules/DataProcessing/components/Ranges';
import InvestingStyle from './modules/Context/components/InvestingStyle';
import DpInvestingStyle from './modules/DataProcessing/components/InvestingStyle';
import DpScreenModel from './modules/DataProcessing/components/ScreenModel';
import DpAnalysisModel from './modules/DataProcessing/components/AnalysisModel';
import DataAcquisitionAPi from './modules/DataAcquisition/components/DataAcquisition';
import Automation from './modules/DataAcquisition/components/Automations';
import DAFinancials from './modules/DataAnalysis/components/Financials';
import DAMarketData from './modules/DataAnalysis/components/MarketData';
import DAKeyMetrics from './modules/DataAnalysis/components/KeyMetrics';
import DARanges from './modules/DataAnalysis/components/Ranges';
import DALinearRegression from './modules/DataAnalysis/components/LinearRegression';
import DPCreateMetrics from './modules/DataProcessing/components/CreateMetrics';
import DPFundamentalChart from './modules/DataProcessing/components/FundamentalChart';
import DataAcquisitionFileUpload from './modules/DataAcquisition/components/DataAcquisitionFileUpload';
import AuthContext from './modules/Core/store/auth-context';
import LoginForm from './modules/Core/components/Login/login-page';
import ForgotPasswordForm from './modules/Core/components/ForgotPassword/ForgotPassword';
import UpdatePasswordForm from './modules/Core/components/ForgotPassword/UpdatePassword';
import ResetPasswordForm from './modules/Core/components/ResetPassword/ResetPassword';
import SignUpForm from './modules/Core/components/SignUp/SignUp';
import ManageUsers from './modules/Core/components/UserManagement/ManageUsers';
import ContactPage from './modules/Core/components/ContactPage/ContactPage';
import ContactsManagement from './modules/Core/components/ContactedMembersmanagement/ContactsManagement';
import ContextFundamentalChart from './modules/Context/components/FundamentalChart';
import DAScreener from './modules/DataAnalysis/components/Screener';
import SavedScreener from './modules/DataAnalysis/components/SavedScreener';

import DataController from './modules/DataAcquisition/components/DataController';
import Dashboard from './modules/Profile/compoenents/Dashboard';
// import Virtualize from './modules/UIUtils/CustomSelect';

function App() {
  const authCtx = useContext(AuthContext);
  return (
    <Router>
      <Layout>
        <Routes>
          {/* <Route path="">
            <Redirect to={authCtx.isLoggedIn ? "/context/investingstyle" : "/login"} />
          </Route> */}
          <Route path='/' exact element={<Landing />} />
          {!authCtx.isLoggedIn && (
            <Route path='/login' element={<LoginForm />} />
          )}
          {!authCtx.isLoggedIn && (
            <Route path='/forgotpassword' element={<ForgotPasswordForm />} />
          )}
          {!authCtx.isLoggedIn && (
            <Route
              path='/forgotpassword/update'
              element={<UpdatePasswordForm />}
            />
          )}
          {authCtx.isLoggedIn && (
            <Route
              path='/user/reset/password'
              element={<ResetPasswordForm />}
            />
          )}
          {!authCtx.isLoggedIn && (
            <Route path='/signup' element={<SignUpForm />} />
          )}
          <Route path='/contact' element={<ContactPage />} />
          {authCtx.isLoggedIn && (
            <React.Fragment>
              <Route path='/context/screenmodel' element={<ScreenModel />} />
              <Route
                path='/context/analysismodel'
                element={<AnalysisModel />}
              />
              <Route
                path='/context/investingstyle'
                element={<InvestingStyle />}
              />
              <Route
                path='/context/chartanalysis'
                element={<ContextFundamentalChart />}
              />
              {/* Tabs */}
              <Route
                path='/profile/dashboard'
                element={<Dashboard />}
              />

              <Route
                path='/dataanalysis/profile'
                element={<CompanyProfile />}
              />
              <Route
                path='/dataanalysis/fundamentalchart'
                element={<DAFundamentalChart />}
              />
              <Route
                path='/dataanalysis/financials'
                element={<DAFinancials />}
              />
              <Route
                path='/dataanalysis/historicaldata'
                element={<DAMarketData />}
              />
              <Route
                path='/dataanalysis/keymetrics'
                element={<DAKeyMetrics />}
              />
              <Route path='/dataanalysis/ranges' element={<DARanges />} />
              <Route
                path='/dataanalysis/linearregression'
                element={<DALinearRegression />}
              />
              <Route path='/dataanalysis/screener' element={<DAScreener />} />
              <Route path='/dataanalysis/screener/:id' element={<SavedScreener />} />
              {/* <Route path='/dataanalysis/reportedfinancials' element={<DAReportedFinancials />} />
            <Route path='/dataanalysis/financialnotes' element={<DAFinancialNotes />} /> */}
              {/* <Route path='/dataanalysis/rates' element={<DARates />} />

            <Route path='/datavisualization' element={<DataVisualization />} /> */}
            </React.Fragment>
          )}
          {authCtx.isLoggedIn && authCtx.role === 'Admin' && (
            <React.Fragment>
              <Route
                path='/dataprocessing/investingstyle'
                element={<DpInvestingStyle />}
              />
              <Route
                path='/dataprocessing/analysismodel'
                element={<DpAnalysisModel />}
              />
              <Route
                path='/dataprocessing/screenModel'
                element={<DpScreenModel />}
              />
              <Route
                path='/dataprocessing/ranges'
                element={<DataProcessingRanges />}
              />
              <Route
                path='/dataprocessing/createMetrics'
                element={<DPCreateMetrics />}
              />
              <Route
                path='/dataprocessing/fundamentalchart'
                element={<DPFundamentalChart />}
              />

              <Route
                path='/dataacquisition/api'
                element={<DataAcquisitionAPi />}
              />
              <Route
                path='/dataacquisition/automation'
                element={<Automation />}
              />
              <Route
                path='/dataAcquisition/fileimport'
                element={<DataAcquisitionFileUpload />}
              />
              <Route
                path='/dataAcquisition/datacontrol'
                element={<DataController />}
              />

              <Route path='/admin/manageUsers' element={<ManageUsers />} />
              <Route
                path='/admin/manageContacts'
                element={<ContactsManagement />}
              />
            </React.Fragment>
          )}

          <Route path='*' element={<Landing />} />
          {/* <Route path='/test' element={<Virtualize />} /> */}

          {/* <Route path='/dataanalysis/profile'>
            <Route path=':company' element={<CompanyProfile />} />
            <Route path=':company/:table' element={<CompanyProfile />} />
            <Route path='' element={<CompanyProfile />} />
          </Route> */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
