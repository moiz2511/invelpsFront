import React, { createContext, useContext, useState } from "react";

export const SwitchContext = createContext({});

export const SwitchProvider = ({ children }) => {
  const [isSwitch1, setIsSwitch1] = useState(false);
  const [isSwitch2, setIsSwitch2] = useState(false);
  const [isSwitch3, setIsSwitch3] = useState(false);

  return (
    <SwitchContext.Provider
      value={{ isSwitch1, setIsSwitch1, isSwitch2, setIsSwitch2 }}
    >
      {children}
    </SwitchContext.Provider>
  );
};

export const useSwitch = () => {
  const context = useContext(SwitchContext);
  if (!context) {
    throw new Error("useSwitch must be used within a SwitchProvider");
  }
  return context;
};
