import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ScreenModelService from '../services/ScreenModelService';



const styles = {
  root: {
    border: '1px solid yellow',
    borderRadius: "8px",
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: "50px"
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  heading: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  label: {
    marginRight: '10px',
    fontWeight: 'bold',
    fontSize: "16px",
  },
  sublabel: {
    fontSize: "8px",
  },
  button: {
    margin: '5px 0',
    backgroundColor: 'transparent',
    border: '1px solid yellow',
    color: 'black',
    width: "250px",
    '&:hover': {
      backgroundColor: 'yellow',
      color: 'black',
    },
  },
};

const SocialIntegrations = () => {
  const restClient = new ScreenModelService();

  const [isTwitterAuthenticated, setIsTwitterAuthenticated ] = useState(false)


  const getTwitterAuthUrl = async (event) => {
    if (event != null) {
      event.preventDefault();
    }
  
    await restClient.getTwitterAuthUrl()
      .then((response) => {
        console.log(response)
        // setMessage(response.data.authorization_url)
        window.location.href = response.data.authorization_url
      })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    const url = new URL(window.location.href);
    const oauthToken = url.searchParams.get('oauth_token');
    const oauthVerifier = url.searchParams.get('oauth_verifier');
    const body = {
      "oauth_token": oauthToken,
      "oauth_token_verifier": oauthVerifier
    }
    if (oauthToken && oauthVerifier) {
      const fetchData = async () => {
        await restClient.fetchTwitterAccessToken(body)
          .then((response) => {
            console.log(response)
          })
          .catch((err) => {
            console.log(err);
          });
      };
  
      fetchData();
    }
    const fetchProfile = async () => {
      await restClient.fetchCurrentProfile(body)
        .then((response) => {
          console.log(response)
          setIsTwitterAuthenticated(response.data.profile.isTwitterAuthenticated)
        })
        .catch((err) => {
          console.log(err);
        });
    }
    fetchProfile()
  }, []);
  return (
    <Box sx={styles.root}>
      <Box sx={styles.section}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          gap="5px"
        >
          <Typography variant="h2" sx={styles.heading} marginLeft="-170px">
            Social Integrations
          </Typography>
          <Box display="flex">
            <Typography variant="subtitle1" sx={{ width: '100px', marginTop: '10px', fontSize: '17px' }}>
              Instagram
            </Typography>
            <Button variant="contained" color="primary" startIcon={<InstagramIcon />} sx={styles.button}>
              Connect Instagram
            </Button>
          </Box>
          <Box display="flex">
            <Typography variant="subtitle1" sx={{ width: '100px', marginTop: '10px', fontSize: '17px' }}>
              Twitter
            </Typography>
            <Button variant="contained" color="primary" startIcon={<TwitterIcon />} sx={styles.button} onClick={getTwitterAuthUrl}>
            {isTwitterAuthenticated?'Reconnect Twitter':'Connect Twitter'}
            </Button>
          </Box>
          <Box display="flex">
            <Typography variant="subtitle1" sx={{ width: '100px', marginTop: '10px', fontSize: '17px' }}>
              Facebook
            </Typography>
            <Button variant="contained" color="primary" startIcon={<FacebookIcon />} sx={styles.button}>
              Connect Facebook
            </Button>
          </Box>
          <Box display="flex">
            <Typography variant="subtitle1" sx={{ width: '100px', marginTop: '10px', fontSize: '17px' }}>
              LinkedIn
            </Typography>
            <Button variant="contained" color="primary" startIcon={<LinkedInIcon />} sx={styles.button}>
              Connect LinkedIn
            </Button>
          </Box>
        </Box>
      </Box>
      <Box sx={styles.section} marginTop="10px">
        <Box>
          <Typography variant="h2" sx={styles.heading}>
            Legal Staff
          </Typography>
          <Box
            marginTop="20px"
            width="500px"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Typography display="flex" flexDirection="column">
              <span style={styles.label}>Privacy Policy</span>
              <span>Read our Privacy policy</span>
            </Typography>
            <Button variant="contained" color="primary" sx={styles.button}>
              Privacy Policy
            </Button>
          </Box>
          <Box
            marginTop="20px"
            width="500px"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Typography display="flex" flexDirection="column">
              <span style={styles.label}>Terms and Conditions</span>
              <span>Read our Terms and Conditions</span>
            </Typography>
            <Button variant="contained" color="primary" sx={styles.button}>
              Terms and Conditions
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SocialIntegrations;
