import { useState, useRef, useContext } from 'react';
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
import ReceiptIcon from '@mui/icons-material/Receipt';
import EmailIcon from '@mui/icons-material/Email';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box } from "@mui/system";

import { useNavigate } from 'react-router';
import classes from './login-page.module.css'
import { Grid, Link } from '@mui/material';

import AuthContext from '../../store/auth-context';
import Constants from '../../../../Constants.json'

const companyDetails =  {
  "symbol" : "RMS.PA",
  "price" : 1517.5,
  "beta" : 0.657265,
  "volAvg" : 76351,
  "mktCap" : 158633380000,
  "lastDiv" : 8.0,
  "range" : "957.6-1665.5",
  "changes" : 8.0,
  "companyName" : "Hermès International Société en commandite par actions",
  "currency" : "EUR",
  "cik" : null,
  "isin" : "FR0000052292",
  "cusip" : null,
  "exchange" : "Paris",
  "exchangeShortName" : "EURONEXT",
  "industry" : "Luxury Goods",
  "website" : "https://finance.hermes.com",
  "description" : "Hermès International Société en commandite par actions engages in the production, wholesale, and retail of various goods. The company offers leather goods and saddlery, such as bags for men and women, clutches, briefcases, luggage, small leather goods, diaries and writing objects, saddles, bridles, and a range of equestrian products and clothing; ready-to-wear garments for men and women; and accessories, including jewelry, belts, hats, gloves, the Internet of Things products, and shoes. It also provides silk and textiles for men and women; art of living and tableware products; perfumes; and watches. In addition, the company is also involved in weaving, engraving, printing, dyeing, finishing, and producing textiles; and purchasing, tanning, dyeing, finishing, and selling precious leathers. It sells its products through a network of 303 stores worldwide. The company also sells watches, perfumes, and tableware through a network of specialized stores. Hermès International Société en commandite par actions was founded in 1837 and is based in Paris, France. Hermès International Société en commandite par actions operates as a subsidiary of H51 SAS.",
  "ceo" : "Ms. Mireille Maury",
  "sector" : "Consumer Cyclical",
  "country" : "FR",
  "fullTimeEmployees" : "18428",
  "phone" : "330140174926",
  "address" : "24 rue du Faubourg Saint Honore",
  "city" : "Paris",
  "state" : "ILE-DE-FRANCE",
  "zip" : "75008",
  "dcfDiff" : null,
  "dcf" : null,
  "image" : "https://financialmodelingprep.com/image-stock/RMS.PA.png",
  "ipoDate" : "1993-06-03",
  "defaultImage" : false,
  "isEtf" : false,
  "isActivelyTrading" : true,
  "isAdr" : false,
  "isFund" : false
}

const LoginForm = () => {
  const navigate = useNavigate();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };


  const [emailTouched, setEmailTouched] = useState(false);
  const handleEmailTouched = () => {
    setEmailTouched(true);
  };
  const [passTouched, setPassTouched] = useState(false);
  const handlePasswordTouched = () => {
    setPassTouched(true);
  };

  const [emailFieldError, setEmailFieldError] = useState('');
  const [passFieldError, setPassFieldError] = useState('');

  const handleEmailError = () => {
    if (emailTouched && emailInputRef.current.value === "") {
      setEmailFieldError("Email is Required");
    } else if (emailTouched && !emailInputRef.current.validity.valid) {
      setEmailFieldError("Invalid Email");
    } else {
      setEmailFieldError("");
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

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;


    fetch(Constants.BACKEND_SERVER_BASE_URL + '/token', {
      method: 'POST',
      body: JSON.stringify({
        username: enteredEmail,
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
            let errorMessage = 'Authentication failed!';
            // if (data && data.error && data.error.message) {
            //   errorMessage = data.error.message;
            // }

            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        const expirationTime = new Date(
          new Date().getTime() + + 86400 * 1000
        );
        authCtx.login(data.access, data.refresh, data.role, expirationTime.toISOString());
        navigate("/context/investingstyle");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <>
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
                  Login
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
                autoFocus
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
                inputProps={{ minLength: 6, required: true }}
              />

              <Grid container sx={{ textAlign: 'right' }}>
                <Grid item xs >
                  <Link href="/forgotpassword" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions className={classes.loginCardContent}>
              <Button type="submit" className={classes.loginButton} variant="contained" size="medium">Login</Button>
            </CardActions>
            <Grid container sx={{ textAlign: 'center', mb: 2 }}>
              <Grid item xs>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Card>
        </Box>
      </Box>

    </>
  );
};

export default LoginForm;