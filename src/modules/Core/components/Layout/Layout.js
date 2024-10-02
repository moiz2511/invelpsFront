import { Fragment } from "react";
import MainNavigation from "./MainNavigation";
import Footer from "../Footer/Footer";
import { useLocation } from "react-router-dom";

const Layout = (props) => {
  const location = useLocation();

  const shouldShowFooter = () => {
    const pathsWithoutFooter = ["/login", "/signup"];
    return !pathsWithoutFooter.includes(location.pathname);
  };

  // const layoutContainerStyle = {
  //   display: "flex",
  //   flexDirection: "column",
  //   minHeight: "100vh",
  // };

  // const mainStyle = {
  //   flex: 1,
  // };

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <MainNavigation />
      <main style={{ flex: 1 }}>{props.children}</main>
      {shouldShowFooter() && <Footer />}
    </div>
  );
};

export default Layout;
