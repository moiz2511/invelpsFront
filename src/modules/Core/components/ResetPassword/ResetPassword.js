import React, { useState, useRef } from 'react';
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

import AuthContext from "../../store/auth-context";

import Constants from '../../../../Constants.json'
import classes from '../Login/login-page.module.css'
import ManageUsersService from '../../services/UserManagementService';

function CheckUserSession() {
    const authCtx = React.useContext(AuthContext);
    return authCtx.isLoggedIn ? authCtx.token : "";
}

const ResetPasswordForm = () => {
    const userService = new ManageUsersService();
    const navigate = useNavigate();
    const oldPasswordInputRef = useRef();
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

    const [oldPassTouched, setOldPassTouched] = useState(false);
    const handleOldPasswordTouched = () => {
        setOldPassTouched(true);
    };



    const [confirmPassFieldError, setConfirmPassFieldError] = useState('');
    const [passFieldError, setPassFieldError] = useState('');
    const [oldPassFieldError, setOldPassFieldError] = useState('');


    const handleOldPasswordError = () => {
        if (oldPassTouched && oldPasswordInputRef.current.value === "") {
            setOldPassFieldError("Old Password is Required");
        } else if (oldPassTouched && !oldPasswordInputRef.current.validity.valid) {
            setOldPassFieldError("Invalid Old Password");
        } else {
            setOldPassFieldError("");
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

    const handleConfirmPassError = () => {
        if (confirmPassTouched && confirmPassInputRef.current.value === "") {
            setConfirmPassFieldError("Confirm Password is Required");
        } else if (confirmPassTouched && !confirmPassInputRef.current.validity.valid) {
            setConfirmPassFieldError("Invalid Password");
        } else {
            setConfirmPassFieldError("");
        }
    };

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const submitHandler = async (event) => {
        event.preventDefault();

        const enteredOldPass = oldPasswordInputRef.current.value;
        const enteredConfirmPass = confirmPassInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;

        await userService.updateUserPassword({
            old_password: enteredOldPass,
            new_password: enteredPassword,
            password2: enteredConfirmPass,
        })
            .then(() => {
                alert("Your Password Reset was Successful!");
                navigate("/login");
            })
            .catch(() => {
                alert("Password Reset failed!. Please try after sometime!");
            });

        // fetch(Constants.BACKEND_SERVER_BASE_URL + "/user/password/update", {
        //     method: 'POST',
        //     body: JSON.stringify({
        //         old_password: enteredOldPass,
        //         new_password: enteredPassword,
        //         password2: enteredConfirmPass,
        //     }),
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorizatoin': 'Bearer ' + CheckUserSession()
        //     },
        // })
        //     .then((res) => {
        //         if (res.ok) {
        //             return res.json();
        //         } else {
        //             return res.json().then((data) => {
        //                 let errorMessage = 'Password Reset failed!';
        //                 // if (data && data.error && data.error.message) {
        //                 //   errorMessage = data.error.message;
        //                 // }

        //                 throw new Error(errorMessage);
        //             });
        //         }
        //     })
        //     .then((data) => {
        //         alert("Your Password Reset was Successful!");
        //         navigate("/login");
        //     }
        //     )
        //     .catch((err) => {
        //         alert(err.message);
        //     });
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
                                Reset Password
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <CardContent className={classes.loginCardContent}><TextField
                        required
                        id="oldPassword"
                        label="Old Password"
                        type="password"
                        fullWidth
                        margin="dense"
                        inputRef={oldPasswordInputRef}
                        autoFocus
                        onClick={handleOldPasswordTouched}
                        onFocus={handleOldPasswordTouched}
                        onBlur={handleOldPasswordError}
                        onChange={handleOldPasswordError}
                        error={oldPassFieldError ? true : false}
                        helperText={oldPassFieldError}
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
                            id="password"
                            label="Password"
                            type="password"
                            fullWidth
                            margin="dense"
                            inputRef={passwordInputRef}
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
                        <Button type="submit" className={classes.loginButton} variant="contained" size="medium">Reset</Button>
                    </CardActions>
                </Card>
            </Box>
        </Box>
    );
};

export default ResetPasswordForm;