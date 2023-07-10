import React, { useState, useEffect, useCallback } from 'react';

let logoutTimer;

const AuthContext = React.createContext({
  token: '',
  refreshToken: '',
  role: '',
  isLoggedIn: false,
  login: (token) => { },
  logout: () => { },
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();
  const remainingDuration = adjExpirationTime - currentTime;
  return remainingDuration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  const storedrefreshToken = localStorage.getItem('refreshToken');
  const storedExpirationDate = localStorage.getItem('expirationTime');
  const storedRole = localStorage.getItem('role');

  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 3600) {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expirationTime');
    localStorage.removeItem('role');
    return null;
  }

  return {
    token: storedToken,
    refreshToken: storedrefreshToken,
    duration: remainingTime,
    role: storedRole
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();

  let initialToken;
  let initialRefreshToken;
  let initialRole;
  let initialExpTime;
  if (tokenData) {
    initialToken = tokenData.token;
    initialRefreshToken = tokenData.refreshToken;
    initialRole = tokenData.role;
    initialExpTime = tokenData.duration;
  }

  const [token, setToken] = useState(initialToken);
  const [refreshToken, setRefreshToken] = useState(initialRefreshToken);
  const [role, setUserRole] = useState(initialRole);
  // const [expTime, setExpTime] = useState(initialExpTime);

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expirationTime');
    localStorage.removeItem('role');

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (token, refreshToken, role, expirationTime) => {
    setToken(token);
    setRefreshToken(refreshToken);
    setUserRole(role);
    localStorage.setItem('role', role)
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('expirationTime', expirationTime);

    const remainingTime = calculateRemainingTime(expirationTime);

    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration);
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token: token,
    refreshToken: refreshToken,
    role: role,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;