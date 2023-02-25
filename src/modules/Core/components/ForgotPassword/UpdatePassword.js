import { useState, useRef, useContext } from 'react';
import Card from "@mui/material/Card";
import Toolbar from "@mui/material/Toolbar";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";

import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import Constants from '../../../../Constants.json'
import classes from '../Login/login-page.module.css'

const UpdatePasswordForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token", "");
  const navigate = useNavigate();
  const confirmPassInputRef = useRef();
  const passwordInputRef = useRef();

  const [confirmPassTouched, setConfirmPassTouched] = useState(false);
  const handleConfirmPassTouched = () => {
    setConfirmPassTouched(true);
  };
  const [passTouched, setPassTouched] = useState(false);
  const handlePasswordTouched = () => {
    setPassTouched(true);
  };

  const [confirmPassFieldError, setConfirmPassFieldError] = useState('');
  const [passFieldError, setPassFieldError] = useState('');

  const handleConfirmPassError = () => {
    if (confirmPassTouched && confirmPassInputRef.current.value === "") {
      setConfirmPassFieldError("Confirm Password is Required");
    } else if (confirmPassTouched && !confirmPassInputRef.current.validity.valid) {
      setConfirmPassFieldError("Invalid Password");
    } else if (!(passwordInputRef.current.value === confirmPassInputRef.current.value)) {
      setConfirmPassFieldError("Passwords not matching");
    } else {
      setConfirmPassFieldError("");
    }
  };

  const handlePasswordError = () => {
    if (passTouched && passwordInputRef.current.value === "") {
      setPassFieldError("Password is Required");
    } else if (passTouched && !passwordInputRef.current.validity.valid) {
      setPassFieldError("Invalid Password");
    } else {
      setPassFieldError("");
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    // const enteredConfirmPass = confirmPassInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    fetch(Constants.BACKEND_SERVER_BASE_URL + "/resetpassword", {
      method: 'POST',
      body: JSON.stringify({
        token: token,
        password: enteredPassword,
        returnSecureToken: true,
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
            let errorMessage = 'Failed to update the password. Please retry after sometime.';
            // if (data && data.error && data.error.message) {
            //   errorMessage = data.error.message;
            // }

            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        alert("Your Password Updated Successfully!");
        navigate("/login");
      }
      )
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
                Update Password
              </Typography>
            </Toolbar>
          </AppBar>
          <CardContent className={classes.loginCardContent}>
            <TextField
              required
              id="password"
              label="Password"
              type="password"
              fullWidth
              margin="dense"
              inputRef={passwordInputRef}
              autoFocus
              onClick={handlePasswordTouched}
              onFocus={handlePasswordTouched}
              onBlur={handlePasswordError}
              onChange={handlePasswordError}
              error={passFieldError ? true : false}
              helperText={passFieldError}
              // InputProps={{
              //   endAdornment: (
              //     <InputAdornment position="end">
              //       <IconButton
              //         aria-label="toggle password visibility"
              //         onClick={handleClickShowPassword}
              //         edge="end"
              //       >
              //         {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              //       </IconButton>
              //     </InputAdornment>
              //   )
              // }}
              inputProps={{ minLength: 6, required: true }}
            />
            <TextField
              required
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              fullWidth
              margin="dense"
              inputRef={confirmPassInputRef}
              onClick={handleConfirmPassTouched}
              onFocus={handleConfirmPassTouched}
              onBlur={handleConfirmPassError}
              onChange={handleConfirmPassError}
              error={confirmPassFieldError ? true : false}
              helperText={confirmPassFieldError}
              // InputProps={{
              //   endAdornment: (
              //     <InputAdornment position="start">
              //       <IconButton
              //         aria-label="confirmPassIcon"
              //         edge="end"
              //       >
              //         <EmailIcon />
              //       </IconButton>
              //     </InputAdornment>
              //   )
              // }}
              inputProps={{ min: 1 }}
            />
          </CardContent>
          <CardActions className={classes.loginCardContent}>
            <Button type="submit" className={classes.loginButton} variant="contained" size="medium">Update</Button>
          </CardActions>
        </Card>
      </Box>
    </Box>
  );
};

export default UpdatePasswordForm;
