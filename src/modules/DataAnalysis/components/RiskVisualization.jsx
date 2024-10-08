import React, { useContext, useState, useEffect } from "react";
import HorizontalBarChart from "./charts/HorizontalBar";
import DonutPieChart from "./charts/DonoutChart";
import GeoChartComponent from "./charts/GeoCharts";
import AuthContext from "../../Core/store/auth-context";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Breadcrumbs, Button, Card, Typography } from "@mui/material";
import Constants from "../../../Constants.json";
import BreadcrumbsComponent from "../../Core/components/Layout/BreadCrumbs";
import { useSwitch } from "../../../utils/context/SwitchContext";
import AssessmentIcon from "@mui/icons-material/Assessment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { FaBuilding } from "react-icons/fa";

const RiskVisualization = () => {
  const navigate = useNavigate();
  const [perExchangeKPI, setPerExhangeKPI] = useState([]);
  const [perSectorKPI, setPerSectorKPI] = useState([]);
  const [perMarketKPI, setPerMarketKPI] = useState([]);
  const [authToken, setAuthToken] = useState(null);
  const [mapsData, setMapsData] = useState([]);
  const authCtx = useContext(AuthContext);
  const location = useLocation();
  const selectedStrategy = location.state.selectedStrategy;
  const selectedLabel = location.state.selectedStrategyLabel;
  const navigation = useNavigate();
  //   console.log('selected Strategy',selectedLabel);
  useEffect(() => {
    const CheckUserSession = () => {
      return authCtx.isLoggedIn ? authCtx.token : "";
    };

    const userToken = CheckUserSession();
    setAuthToken(userToken);
  }, []);

  console.log(selectedStrategy);
  console.log(selectedLabel);

  const fetchGraphData = async () => {
    try {
      const body = {
        strategy_name: selectedStrategy,
      };
      const response = await fetch(
        Constants.BACKEND_SERVER_BASE_URL + "/strategies/getStrategyGraphData",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        console.log(data);
        setPerExhangeKPI(data.data.companies_per_exchanges_KPI);
        setPerSectorKPI(data.data.companies_per_sector_KPI);
        setPerMarketKPI(data.data.companies_per_market_cap_KPI);
      } else {
        console.log("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchMapsData = async () => {
    try {
      const body = {
        strategy_name: selectedStrategy,
      };
      const response = await fetch(
        Constants.BACKEND_SERVER_BASE_URL +
          "/strategies/getStrategyCountryData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        console.log("Company", data.data);
        setMapsData(data.data);
        console.log("Countries Data", data.data);
      } else {
        console.log("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    if (selectedStrategy !== null) {
      fetchGraphData();
      fetchMapsData();
    }
  }, [selectedStrategy, authToken]);

  const [activeButton, setActiveButton] = useState("RETURNS AND RISK");
  const [selectedStrategyLabel, setSelectedStrategyLabel] =
    useState(selectedLabel);
  const [showVisualData, setShowVisualData] = useState(false);
  const [tab2, setTab2] = useState("");
  const { isSwitch2, setIsSwitch2 } = useSwitch();
  const buttons = [
    {
      id: "OVERVIEW",
      label: "OVERVIEW",
      icon: <AssessmentIcon />,
      component: "OverviewContent",
    },
    {
      id: "RETURNS AND RISK",
      label: "RETURNS AND RISK",
      icon: <TrendingUpIcon />,
      component: "ReturnsRiskContent",
    },
    {
      id: "HISTORICAL PRICES",
      label: "HISTORICAL PRICES",
      icon: <FaBuilding />,
      component: "HistoricalPlacesContent",
    },
  ];

  console.log(activeButton);
  console.log(selectedStrategyLabel);
  console.log(showVisualData);
  console.log(tab2);
  console.log(isSwitch2);

  useEffect(() => {
    const handleScrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };
    handleScrollToTop();
  }, []);

  return (
    <>
      <BreadcrumbsComponent
        parent={"Investor Screener"}
        subParent={selectedStrategyLabel}
        child={activeButton}
        setSelectedStrategyLabel={setSelectedStrategyLabel}
        setTab2={setTab2}
        setActiveButton={setActiveButton}
        setShowVisualData={setShowVisualData}
      ></BreadcrumbsComponent>

      <Box padding={2} display={"flex"} gap={3}>
        {buttons.map((button) => (
          <Button
            key={button.id}
            sx={{
              backgroundColor: activeButton === button.id ? "#427879" : "white",
              color: activeButton === button.id ? "white" : "black",
              "&:hover": {
                backgroundColor:
                  activeButton === button.id ? "#427879" : "#427879",
                color: activeButton === button.id ? "white" : "white",
              },
            }}
            startIcon={button.icon}
            onClick={() => {
              setActiveButton(button.id);
              setIsSwitch2(false);
              setTab2("");
              if (selectedStrategyLabel) {
                setSelectedStrategyLabel(null);
                setShowVisualData(false);
                navigate("/dataanalysis/investorscreeners");
              }
            }}
          >
            {button.label}
          </Button>
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          justifyContent: "space-around",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr",
            md: "1.5fr 1fr",
          },
          gap: 2,
          my: 2,
        }}
      >
        <Card
          sx={{
            padding: 4,
            gap: 3,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <text style={{ fontWeight: "bolder" }}> Companies Per Country</text>

          <GeoChartComponent data={mapsData} />
        </Card>
        <Box style={{ display: "flex", gap: 6, flexDirection: "column" }}>
          <Card
            sx={{
              padding: 2,
            }}
          >
            <text style={{ fontWeight: "bolder" }}>
              {" "}
              Companies Per Sector (%){" "}
            </text>
            <HorizontalBarChart data={perSectorKPI} />
          </Card>
          <Card
            sx={{
              padding: 4,
              paddingBottom: { xs: 8, md: 4 },
              display: "flex",
              flexDirection: "column",
              height: 250,
            }}
          >
            <text style={{ fontWeight: "bolder" }}>
              {" "}
              Companies Per Market Cap (%){" "}
            </text>
            <DonutPieChart
              data={perMarketKPI}
              dataKey={"total_count"}
              nameKey={"market_cap_class"}
            ></DonutPieChart>
            {/* <PieChart
                    graphData={perMarketKPI}
                    nameData={(item) => item.market_cap_class}
                  /> */}
          </Card>
        </Box>
      </Box>
    </>
  );
};

export default RiskVisualization;
