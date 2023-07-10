import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import PortfoliosTable from './Tables/PortfoliosTable';
import ScreenersTable from './Tables/ScreenersTable';
import AllScreenTasks from './AllScreenModelTasks';
import ScreenModel from './ScreenerModelTasks';
import UserScreenerTasks from './Tables/UserScreenerTasks'

const Sidebar = () => {
  const [activeButton, setActiveButton] = useState('Financials goals');

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const renderContent = () => {
    switch (activeButton) {
      case 'Financials goals':
        return <div>Financials goals content</div>;
      case 'My Financial Statements':
        return <div>My Financial Statements Content</div>;
      case 'Portfolios':
        return <div><PortfoliosTable /></div>;
      case 'Screeners':
        return <div><ScreenersTable/></div>;
      case 'User Screener Tasks':
        return <div><UserScreenerTasks/></div>;
      case 'Financial Analysis':
        return <div>Financial Analysis content</div>;
      case 'Graph Templates':
        return <div>Graph Templates content</div>;
      case 'Watchlist':
        return <div>Watchlist content</div>;
      case 'My Dashboard':
        return <div>My Dashboard content</div>;
      case 'Admin Screener':
        return <div>Admin Screener Content</div>;
      case 'All Screener Automation':
        return <div><AllScreenTasks /></div>;
      case 'Create Screener Automation':
      return <div><ScreenModel /></div>;
      default:
        return null;
    }
  };

  useEffect(() => {
    // This effect will run only on the first render
    // Set the active button to "Financials goals" if no button is active
    if (!activeButton) {
      setActiveButton('Financials goals');
    }
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <Box display="flex">
      <Box
        display="flex"
        flexDirection="column"
        border={2}
        borderColor="yellow"
        borderRadius={10}
        p={2}
      >
        <h3>Personal assets</h3>
        <Button
          variant={activeButton === 'Financials goals' ? 'contained' : 'text'}
          onClick={() => handleButtonClick('Financials goals')}
          style={{ marginBottom: 8 }}
        >
          Financials goals
        </Button>
        <Button
          variant={activeButton === 'My Financial Statements' ? 'contained' : 'text'}
          onClick={() => handleButtonClick('My Financial Statements')}
          style={{ marginBottom: 8 }}
        >
          My Financial Statements
        </Button>
        <Button
          variant={activeButton === 'Portfolios' ? 'contained' : 'text'}
          onClick={() => handleButtonClick('Portfolios')}
          style={{ marginBottom: 8 }}
        >
          Portfolios
        </Button>
        <Button
          variant={activeButton === 'Screeners' ? 'contained' : 'text'}
          onClick={() => handleButtonClick('Screeners')}
          style={{ marginBottom: 8 }}
        >
          Screeners
        </Button>
        <Button
          variant={activeButton === 'Screeners' ? 'contained' : 'text'}
          onClick={() => handleButtonClick('User Screener Tasks')}
          style={{ marginBottom: 8 }}
        >
          Screeners Tasks
        </Button>
        <Button
          variant={activeButton === 'All Screener Automation' ? 'contained' : 'text'}
          onClick={() => handleButtonClick('All Screener Automation')}
          style={{ marginBottom: 8 }}
        >
          All Screener Automation
        </Button>
        <Button
          variant={activeButton === 'Create Screener Automation' ? 'contained' : 'text'}
          onClick={() => handleButtonClick('Create Screener Automation')}
          style={{ marginBottom: 8 }}
        >
          Create Screener Automation
        </Button>
        <Button
          variant={activeButton === 'Financial Analysis' ? 'contained' : 'text'}
          onClick={() => handleButtonClick('Financial Analysis')}
          style={{ marginBottom: 8 }}
        >
          Financial Analysis
        </Button>
        <Button
          variant={activeButton === 'Graph Templates' ? 'contained' : 'text'}
          onClick={() => handleButtonClick('Graph Templates')}
          style={{ marginBottom: 8 }}
        >
          Graph Templates
        </Button>
        <Button
          variant={activeButton === 'Watchlist' ? 'contained' : 'text'}
          onClick={() => handleButtonClick('Watchlist')}
          style={{ marginBottom: 8 }}
        >
          Watchlist
        </Button>
        <Button
          variant={activeButton === 'My Dashboard' ? 'contained' : 'text'}
          onClick={() => handleButtonClick('My Dashboard')}
          style={{ marginBottom: 8 }}
        >
          My Dashboard
        </Button>
      </Box>
      <Box marginLeft={2} border={2} borderColor="yellow" borderRadius={10} p={2}>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default Sidebar;
