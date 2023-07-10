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

import classes from '../Login/login-page.module.css'
import Constants from '../../../../Constants.json'

const ContactPage = () => {
    const emailInputRef = useRef();
    const nameInputRef = useRef();
    const subjectInputRef = useRef();
    const messageInputRef = useRef();

    const [emailTouched, setEmailTouched] = useState(false);
    const handleEmailTouched = () => {
        setEmailTouched(true);
    };

    const [nameTouched, setNameTouched] = useState(false);
    const handleNameTouched = () => {
        setNameTouched(true);
    };


    const [subjectTouched, setSubjectTouched] = useState(false);
    const handleSubjectTouched = () => {
        setSubjectTouched(true);
    };

    const [messageTouched, setMessageTouched] = useState(false);
    const handleMessageTouched = () => {
        setMessageTouched(true);
    };

    const [emailFieldError, setEmailFieldError] = useState('');
    const [nameFieldError, setNameFieldError] = useState('');
    const [subjectFieldError, setSubjectFieldError] = useState('');
    const [messageFieldError, setMessageFieldError] = useState('');

    const handleEmailError = () => {
        if (emailTouched && emailInputRef.current.value === "") {
            setEmailFieldError("Email is Required");
        } else if (emailTouched && !emailInputRef.current.validity.valid) {
            setEmailFieldError("Invalid Email");
        } else {
            setEmailFieldError("");
        }
    };

    const handleNameError = () => {
        if (nameTouched && nameInputRef.current.value === "") {
            setNameFieldError(" Name is Required");
        } else if (nameTouched && !nameInputRef.current.validity.valid) {
            setNameFieldError("Invalid Name");
        } else {
            setNameFieldError("");
        }
    };

    const handleSubjectError = () => {
        if (subjectTouched && subjectInputRef.current.value === "") {
            setSubjectFieldError("Subject is Required");
        } else if (subjectTouched && !subjectInputRef.current.validity.valid) {
            setSubjectFieldError("Invalid Subject");
        } else {
            setSubjectFieldError("");
        }
    };

    const handleMessageError = () => {
        if (messageTouched && messageInputRef.current.value === "") {
            setMessageFieldError("Message is Required");
        } else if (messageTouched && !messageInputRef.current.validity.valid) {
            setMessageFieldError("Invalid Message");
        } else {
            setMessageFieldError("");
        }
    };

    const submitHandler = (event) => {
        event.preventDefault();

        const enteredEmail = emailInputRef.current.value;
        const enteredName = nameInputRef.current.value;
        const enteredSubject = subjectInputRef.current.value;
        const enteredMessage = messageInputRef.current.value;


        fetch(Constants.BACKEND_SERVER_BASE_URL + '/contactpage', {
            method: 'POST',
            body: JSON.stringify({
                email: enteredEmail,
                name: enteredName,
                subject: enteredSubject,
                message: enteredMessage
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
                        let errorMessage = 'Falied to Contact';
                        // if (data && data.error && data.error.message) {
                        //   errorMessage = data.error.message;
                        // }

                        throw new Error(errorMessage);
                    });
                }
            })
            .then((data) => {
                alert("Thank you for your message. We will feedback soon.")
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
                                Contact
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <CardContent className={classes.loginCardContent}>
                        <TextField
                            required
                            id="name"
                            label="Full Name"
                            type="text"
                            fullWidth
                            autoFocus
                            margin="dense"
                            inputRef={nameInputRef}
                            onClick={handleNameTouched}
                            onFocus={handleNameTouched}
                            onBlur={handleNameError}
                            onChange={handleNameError}
                            error={nameFieldError ? true : false}
                            helperText={nameFieldError}
                            inputProps={{ minLength: 1, required: true }}
                        />
                        <TextField
                            required
                            id="email"
                            label="Email"
                            type="email"
                            fullWidth
                            margin="dense"
                            inputRef={emailInputRef}
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
                        <TextField
                            required
                            id="subject"
                            label="Subject"
                            type="text"
                            fullWidth
                            margin="dense"
                            inputRef={subjectInputRef}
                            onClick={handleSubjectTouched}
                            onFocus={handleSubjectTouched}
                            onBlur={handleSubjectError}
                            onChange={handleSubjectError}
                            error={subjectFieldError ? true : false}
                            helperText={subjectFieldError}
                            inputProps={{ minLength: 1, required: true }}
                        />

                        <TextField
                            required
                            multiline
                            fullWidth
                            rows={4}
                            id="message"
                            label="Message"
                            type="text"
                            margin="dense"
                            inputRef={messageInputRef}
                            onClick={handleMessageTouched}
                            onFocus={handleMessageTouched}
                            onBlur={handleMessageError}
                            onChange={handleMessageError}
                            error={messageFieldError ? true : false}
                            helperText={messageFieldError}
                            inputProps={{ minLength: 6, required: true }}
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

export default ContactPage;