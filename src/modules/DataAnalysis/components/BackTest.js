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
import BannerImage from "../../../assets/images/Banner.png";

const BackTest = ({ companySymbol, companyLogo }) => {
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
          `https://api.invelps.com/api/strategies/getBackTestDataAgainstCompany`,
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
            fontFamily: "Helvetica",
            position: "relative",
          }}
        >
          <div
            style={{
              height: "200px",
              width: "100%",
              backgroundImage: `url(${BannerImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>

          <Card
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              fontFamily: "Montserrat",
              maxWidth: "950px",
              position: "absolute",
              top: 80,
            }}
          >
            <Box
              sx={{
                p: 1,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <img src={companyLogo} width={50} height={50} />
              <Box
                sx={{
                  px: 2,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <text style={{ fontSize: "30px", fontWeight: "bold" }}>
                  {strategyBackTest.company_name}
                </text>
                <Box sx={{ py: 1, px: 3 }}>
                  <div
                    style={{
                      width: "auto",
                      paddingInline: "20px",
                      background: "linear-gradient(to left,#CC6656, #F26800)",
                      position: "relative",
                      transform: "skew(20deg)",
                      textAlign: "center",
                      lineHeight: "40px",
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
              <img
                src={require("../../../assets/images/4Dots.png")}
                width={70}
                height={35}
              />
            </Box>

            <Box sx={{ px: 4, pt: 2 }}>
              <text style={{ fontWeight: 600 }}>
                If you&apos;d invested{" "}
                <span style={{ color: "#407879" }}>
                  $ {strategyBackTest.investment_capital_usd}
                </span>{" "}
                in{" "}
                <span style={{ color: "#CB6843" }}>
                  {strategyBackTest.company_name} ({companySymbol})
                </span>{" "}
                on {strategyBackTest.starting_price_date},{" "}
                {strategyBackTest.duration} 10 years later your investment would
                be worth:
              </text>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                px: 2,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: 2,
                  }}
                >
                  <MdCheckCircle color="#407879" size={27} />
                  <span style={{ display: "flex", gap: 8 }}>
                    <text style={{ fontWeight: 600 }}>Bourse:</text>
                    <text style={{ fontWeight: 600, color: "#407879" }}>
                      {strategyBackTest.exchange}
                    </text>
                  </span>
                </Box>
                <Box style={{ display: "flex", flexDirection: "row", gap: 6 }}>
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "start",
                        marginTop: 3,
                        gap: 1,
                      }}
                    >
                      <MdCheckCircle color="#407879" size={27} />
                      <span
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <text style={{ fontWeight: 600 }}>Industrie:</text>
                        <text style={{ fontWeight: 600, color: "#407879" }}>
                          {strategyBackTest.industry}
                        </text>
                      </span>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "start",
                        marginTop: 3,
                        gap: 1,
                      }}
                    >
                      <MdCheckCircle color="#407879" size={27} />
                      <span
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <text style={{ fontWeight: 600 }}>Initial Price:</text>
                        <text style={{ fontWeight: 600, color: "#407879" }}>
                          $ {strategyBackTest.starting_price}
                        </text>
                      </span>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "start",
                        marginTop: 3,
                        gap: 1,
                      }}
                    >
                      <MdCheckCircle color="#407879" size={27} />
                      <span
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <text style={{ fontWeight: 600 }}>Initial Date:</text>
                        <text style={{ fontWeight: 600, color: "#407879" }}>
                          {strategyBackTest.starting_price_date}
                        </text>
                      </span>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "start",
                        marginTop: 3,
                        gap: 1,
                      }}
                    >
                      <MdCheckCircle color="#407879" size={27} />
                      <span
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <text style={{ fontWeight: 600 }}>Country:</text>
                        <text style={{ fontWeight: 600, color: "#407879" }}>
                          {strategyBackTest.country}
                        </text>
                      </span>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "start",
                        marginTop: 3,
                        gap: 1,
                      }}
                    >
                      <MdCheckCircle color="#407879" size={27} />
                      <span
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <text style={{ fontWeight: 600 }}>Total Shares:</text>
                        <text style={{ fontWeight: 600, color: "#407879" }}>
                          {strategyBackTest.total_shares}
                        </text>
                      </span>
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "start",
                        marginTop: 3,
                        gap: 1,
                      }}
                    >
                      <MdCheckCircle color="#407879" size={27} />
                      <span
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <text style={{ fontWeight: 600 }}>Sector:</text>
                        <text style={{ fontWeight: 600, color: "#407879" }}>
                          {strategyBackTest.sector}
                        </text>
                      </span>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "start",
                        marginTop: 3,
                        gap: 1,
                      }}
                    >
                      <MdCheckCircle color="#407879" size={27} />
                      <span
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <text style={{ fontWeight: 600 }}>Ending Price:</text>
                        <text style={{ fontWeight: 600, color: "#407879" }}>
                          $ {strategyBackTest.ending_price}
                        </text>
                      </span>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "start",
                        marginTop: 3,
                        gap: 1,
                      }}
                    >
                      <MdCheckCircle color="#407879" size={27} />
                      <span
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <text style={{ fontWeight: 600 }}>Ending Date:</text>
                        <text style={{ fontWeight: 600, color: "#407879" }}>
                          {strategyBackTest.ending_price_date}
                        </text>
                      </span>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "start",
                        marginTop: 3,
                        gap: 1,
                      }}
                    >
                      <MdCheckCircle color="#407879" size={27} />
                      <span
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <text style={{ fontWeight: 600 }}>Duration:</text>
                        <text style={{ fontWeight: 600, color: "#407879" }}>
                          {strategyBackTest.duration}
                        </text>
                      </span>
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    my: 2,
                    border: "1px solid #CB6843",
                    backgroundColor: "#FAF2ED",
                    borderRadius: "10px",
                    fontWeight: 700,
                    fontSize: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    // height: "130px",
                    width: "350px",
                  }}
                >
                  IS THIS A GOOD OPPORTUNITY?
                  <Button
                    sx={{
                      background: "linear-gradient(to left,#CC6656, #F26800)",
                      color: "white",
                      fontFamily: "Helvetica",
                    }}
                  >
                    Click here to find out!
                  </Button>
                </Box>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 3,
                    alignItems: "center",
                  }}
                >
                  <img
                    src={require("../../../assets/images/Isolation_Mode.png")}
                  />
                  <Box sx={{ p: 3, transform: "rotate(-1deg)" }}>
                    <div
                      style={{
                        paddingInline: "20px",
                        paddingBlock: "5px",
                        background: "linear-gradient(to left,#CC6656, #F26800)",
                        position: "relative",
                        transform: "skew(-10deg)",
                        textAlign: "center",
                        color: "#ffffff",
                      }}
                    >
                      <div
                        style={{
                          transform: "skew(10deg)",
                          fontWeight: "bold",
                          fontSize: "20px",
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
                  <Box sx={{ py: 2, px: 3, transform: "rotate(-1deg)" }}>
                    <div
                      style={{
                        width: 400,
                        background: "linear-gradient(to left,#CC6656, #F26800)",
                        position: "relative",
                        transform: "skew(-10deg)",
                        textAlign: "center",
                        color: "#ffffff",
                      }}
                    >
                      <div
                        style={{
                          transform: "skew(10deg)",
                          fontWeight: "bold",
                          fontSize: "22px",
                          paddingBlock: "10px",
                        }}
                      >
                        TOTAL RETURN{" "}
                        {strategyBackTest.total_investment_value_usd} %
                      </div>
                    </div>
                  </Box>
                </Box>
                <Box>
                  <Box sx={{ p: 1 }}>
                    <div
                      style={{
                        background: "linear-gradient(#CC6656, #F26800)",
                        color: "#ffffff",
                        borderRadius: "20px",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        paddingInline: "30px",
                        paddingBlock: "12px",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "18px",
                        }}
                      >
                        ANNUALIZED
                        <br /> RETURN
                      </div>
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "42px",
                        }}
                      >
                        {strategyBackTest.investment_total_return}%
                      </div>
                    </div>
                  </Box>
                </Box>
                <BackTestGraph
                  dividendTotal={strategyBackTest.dividend_income_usd}
                  montantInvesti={strategyBackTest.invested_capital}
                  gainPerteEnCapital={strategyBackTest.invested_capital}
                />
              </Box>
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
