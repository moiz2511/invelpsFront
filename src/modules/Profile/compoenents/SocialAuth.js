import { TextField, Button, Grid } from '@mui/material';
import React, { useState, useEffect } from 'react'
import ScreenModelService from '../services/ScreenModelService';
import { async } from 'q';



const SocialAuth = () => {
    const restClient = new ScreenModelService();


    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('')
    const [isTwitterAuthenticated, setIsTwitterAuthenticated ] = useState(false)

    const onSubmitHandler = async (event) => {
        if (event != null) {
            event.preventDefault();
        }
        const body = {
            email: email
        }
        console.log(body)

        await restClient.updateProfile(body)
            .then((response) => {
                console.log(response)
                setMessage(response.message)
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const getTwitterAuthUrl = async (event) => {
        if (event != null) {
            event.preventDefault();
        }
  
        await restClient.getTwitterAuthUrl()
            .then((response) => {
                console.log(response)
                setMessage(response.data.authorization_url)
                window.location.href=response.data.authorization_url
            })
            .catch((err) => {
                console.log(err);
            });
    }
    useEffect(() => {
        const url = new URL(window.location.href);
        const oauthToken = url.searchParams.get('oauth_token');
        const oauthVerifier = url.searchParams.get('oauth_verifier');
        const body={
            "oauth_token":oauthToken,
            "oauth_token_verifier":oauthVerifier
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
        const fetchProfile = async () =>{
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
        <Grid container>
            <Button id="twitterAuth" disabled={false} onClick={getTwitterAuthUrl} type="submit" variant="contained" size="medium"> {isTwitterAuthenticated?'Reconnect Twitter':'Connect Twitter'} </Button>
            {/* {message} */}
        </Grid >
    )
}
export default SocialAuth;
