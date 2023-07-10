import { TextField, Button, Grid, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react'
import ScreenModelService from '../services/ScreenModelService';
import { async } from 'q';



const BasicSettings = () => {
    const restClient = new ScreenModelService();


    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('')
    const [profile, setProfile] = useState('')

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

    const handleEmailChange = (event) => setEmail(event.target.value);

    useEffect(() => {
        const getProfile = async () => {
            await restClient.getProfile()
                .then((response) => {
                    console.log(response)
                    setProfile(response.data.profile)
                    setEmail(response.data.profile.email)
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        getProfile()
    }, [])

    return (
        <Grid container>
            <Typography variant="h6" gutterBottom>
              Settings
            </Typography>
            <Grid container
                spacing={1}
                component="form"
                sx={{
                    '& .MuiTextField-root': { ml: 1, minWidth: '20ch' },
                }}
                noValidate
                autoComplete="off">

                <TextField
                    id='email'
                    label='Email'
                    value={email}
                    onChange={handleEmailChange}
                    margin='normal'
                    fullWidth
                />
                <Button id="screenModelButton" onClick={onSubmitHandler} type="submit" variant="contained" size="medium"> Save </Button>
                {message}
            </Grid>
        </Grid >
    )
}
export default BasicSettings;
