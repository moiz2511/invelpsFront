import React, { useState, useRef } from 'react';
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

import { useNavigate } from 'react-router';
import classes from '../Login/login-page.module.css'
import { Grid, Link } from '@mui/material';
import ManageUsersService from '../../services/UserManagementService';

const SignUpForm = () => {
    const navigate = useNavigate();
    const restClient = new ManageUsersService();
    const emailInputRef = useRef();
    const passwordInputRef = useRef();
    const fNameInputRef = useRef();
    const lNameInputRef = useRef();
    const confirmPassInputRef = useRef();

    // const [emailTouched, setEmailTouched] = useState(false);
    // const handleEmailTouched = () => {
    //     setEmailTouched(true);
    // };

    // const [passTouched, setPassTouched] = useState(false);
    // const handlePasswordTouched = () => {
    //     setPassTouched(true);
    // };


    // const [fNameTouched, setFNameTouched] = useState(false);
    // const handleFNameTouched = () => {
    //     setFNameTouched(true);
    // };

    // const [confirmPassTouched, setConfirmPassTouched] = useState(false);
    // const handleConfirmPassTouched = () => {
    //     setConfirmPassTouched(true);
    // };

    const [fNameFieldError, setFNameFieldError] = useState('');
    const [emailFieldError, setEmailFieldError] = useState('');
    const [passFieldError, setPassFieldError] = useState('');
    const [confirmPassFieldError, setConfirmPassFieldError] = useState('');

    const handleEmailError = () => {
        if (emailInputRef.current.value === "") {
            setEmailFieldError("Email is Required");
        } else if (!emailInputRef.current.validity.valid) {
            setEmailFieldError("Invalid Email");
        } else {
            setEmailFieldError("");
        }
    };

    const handleFNameError = () => {
        if (fNameInputRef.current.value === "") {
            setFNameFieldError("First Name is Required");
        } else if (!fNameInputRef.current.validity.valid) {
            setFNameFieldError("Invalid First Name");
        } else {
            setFNameFieldError("");
        }
    };

    const handlePasswordError = () => {
        if (passwordInputRef.current.value === "") {
            setPassFieldError("Password is Required");
        } else if (!passwordInputRef.current.validity.valid) {
            setPassFieldError("Invalid Password");
        } else {
            setPassFieldError("");
        }
    };

    const handleConfirmPassError = () => {
        if (confirmPassInputRef.current.value === "") {
            setConfirmPassFieldError("Confirm Password is Required");
        } else if (!confirmPassInputRef.current.validity.valid) {
            setConfirmPassFieldError("Invalid Password");
        } else if (!(passwordInputRef.current.value === confirmPassInputRef.current.value)) {
            setConfirmPassFieldError("Passwords not matching");
        } else {
            setConfirmPassFieldError("");
        }
    };

    // const [showPassword, setShowPassword] = useState(false);
    // const handleClickShowPassword = () => {
    //     setShowPassword(!showPassword);
    // };

    async function submitHandler(event) {
        event.preventDefault();
        const enteredEmail = emailInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;
        const enteredFname = fNameInputRef.current.value;
        const enteredLName = lNameInputRef.current.value;
        const body = {
            firstname: enteredFname,
            lastname: enteredLName,
            email: enteredEmail,
            password: enteredPassword
        }
        await restClient.signUpUser(body)
            .then(() => {
                alert("SignUp Successfull!")
                navigate("/login")
            })
            .catch((err) => {
                alert("SignUp Fsiled", err.message);
            });
    }

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
                                SignUp
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <CardContent className={classes.loginCardContent}>
                        <Box >
                            <Grid container spacing={2}>
                                <Grid item>
                                    <TextField
                                        required
                                        id="fname"
                                        label="First Name"
                                        type="text"
                                        autoFocus
                                        margin="dense"
                                        inputRef={fNameInputRef}
                                        // onClick={handleFNameTouched}
                                        // onFocus={handleFNameTouched}
                                        onBlur={handleFNameError}
                                        // onChange={handleFNameError}
                                        error={fNameFieldError ? true : false}
                                        helperText={fNameFieldError}
                                        // InputProps={{
                                        //     endAdornment: (
                                        //         <InputAdornment position="start">
                                        //             <IconButton
                                        //                 aria-label="emailIcon"
                                        //                 edge="end"
                                        //             >
                                        //                 <EmailIcon />
                                        //             </IconButton>
                                        //         </InputAdornment>
                                        //     )
                                        // }}
                                        inputProps={{ min: 1 }}
                                    />

                                    <TextField
                                        id="lName"
                                        label="Last Name"
                                        type="text"
                                        margin="dense"
                                        inputRef={lNameInputRef}
                                        inputProps={{ min: 1 }}
                                        sx={{ marginLeft: 2 }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                        <TextField
                            required
                            id="email"
                            label="Email"
                            type="email"
                            fullWidth
                            margin="dense"
                            inputRef={emailInputRef}
                            // onClick={handleEmailTouched}
                            // onFocus={handleEmailTouched}
                            onBlur={handleEmailError}
                            // onChange={handleEmailError}
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
                        <TextField
                            required
                            id="password"
                            label="Password"
                            type="password"
                            fullWidth
                            margin="dense"
                            inputRef={passwordInputRef}
                            // onClick={handlePasswordTouched}
                            // onFocus={handlePasswordTouched}
                            onBlur={handlePasswordError}
                            // onChange={handlePasswordError}
                            error={passFieldError ? true : false}
                            helperText={passFieldError}
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
                            // onClick={handleConfirmPassTouched}
                            // onFocus={handleConfirmPassTouched}
                            onBlur={handleConfirmPassError}
                            onChange={handleConfirmPassError}
                            error={confirmPassFieldError ? true : false}
                            helperText={confirmPassFieldError}
                            inputProps={{ minLength: 6, required: true }}
                        />
                    </CardContent>
                    <CardActions className={classes.loginCardContent}>
                        <Button type="submit" className={classes.loginButton} variant="contained" size="medium">Submit</Button>
                    </CardActions>
                    <Grid container sx={{ textAlign: 'center', mb: 2 }}>
                        <Grid item xs>
                            <Link href="/login" variant="body2">
                                {"Already an user? Sign In"}
                            </Link>
                        </Grid>
                    </Grid>
                </Card>
            </Box>
        </Box>
    );
};

export default SignUpForm;