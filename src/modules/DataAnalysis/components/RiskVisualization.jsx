import React, { useContext, useState, useEffect } from "react";
import HorizontalBarChart from "./charts/HorizontalBar";
import DonutPieChart from "./charts/DonoutChart";
import GeoChartComponent from "./charts/GeoCharts";
import AuthContext from "../../Core/store/auth-context";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Breadcrumbs, Button, Card, Typography } from "@mui/material";
import Constants from "../../../Constants.json";

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

  const fetchGraphData = async () => {
    try {
      const body = {
        strategy_name: selectedStrategy,
      };
      const response = await fetch(
        `
            https://api.invelps.com/api/strategies/getStrategyGraphData`,
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
  return (
    <>
      {/* <Button
        onClick={() => setShowVisualData(!showVisualData)}
        sx={{
          alignSelf: "flex-start",
          backgroundColor: "#407879",
          color: "rgb(204, 191, 144)",
          ml: 3,
        }}
      >
        Go Back
      </Button> */}
      {/* <text
        onClick={() => {
          navigation("/dataanalysis/investorscreeners");
        }}
        style={{ ml: 1, fontSize: 15, cursor: "pointer" }}
      >
        {">"}{" "}
        <span
          style={{
            color: "#427879",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {selectedLabel}
        </span>{" "}
      </text> */}

      <Breadcrumbs separator={">"} aria-label="breadcrumb" sx={{ ml: 2 }}>
        <div
          onClick={() => {
            navigation("/dataanalysis/investorscreeners");
          }}
        >
          <Typography color="inherit">Invester Screener</Typography>
        </div>

        <Typography
          sx={{ color: "#427879", fontWeight: "bold" }}
          color="inherit"
        >
          {selectedLabel}
        </Typography>
      </Breadcrumbs>

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
          <Button
            onClick={() => navigate("/dataanalysis/investorscreeners")}
            sx={{
              alignSelf: "flex-start",
              backgroundColor: "#407879",
              color: "rgb(204, 191, 144)",
            }}
          >
            Go Back
          </Button>
          <text
            style={{
              fontWeight: "bold",
              fontSize: 25,
            }}
          >
            {" "}
            {selectedLabel}
          </text>
          <text style={{ fontWeight: "bolder" }}> Companies Per Country</text>
          {/* <PieChart
                    graphData={perExchangeKPI}
                    nameData={(item) => item.exchange}
                  /> */}
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
