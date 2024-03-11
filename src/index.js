import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { StyledEngineProvider } from "@mui/material/styles";
import App from "./App";
import { AuthContextProvider } from "./modules/Core/store/auth-context";
import { SwitchProvider } from "./utils/context/SwitchContext";

// import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,
  // document.getElementById('root')
  <AuthContextProvider>
    <StyledEngineProvider injectFirst>
      <SwitchProvider>
        <App />
      </SwitchProvider>
    </StyledEngineProvider>
  </AuthContextProvider>,
  document.querySelector("#root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
