import React from 'react';
import { Card, CardContent, Switch, Typography, Button, Box } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

const Billing = () => {
  const handleToggleChange = () => {
    // Handle toggle change here
  };

  return (
    <div style={{ border: '1px solid #FFD700', borderRadius: '10px', padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '16px' }}>
        <Typography variant="h6">Annual</Typography>
        <Switch color="primary" onChange={handleToggleChange} style={{ marginLeft: '16px' }} />
      </div>
      <Typography variant="body1" align="center" style={{ marginBottom: '24px' }}>
        Save up to 30% with an annual plan
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        <Card style={{ margin: '0 8px', backgroundColor: '#F5F5F5', height: '450px', width: '320px' }}>
          <CardContent>
            <Typography variant="h6" style={{ fontWeight: 'bold' }}>
              Free
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              The ultimate beginner package — everything you need to get started gaining insight on your investments
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h4" style={{ marginTop: '16px', fontWeight: 'bold' }}>
                <sup style={{ color: 'lightgray', fontSize:'25px' }}>$</sup>0<sub style={{ color: 'lightgray', fontSize:'15px' }}>USD</sub>
              </Typography>
            </Box>
            <Box sx={{ height: '170px' }}>
              <Typography variant="body2">
                <CheckIcon color="primary" style={{ marginRight: '8px' }} />
                2 watchlists
              </Typography>
              <Typography variant="body2">
                <CheckIcon color="primary" style={{ marginRight: '8px' }} />
                2 dashboards
              </Typography>
            </Box>
            <Box mt={2} display="flex" justifyContent="center">
              <Button variant="contained" style={{ backgroundColor: '#FFC107', width: '100%' }}>
                CURRENT PLAN
              </Button>
            </Box>
          </CardContent>
        </Card>
        <Card style={{ margin: '0 8px', backgroundColor: '#FFF9F1', height: '450px', width: '320px' }}>
          <CardContent>
            <Box sx={{ height: '350px' }}>
              <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                Basic
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                The ultimate beginner package — everything you need to get started gaining insight on your investments
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h4" style={{ marginTop: '16px', fontWeight: 'bold' }}>
                  <sup style={{ color: 'lightgray', fontSize:'25px' }}>$</sup>15<sub style={{ color: 'lightgray', fontSize:'15px' }}>USD</sub>
                </Typography>
              </Box>
              <Typography variant="body2">
                <CheckIcon color="primary" style={{ marginRight: '8px' }} />
                2 watchlists
              </Typography>
              <Typography variant="body2">
                <CheckIcon color="primary" style={{ marginRight: '8px' }} />
                2 dashboards
              </Typography>
              <Typography variant="body2">
                <CheckIcon color="primary" style={{ marginRight: '8px' }} />
                2 chart templates
              </Typography>
            </Box>
            <Button variant="contained" style={{ backgroundColor: '#FFC107', marginTop: '16px', width: '100%' }}>
              UPGRADE
            </Button>
          </CardContent>
        </Card>
        <Card style={{ margin: '0 8px', backgroundColor: '#FDF8F3', height: '450px', width: '320px' }}>
          <CardContent>
            <Typography variant="h6" style={{ fontWeight: 'bold' }}>
              Premium
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              The ultimate beginner package — everything you need to get started gaining insight on your investments
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h4" style={{ marginTop: '16px', fontWeight: 'bold' }}>
                <sup style={{ color: 'lightgray', fontSize:'25px' }}>$</sup>35<sub style={{ color: 'lightgray', fontSize:'15px' }}>USD</sub>
              </Typography>
            </Box>
            <Box sx={{ height: '170px' }}>
              <Typography variant="body2">
                <CheckIcon color="primary" style={{ marginRight: '8px' }} />
                2 watchlists
              </Typography>
              <Typography variant="body2">
                <CheckIcon color="primary" style={{ marginRight: '8px' }} />
                2 dashboards
              </Typography>
              <Typography variant="body2">
                <CheckIcon color="primary" style={{ marginRight: '8px' }} />
                2 chart templates
              </Typography>
              <Typography variant="body2">
                <CheckIcon color="primary" style={{ marginRight: '8px' }} />
                Advanced charting
              </Typography>
              <Typography variant="body2">
                <CheckIcon color="primary" style={{ marginRight: '8px' }} />
                Market dashboards
              </Typography>
            </Box>
            <Button variant="contained" style={{ backgroundColor: '#FFC107', marginTop: '16px', width: '100%' }}>
              UPGRADE
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Billing;
