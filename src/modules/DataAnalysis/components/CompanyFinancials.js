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

const CompanyFinancials = ({ companyName, companyImage }) => {
  const authCtx = useContext(AuthContext);
  const [authToken, setAuthToken] = useState(null);
  const [exchangeName, setExchangeName] = useState(null);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [companySymbol, setCompanySymbol] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [stockPrice, setStockPrice] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Income");
  const [financialPeriod, setFinancialPeriod] = useState("Annual");
  const [divider, setDivider] = useState(1);

  const [valueScale, setValueScale] = useState("thousands");

  console.log(companyName);

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
    const fetchExchangeName = async () => {
      try {
        const body = {
          companyName: companyName,
        };
        const response = await fetch(
          `https://api.invelps.com/api/getExchangesByCompanyName`,
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
          setExchangeName(data.resp_data[0].exchange);
        } else {
          console.log("Unexpected status code:", response.status);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    if (authToken && companyName) fetchExchangeName();
  }, [authToken, companyName]);

  console.log(exchangeName);

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

  useEffect(() => {
    const fetchFinancials = async () => {
      try {
        setTableData([]);
        setTableHeaders([]);
        const body = {
          company: companyName,
          display: "Value",
          exchange: exchangeName,
          from_year: "2013",
          period: "Annual",
          quarter: [],
          table: selectedTab,
          to_year: "2023",
        };
        const response = await fetch(
          `https://api.invelps.com/api/dataAnalysis/financials`,
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
          setTableHeaders(data.date_range);
          setTableData(data.return_list);
        } else {
          console.log("Unexpected status code:", response.status);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (authToken && exchangeName) {
      fetchFinancials();
    }
  }, [authToken, exchangeName, selectedTab, financialPeriod]);

  const claculateTrend = (data) => {
    //console.log(data);
    let lastYear = tableHeaders[tableHeaders.length - 1];
    let secondLastYear = tableHeaders[tableHeaders.length - 2];
    //console.log(lastYear, secondLastYear);
    let lastYearValue = parseInt(data[lastYear]?.split(",").join(""));
    let secondLastYearValue = parseInt(
      data[secondLastYear]?.split(",").join("")
    );
    //console.log(lastYearValue, secondLastYearValue);
    let stockPrice = lastYearValue - secondLastYearValue;
    //console.log(stockPrice);

    if (stockPrice > 0) {
      return <IoArrowUp color="green" size={18} />;
    } else if (stockPrice < 0) {
      return <IoArrowDown color="red" size={18} />;
    } else if (stockPrice === 0) {
      return "-";
    }
  };

  const convertValue = (value, valueScale) => {
    let amount = parseInt(value?.split(",").join(""));
    let returnValue = amount;
    if (amount) {
      switch (valueScale) {
        case "thousands":
          returnValue = amount / 1000;
        case "millions":
          returnValue = amount / 1000000;
        case "billions":
          returnValue = amount / 1000000000;
        default:
          returnValue = value;
      }
      console.log(typeof returnValue);
      return parseInt(returnValue)?.toFixed(valueScale !== "thousands" ? 2 : 0);
    }
    return 0;
  };

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
          <Tab value="Income" label="Income Statement" />
          <Tab value="BalanceSheet" label="Balance Sheet Statement" />
          <Tab value="CashFlows" label="Cash Flow Statement" />
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

          <Button
            variant="contained"
            onClick={() => setFinancialPeriod("Annual")}
          >
            Annual
          </Button>
          <Button
            variant="contained"
            onClick={() => setFinancialPeriod("Quarter")}
          >
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
            {tableData.map((rowData, rowIndex) => (
              <StyledTableRow key={rowIndex}>
                <StyledTableCell style={{ fontFamily: "Montserrat" }}>
                  {rowData.metric}
                </StyledTableCell>
                <StyledTableCell style={{ fontFamily: "Montserrat" }}>
                  {claculateTrend(rowData)}
                </StyledTableCell>
                {tableHeaders.map((header, index) => (
                  <StyledTableCell
                    key={index}
                    style={{ fontFamily: "Montserrat" }}
                  >
                    {convertValue(rowData[header], valueScale)}
                    {valueScale === "thousands"
                      ? "K"
                      : valueScale === "millions"
                      ? "M"
                      : valueScale === "billions"
                      ? "B"
                      : ""}
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
