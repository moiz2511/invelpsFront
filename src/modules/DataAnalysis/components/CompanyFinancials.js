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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import Constants from "../../../Constants.json";
import { MdOutlineCompassCalibration } from "react-icons/md";

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

const CompanyFinancials = ({ companyName }) => {
  const authCtx = useContext(AuthContext);
  const [authToken, setAuthToken] = useState(null);
  const [exchangeName, setExchangeName] = useState(null);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [companySymbol, setCompanySymbol] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [stockPrice, setStockPrice] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Income");
  const [divider, setDivider] = useState(1)

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
  }, [authToken, exchangeName, selectedTab]);
  return (
    <div>
      <div style={{ padding: 20 }}>
        <text
          style={{ fontFamily: "Montserrat", fontWeight: 500, fontSize: 20 }}
        >
          {" "}
          {companyName} ({companySymbol}) {currency} {stockPrice}
        </text>
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
        <div style={{ gap: 5}}  >
        <Button variant="contained" style={{marginRight: 10}} >Annual</Button>
        <Button variant="contained">Quarterly</Button>
        </div>
      </div>

      <TableContainer>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell style={{ fontFamily: "Montserrat" }}>
                Metrics ({currency})
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
                {tableHeaders.map((header, index) => (
                  <StyledTableCell
                    key={index}
                    style={{ fontFamily: "Montserrat" }}
                  >
                    {rowData[header]}
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
