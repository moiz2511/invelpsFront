import { useState, useRef } from 'react';
import Card from "@mui/material/Card";
import Toolbar from "@mui/material/Toolbar";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import EmailIcon from '@mui/icons-material/Email';
import { Box } from "@mui/system";

import Constants from '../../../../Constants.json'
import classes from '../Login/login-page.module.css'

const ForgotPasswordForm = () => {
  const emailInputRef = useRef();

  const [emailTouched, setEmailTouched] = useState(false);
  const handleEmailTouched = () => {
    setEmailTouched(true);
  };

  const [emailFieldError, setEmailFieldError] = useState('');

  const handleEmailError = () => {
    if (emailTouched && emailInputRef.current.value === "") {
      setEmailFieldError("Email is Required");
    } else if (emailTouched && !emailInputRef.current.validity.valid) {
      setEmailFieldError("Invalid Email");
    } else {
      setEmailFieldError("");
    }
  };



  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;

    // optional: Add validation

    fetch(Constants.BACKEND_SERVER_BASE_URL + "/forgotpassword/link", {
      method: 'POST',
      body: JSON.stringify({
        email: enteredEmail,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = 'Please check your email for password reset link. Will receive mail only when email is registered.';
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }

            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
          alert("Please check your email for password reset link. Will receive mail only when email is registered.")
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box component="form" onSubmit={submitHandler} sx={{
        display: 'grid',
        justifyContent: 'center',
        textAlign: 'center',
        margin: '2em auto'
      }}>
        <Card className={classes.loginCard} elevation={12}>
          <AppBar position="relative">
            <Toolbar className={classes.loginToolBar}>
              <Typography justifyContent="center" variant="h6">
                Forgot Password
              </Typography>
            </Toolbar>
          </AppBar>
          <CardContent className={classes.loginCardContent}>
            <TextField
              required
              id="email"
              label="Email"
              type="text"
              fullWidth
              margin="dense"
              inputRef={emailInputRef}
              autoFocus
              onClick={handleEmailTouched}
              onFocus={handleEmailTouched}
              onBlur={handleEmailError}
              onChange={handleEmailError}
              error={emailFieldError ? true : false}
              helperText={emailFieldError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      aria-label="emailIcon"
                      edge="end"
                    >
                      <EmailIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              inputProps={{ min: 1 }}
            />
          </CardContent>
          <CardActions className={classes.loginCardContent}>
            <Button type="submit" className={classes.loginButton} variant="contained" size="medium">Submit</Button>
          </CardActions>
        </Card>
      </Box>
    </Box>
  );
};

export default ForgotPasswordForm;