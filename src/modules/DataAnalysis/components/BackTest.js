import React, { useState, useEffect, useContext } from "react";
import {
  TextField,
  MenuItem,
  Grid,
  Card,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  Button,
  IconButton,
  Typography,
  Ima,
} from "@mui/material";
import { MdCheckCircle } from "react-icons/md";
import BackTestGraph from "./BackTestGraph";
import AuthContext from "../../Core/store/auth-context";

const BackTest = ({ companySymbol }) => {
  const authCtx = useContext(AuthContext);
  const [authToken, setAuthToken] = useState(null);
  const [strategyBackTest, setStrategyBackTest] = useState(null);

  useEffect(() => {
    const CheckUserSession = () => {
      return authCtx.isLoggedIn ? authCtx.token : "";
    };

    const userToken = CheckUserSession();
    setAuthToken(userToken);
  }, []);

  useEffect(() => {
    const fetchStrategyBackTest = async () => {
      try {
        const body = {
          symbol: companySymbol,
        };
        const response = await fetch(
          `
              https://api.invelps.com/api/strategies/getBackTestDataAgainstCompany`,
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
          console.log("Data:", data);
          setStrategyBackTest(data.data);
        } else {
          console.log("Unexpected status code:", response.status);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (authToken) {
      fetchStrategyBackTest();
    }
  }, [authToken]);

  console.log(strategyBackTest);

  return (
    <>
      {strategyBackTest && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontFamily: "Helvetica"
          }}
        >
          <Card
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              fontFamily: "Montserrat",
              maxWidth: "950px",
            }}
          >
            <Box
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <text>Logo</text>
              <img
                src={require("../../../assets/images/4Dots.png")}
                width={70}
                height={35}
              />
            </Box>
            <Box
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <text style={{ fontSize: "30px", fontWeight: "bold" }}>
                {strategyBackTest.company_name}
              </text>
              <Box sx={{ p: 3 }}>
                <div
                  style={{
                    width: 'auto',
                    paddingLeft: '30px',
                    paddingRight: '30px',
                    height: 50,
                    backgroundColor: "#CB6843",
                    position: "relative",
                    transform: "skew(20deg)",
                    textAlign: "center",
                    lineHeight: "50px",
                    color: "#ffffff",
                  }}
                >
                  <div
                    style={{
                      transform: "skew(-20deg)",
                      fontWeight: "bold",
                    }}
                  >
                    {companySymbol}
                  </div>
                </div>
              </Box>
            </Box>
            <text style={{ fontWeight: 600 }}>
              If you&apos;d invested{" "}
              <span style={{ color: "#407879" }}>$ {strategyBackTest.investment_capital_usd}</span> in{" "}
              <span style={{ color: "#CB6843" }}>
                {strategyBackTest.company_name}{companySymbol}
              </span>{" "}
              on {strategyBackTest.starting_price_date}, 3 years later your investment would be worth :
            </text>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: 4,
                  }}
                >
                  <MdCheckCircle color="#407879" size={27} />
                  <text style={{ fontWeight: 600 }}>Bourse:</text>
                  <text style={{ fontWeight: 600, color: "#407879" }}>
                    {strategyBackTest.exchange}
                  </text>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row", gap: 3,  justifyContent: 'space-between' }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      marginTop: 4,
                    }}
                  >
                    <MdCheckCircle color="#407879" size={27} />
                    <text style={{ fontWeight: 600 }}>Industrie:</text>
                    <text style={{ fontWeight: 600, color: "#407879" }}>
                      {strategyBackTest.industry}
                    </text>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      marginTop: 4,
                    }}
                  >
                    <MdCheckCircle color="#407879" size={27} />
                    <text style={{ fontWeight: 600 }}>Sector:</text>
                    <text style={{ fontWeight: 600, color: "#407879" }}>
                      {strategyBackTest.sector}
                    </text>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row", gap: 3,  justifyContent: 'space-between' }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      marginTop: 4,
                    }}
                  >
                    <MdCheckCircle color="#407879" size={27} />
                    <text style={{ fontWeight: 600 }}>Initial Price:</text>
                    <text style={{ fontWeight: 600, color: "#407879" }}>
                      {strategyBackTest.starting_price}
                    </text>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      marginTop: 4,
                    }}
                  >
                    <MdCheckCircle color="#407879" size={27} />
                    <text style={{ fontWeight: 600 }}>Ending Price:</text>
                    <text style={{ fontWeight: 600, color: "#407879" }}>
                      {strategyBackTest.ending_price}
                    </text>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row", gap: 3, justifyContent: 'space-between' }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      marginTop: 4,
                    }}
                  >
                    <MdCheckCircle color="#407879" size={27} />
                    <text style={{ fontWeight: 600 }}>Initial Date:</text>
                    <text style={{ fontWeight: 600, color: "#407879" }}>
                      {strategyBackTest.starting_price_date}
                    </text>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      marginTop: 4,
                    }}
                  >
                    <MdCheckCircle color="#407879" size={27} />
                    <text style={{ fontWeight: 600 }}>Ending Date:</text>
                    <text style={{ fontWeight: 600, color: "#407879" }}>
                      {strategyBackTest.ending_price_date}
                    </text>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row", gap: 3,  justifyContent: 'space-between' }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      marginTop: 4,
                    }}
                  >
                    <MdCheckCircle color="#407879" size={27} />
                    <text style={{ fontWeight: 600 }}>Country:</text>
                    <text style={{ fontWeight: 600, color: "#407879" }}>
                      Bourse australienne des valeurs mobilières
                    </text>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      marginTop: 4,
                    }}
                  >
                    <MdCheckCircle color="#407879" size={27} />
                    <text style={{ fontWeight: 600 }}>Duration:</text>
                    <text style={{ fontWeight: 600, color: "#407879" }}>
                      Bourse australienne des valeurs mobilières
                    </text>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row", gap: 3,  justifyContent: 'space-between' }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      marginTop: 4,
                    }}
                  >
                    <MdCheckCircle color="#407879" size={27} />
                    <text style={{ fontWeight: 600 }}>Total Shares:</text>
                    <text style={{ fontWeight: 600, color: "#407879" }}>
                      {strategyBackTest.total_shares}
                    </text>
                  </Box>
                 
                </Box>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 3,
                    alignItems: "center",
                    marginTop: "70px",
                  }}
                >
                  <img
                    src={require("../../../assets/images/Isolation_Mode.png")}
                  />
                  <Box sx={{ p: 3, transform: "rotate(-1deg)" }}>
                    <div
                      style={{
                        width: 200,
                        height: 50,
                        backgroundColor: "#CB6843",
                        position: "relative",
                        transform: "skew(-10deg)",
                        textAlign: "center",
                        lineHeight: "50px",
                        color: "#ffffff",
                      }}
                    >
                      <div
                        style={{
                          transform: "skew(10deg)",
                          fontWeight: "bold",
                          fontSize: "25px",
                        }}
                      >
                        $ {strategyBackTest.total_investment_value_usd}
                      </div>
                    </div>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 3,
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ p: 3, transform: "rotate(-1deg)" }}>
                    <div
                      style={{
                        width: 400,
                        height: 80,
                        backgroundColor: "#CB6843",
                        position: "relative",
                        transform: "skew(-10deg)",
                        textAlign: "center",
                        lineHeight: "50px",
                        color: "#ffffff",
                      }}
                    >
                      <div
                        style={{
                          transform: "skew(10deg)",
                          fontWeight: "bold",
                          fontSize: "22px",
                        }}
                      >
                        TOTAL RATE OF RETURN {strategyBackTest.total_investment_value_usd}
                      </div>
                    </div>
                  </Box>
                </Box>
                <Box>
                  <Box sx={{ p: 3 }}>
                    <div
                      style={{
                        width: 400,
                        height: 80,
                        backgroundColor: "#CB6843",
                        color: "#ffffff",
                        borderRadius: "30px",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        padding: "20px",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "25px",
                        }}
                      >
                        ANNUALIZED RATE OF RETURN
                      </div>
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "25px",
                        }}
                      >
                        {strategyBackTest.investment_total_return}%
                      </div>
                    </div>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  p: 3,
                  border: "1px solid #CB6843",
                  backgroundColor: "#FAF2ED",
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontSize: "22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  height: "130px",
                  width: "350px",
                }}
              >
                IS THIS A GOOD
                <br /> OPPORTUNITY?
                <Button sx={{ backgroundColor: "#CB6843", color: "white" }}>
                  Click here to find out!
                </Button>
              </Box>
              <BackTestGraph
                dividendTotal={strategyBackTest.dividend_income_usd}
                montantInvesti={strategyBackTest.invested_capital}
                gainPerteEnCapital={strategyBackTest.invested_capital}
              />
            </Box>
          </Card>
          {/* <Card>
          <Box sx={{ p: 3 }}>
            <text>
              si vous aviez investi $ 1000 dans Telix Pharmaceuticals Ltd (TLX.AX)
              le 01/01/2020, 3 ans plus tard, votre investissement vaudrait :
            </text>
          </Box>
        </Card> */}
        </Box>
      )}
    </>
  );
};

export default BackTest;
