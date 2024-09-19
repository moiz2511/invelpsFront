// BreadcrumbsContext.js
import React, { createContext, useState, useContext } from "react";

// Create a context for breadcrumbs
const BreadcrumbsContext = createContext();

// Create a provider component
export const BreadcrumbsProvider = ({ children }) => {
  const [breadcrumbs, setBreadcrumbs] = useState([
    { label: "Investor Screener", isParent: true },
  ]);

  const addBreadcrumb = (label) => {
    setBreadcrumbs((prev) => [...prev, { label, isParent: false }]);
  };

  return (
    <BreadcrumbsContext.Provider value={{ breadcrumbs, addBreadcrumb }}>
      {children}
    </BreadcrumbsContext.Provider>
  );
};

// Custom hook to use the breadcrumbs context
export const useBreadcrumbs = () => useContext(BreadcrumbsContext);
