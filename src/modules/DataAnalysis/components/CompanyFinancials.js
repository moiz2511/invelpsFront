import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../../Core/store/auth-context";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import Constants from "../../../Constants.json";
import { MdOutlineCompassCalibration } from "react-icons/md";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#CB6843",
    color: theme.palette.common.white,
    padding: 12,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    padding: 12,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type()": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const CompanyFinancials = ({
  companyName,
  companyImage,
  exchangeName,
  strategyName,
}) => {
  const authCtx = useContext(AuthContext);
  const [authToken, setAuthToken] = useState(null);
  // const [exchangeName, setExchangeName] = useState(null);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [companySymbol, setCompanySymbol] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [stockPrice, setStockPrice] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [isQuarter, setIsQuarter] = useState(false);
  const [selectedTab, setSelectedTab] = useState(
    isQuarter ? "INCOME_QUARTER" : "INCOME"
  );

  const [financialPeriod, setFinancialPeriod] = useState("Annual");
  const [divider, setDivider] = useState(1);

  const [valueScale, setValueScale] = useState("thousands");

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    const CheckUserSession = () => {
      return authCtx.isLoggedIn ? authCtx.token : "";
    };

    const userToken = CheckUserSession();
    setAuthToken(userToken);
  }, []);

  useEffect(() => {
    setSelectedTab(isQuarter ? "INCOME_QUARTER" : "INCOME");
  }, [isQuarter]);

  // useEffect(() => {
  //   const fetchExchangeName = async () => {
  //     try {
  //       const body = {
  //         companyName: companyName,
  //       };
  //       const response = await fetch(
  //         `https://api.invelps.com/api/getExchangesByCompanyName`,
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${authToken}`,
  //           },
  //           body: JSON.stringify(body),
  //         }
  //       );

  //       const data = await response.json();

  //       if (response.status === 200) {
  //         console.log("Data:", data);
  //         setExchangeName(data.resp_data[0].exchange);
  //       } else {
  //         console.log("Unexpected status code:", response.status);
  //       }
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //   };
  //   if (authToken && companyName) fetchExchangeName();
  // }, [authToken, companyName]);

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const body = {
          company: companyName,
          exchange: exchangeName,
        };
        const response = await fetch(
          `https://api.invelps.com/api/companies/profile`,
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
          console.log("Data:", data);
          setCompanySymbol(data.resp_data.profile[0].symbol);
          setCurrency(data.resp_data.profile[0].currency);
          setStockPrice(data.resp_data.profile[0].price);
        } else {
          console.log("Unexpected status code:", response.status);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    if (authToken && exchangeName) fetchCompanyProfile();
  }, [authToken, exchangeName]);

  console.log("Company Name", companyName);
  console.log("Exchange Name", exchangeName);

  useEffect(() => {
    // const fetchFinancials = async () => {
    //   try {
    //     setTableData([]);
    //     setTableHeaders([]);
    //     const body = {
    //       company: companyName,
    //       display: "Value",
    //       exchange: exchangeName,
    //       from_year: "2013",
    //       period: "Annual",
    //       quarter: [],
    //       table: selectedTab,
    //       to_year: "2023",
    //     };
    //     const response = await fetch(
    //       `https://api.invelps.com/api/dataAnalysis/financials`,
    //       {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //           Authorization: `Bearer ${authToken}`,
    //         },
    //         body: JSON.stringify(body),
    //       }
    //     );

    //     const data = await response.json();

    //     if (response.status === 200) {
    //       console.log("Data:", data);
    //       setTableHeaders(data.date_range);
    //       setTableData(data.return_list);
    //     } else {
    //       console.log("Unexpected status code:", response.status);
    //     }
    //   } catch (error) {
    //     console.error("Error:", error);
    //   }
    // };

    if (authToken && companySymbol) {
      fetchFinancials();
    }
  }, [authToken, companySymbol, selectedTab, financialPeriod, isQuarter]);

  function calculateTrend(tenYearData) {
    let trendCounter = 0;

    for (let i = 0; i < tenYearData.length - 1; i++) {
      if (tenYearData[i].value < tenYearData[i + 1].value) {
        trendCounter++;
      } else if (tenYearData[i].value > tenYearData[i + 1].value) {
        trendCounter--;
      }
    }

    // Define a base size for the icons
    const baseSize = 18;
    const maxTrendValue = Math.min(Math.abs(trendCounter), 5);
    const iconSize = baseSize + maxTrendValue * 3; 

    if (trendCounter > 0) {
      return <IoArrowUp color="green" size={iconSize} />;
    } else if (trendCounter < 0) {
      return <IoArrowDown color="red" size={iconSize} />;
    } else {
      return "-";
    }
  }

  const fetchFinancials = async () => {
    try {
      setTableData([]);
      setTableHeaders([]);
      const response = await fetch(
        `https://api.invelps.com/api/strategies/financials/updatedFinancials?strategy=${strategyName}&symbol=${companySymbol}&type=${selectedTab}&yearly_type=${
          isQuarter ? "quarterly" : "yearly"
        }`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        console.log("Financial Data:", data);
        let yearHeader = data?.data.metrics[0]?.ten_year_data?.map(
          (item) => item.date
        );
        console.log("Year Headers===>", yearHeader);
        setTableData(data?.data?.metrics);
        setTableHeaders(yearHeader);
      } else {
        console.log("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const convertValue = (value, valueScale) => {
    let amount = parseInt(value?.split(",").join(""));
    let returnValue = amount;
    console.log("Return Value Before ==>", returnValue);

    switch (valueScale) {
      case "thousands":
        returnValue = amount / 1000;
      case "millions":
        returnValue = amount / 1000000;
      case "billions":
        returnValue = amount / 1000000000;
      default:
        returnValue = amount;

        console.log(typeof returnValue);
        console.log("Return Value After ===>", returnValue);
        return returnValue;
    }
    return 0;
  };

  function formatNumberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function convertNumber(value, unit) {
    const units = {
      thousands: 1e3,
      millions: 1e6,
      billions: 1e9,
    };

    // Check if the provided unit is valid and if the value is a number
    if (!units[unit] || isNaN(value)) {
      console.error(
        "Invalid unit or value. Use 'thousands', 'millions', or 'billions' for units."
      );
      return null;
    }

    // Convert the value based on the unit and format with commas
    const convertedValue = value / units[unit];
    return convertedValue.toFixed(2); // Assuming you want two decimal places
  }

  const handleValueScaleChange = (e) => {
    setValueScale(e.target.value);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          paddingInline: 20,
          paddingBlock: 10,
          gap: 10,
        }}
      >
        <img src={companyImage} height={40} width={40} />
        <h1 style={{ fontFamily: "Montserrat", fontWeight: 700, fontSize: 28 }}>
          {" "}
          {companyName} ({companySymbol}){" "}
          <span style={{ color: "gray" }}>
            {currency} {stockPrice}
          </span>
        </h1>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          style={{ marginBottom: 10 }}
        >
          <Tab
            value={isQuarter ? "INCOME_QUARTER" : "INCOME"}
            label="Income Statement"
          />
          <Tab
            value={isQuarter ? "BSHEET_QUARTER" : "BSHEET"}
            label="Balance Sheet Statement"
          />
          <Tab
            value={isQuarter ? "CFLOW_QUARTER" : "CFLOW"}
            label="Cash Flow Statement"
          />
        </Tabs>
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FormControl>
            <FormLabel id="row-radio-buttons-group-label">
              Value Scale
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={valueScale}
              onChange={handleValueScaleChange}
            >
              <FormControlLabel
                value="thousands"
                control={<Radio />}
                label="Thousands"
              />
              <FormControlLabel
                value="millions"
                control={<Radio />}
                label="Millions"
              />
              <FormControlLabel
                value="billions"
                control={<Radio />}
                label="Billions"
              />
            </RadioGroup>
          </FormControl>

          <Button variant="contained" onClick={() => setIsQuarter(false)}>
            Annual
          </Button>
          <Button variant="contained" onClick={() => setIsQuarter(true)}>
            Quarterly
          </Button>
        </div>
      </div>

      <TableContainer>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell style={{ fontFamily: "Montserrat" }}>
                Metrics ({currency})
              </StyledTableCell>
              <StyledTableCell style={{ fontFamily: "Montserrat" }}>
                Trends
              </StyledTableCell>
              {tableHeaders.map((header, index) => (
                <StyledTableCell
                  key={index}
                  style={{ fontFamily: "Montserrat" }}
                >
                  {header}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {tableData?.map((rowData, rowIndex) => (
              <StyledTableRow key={rowIndex}>
                <StyledTableCell style={{ fontFamily: "Montserrat" }}>
                  {rowData.label}
                </StyledTableCell>
                <StyledTableCell style={{ fontFamily: "Montserrat" }}>
                  {calculateTrend(rowData.ten_year_data)}
                </StyledTableCell>
                {rowData.ten_year_data.map((metric, metricIndex) => (
                  <StyledTableCell
                    key={metricIndex}
                    style={{ fontFamily: "Montserrat" }}
                  >
                    {convertNumber(metric.value, valueScale)}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CompanyFinancials;
