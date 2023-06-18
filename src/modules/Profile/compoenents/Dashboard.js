import React, { useState } from 'react';
import { Box, Button, Tab, Tabs, Typography } from '@mui/material';
import ScreenModel from './ScreenerModelTasks';
import BasicSettings from './BasicSettings';
import AllScreenTasks from './AllScreenModelTasks';
import SocialAuth from './SocialAuth';

const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [tab2Value, setTab2Value] = useState(0);

  const [isTwitterConnected, setIsTwitterConnected] = useState(false);
  const [isInstagramConnected, setIsInstagramConnected] = useState(false);
  const [isFacebookConnected, setIsFacebookConnected] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTab2Change = (event, newValue) => {
    setTab2Value(newValue);
  };

  const handleConnectTwitter = () => {
    setIsTwitterConnected(!isTwitterConnected);
  };

  const handleConnectInstagram = () => {
    setIsInstagramConnected(!isInstagramConnected);
  };

  const handleConnectFacebook = () => {
    // setIsFacebookConnected(!isFacebookConnected);
    window.location.href = "https://www.facebook.com/v2.8/dialog/oauth?client_id=6678817102151742&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fprofile%2Fdashboard"
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="Social Networks" />
        <Tab label="Screener Automation" />
        <Tab label="Settings" />


        {/* Add more tabs here */}
      </Tabs>
      <Box sx={{ p: 2 }}>
        {tabValue === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Connect to Social Networks
            </Typography>
            {/* <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <Button
                variant="contained"
                color={isTwitterConnected ? 'secondary' : 'primary'}
                onClick={handleConnectTwitter}
                sx={{ mx: 1 }}
              >
                {isTwitterConnected ? 'Disconnect' : 'Connect'} to Twitter
              </Button>
              <Button
                variant="contained"
                color={isInstagramConnected ? 'secondary' : 'primary'}
                onClick={handleConnectInstagram}
                sx={{ mx: 1 }}
              >
                {isInstagramConnected ? 'Disconnect' : 'Connect'} to Instagram
              </Button>
              <Button
                variant="contained"
                color={isFacebookConnected ? 'secondary' : 'primary'}
                onClick={handleConnectFacebook}
                sx={{ mx: 1 }}
              >
                {isFacebookConnected ? 'Disconnect' : 'Connect'} to Facebook
              </Button>
            </Box> */}
            <SocialAuth />
            {/* <Typography variant="body1" sx={{ textAlign: 'center' }}>
              {isTwitterConnected || isInstagramConnected || isFacebookConnected
                ? 'Connected'
                : 'Not connected'}
            </Typography> */}
          </Box>
        )}

        {tabValue === 1 && (
          <Box>
            <Tabs value={tab2Value} onChange={handleTab2Change} centered>
              <Tab label="Create Screener Automation" />
              <Tab label="All Screener Automation" />
            </Tabs>
            {tab2Value === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Create Screener Automation
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <ScreenModel />
                </Box>
              </Box>
            )}
            {tab2Value === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  All Screener Automation
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <AllScreenTasks />
                </Box>
              </Box>
            )}

          </Box>
        )}

        {tabValue === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Settings
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <BasicSettings />
            </Box>
          </Box>
        )}
        {/* Add content for other tabs here */}
      </Box>
    </Box>
  );
};

export default Dashboard;
