import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import SocialAccounts from "./SocialAccounts";

const ProfileComponent = () => {
  return (
    <>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        border: '2px solid yellow',
        borderRadius: '8px',
        p: 2,
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: 2, marginTop: 5 }}>
          My Information
        </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* First Name */}
        <Box display="flex">
          <Typography variant="subtitle1" sx={{ width: '100px', marginTop: '10px', fontSize: '17px' }}>
            First Name
          </Typography>
          <TextField fullWidth />
        </Box>
        {/* Last Name */}
        <Box display="flex">
          <Typography variant="subtitle1" sx={{ width: '100px', marginTop: '10px', fontSize: '17px' }}>
            Last Name
          </Typography>
          <TextField fullWidth />
        </Box>
        {/* Workplace */}
        <Box display="flex">
          <Box>
            <Typography variant="subtitle1" sx={{ width: '100px', marginTop: '10px', fontSize: '17px' }}>
              Workplace
            </Typography>
            <Typography variant="subtitle1" sx={{ width: '100px', marginTop: '5px', fontSize: '10px' }}>
              Tell us about your work type
            </Typography>
          </Box>
          <TextField fullWidth />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          borderTop: '2px solid yellow',
          alignItems: 'center',
          marginTop: "80px",
          marginBottom:"-10px"
        }}
      />


      {/* Account Email section */}
      <Typography variant="h6" sx={{ marginTop: 4, marginBottom: 2 }}>
        Account Email
      </Typography>
      <Box display="flex" flexDirection="row" justifyContent="space-around" alignItems="center">
        <Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5.5 }}>
              {/* Email Address */}
              <Box>
                <Typography variant="subtitle1">Email Address:</Typography>
                {/* Use as your login name */}
                <Typography variant="subtitle2">Use as your login name</Typography>
              </Box>
              {/* Current Password */}
              <Typography variant="subtitle1">Current Password:</Typography>
              {/* New Password */}
              <Typography variant="subtitle1">New Password:</Typography>
              {/* Confirm New Password */}
              <Typography variant="subtitle1">Confirm New Password:</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField sx={{ width: '350px', height: '50px' }} />
              <TextField type="password" sx={{ width: '350px', height: '50px'}} />
              <TextField type="password" sx={{ width: '350px', height: '50px' }} />
              <TextField type="password" sx={{ width: '350px', height: '50px' }} />
              <TextField type="password" sx={{ width: '350px', height: '50px' }} />
            </Box>
          </Box>
          <Button variant="contained" color="primary" sx={{
            float: "right",
            marginTop: "30px"
          }}>
            Update Password
          </Button>
        </Box>

        {/* Update Password button */}

        {/* Reset and Delete Account buttons */}
        <Box
          height="300px"
          display="flex"
          flexDirection="column"
          justifyContent="space-around"
          alignItems="center"
        >
          <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
              <Typography variant="subtitle1">Reset my account</Typography>
              <Button variant="contained" color="info">
                Reset Account
              </Button>
            </Box>
            <Typography variant="body2" sx={{ width: "400px", marginTop: "10px" }}>
              This will reset all your personal settings, returning them to our original settings.
              Personal Settings includes saved selections, filters, groupings, and sorting states throughout Invelps.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
              <Typography variant="subtitle1">Delete my account</Typography>
              <Button variant="contained" color="info">
                Delete Account
              </Button>
            </Box>
            <Typography variant="body2" sx={{ width: "400px", marginTop: "10px" }}>
              This will close your Invelps account. All your personal settings and dashboards will be deleted.
              We will be unable to recover your data if you choose to delete your account.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
    <SocialAccounts />
    </>
  );
};

export default ProfileComponent;
