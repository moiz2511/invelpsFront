import React, { useState, useEffect, useContext } from "react";
import Modal from "@mui/material/Modal";
import { Box, Typography, Tab, Tabs, IconButton } from "@mui/material";
import Mentor from "./Mentor";
import Criteria from "./Criteria";
import { IoClose } from "react-icons/io5";
import AuthContext from "../../Core/store/auth-context";

const InvestorModal = ({ showInvestor, closeInvestorModal, investor }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [investorDetails, setInvestorDetails] = useState(null);
  const [investorTableData, setInvestorTableData] = useState([]);
  const authCtx = useContext(AuthContext);
  const [authToken, setAuthToken] = useState(null);

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
    const fetchInvestorDetails = async () => {
      try {
        const body = {
          investor: investor,
        };
        const response = await fetch(
          `https://api.invelps.com/api/strategies/getInvestorDetails`,
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
          setInvestorDetails(data.investor_details);
        } else {
          console.log("Unexpected status code:", response.status);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const fetchInvestorTableData = async () => {
      try {
        const body = {
          investor: investor,
        };
        const response = await fetch(
          `https://api.invelps.com/api/strategies/getInvestorBottomTable`,
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
          setInvestorTableData(data.investor_details);
        } else {
          console.log("Unexpected status code:", response.status);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (authToken && investor) {
      fetchInvestorDetails();
      fetchInvestorTableData();
    }
  }, [authToken, investor]);

  console.log(investor);
  console.log(investorDetails);

  return (
    <Modal
      open={showInvestor}
      onClose={closeInvestorModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        style={{
          backgroundColor: "white",
          height: "100%",
          width: "100%",
          overflow: "auto",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 10,
            right: 20,
            backgroundColor: "rgba(0,0,0,0.1)",
            borderRadius: "50%",
            padding: 5,
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1,
          }}
          onClick={closeInvestorModal}
        >
          <IoClose color="black" size={20} />
        </span>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="Tabs for Investor Modal"
        >
          <Tab label="Investor Profile" />
          <Tab label="Screen Criterias" />
        </Tabs>
        {selectedTab === 0 && (
          <Mentor
            investorDetails={investorDetails}
            investorTableData={investorTableData}
          />
        )}
        {selectedTab === 1 && (
          <Criteria
            investor={investor}
            investorDetails={investorDetails}
            investorTableData={investorTableData}
          />
        )}
      </Box>
    </Modal>
  );
};

export default InvestorModal;
