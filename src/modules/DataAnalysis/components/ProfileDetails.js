import React from "react";
import { Avatar, Card, CardContent, Grid, Link, Typography } from "@mui/material";
import { Box } from "@mui/system";

import './profile-details.css'

const ProfileDetails = (props) => {
    const { companyName, address, city, state, country, zip, phone, image, website, sector, industry, fullTimeEmployees, exchange, ipoDate, mktCap, beta, price, currency, range, dcf, description } = props.companyDetails;
    return (
        <div style={{ padding: 20 }} >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box sx={{
                    display: 'grid',
                    margin: '2em auto'
                }}>
                    <Card elevation={12}>
                        <CardContent sx={{ marginLeft: "2px" }}>
                            <Grid spacing={1} container direction="row" alignItems="center" sx={{marginBottom: "10px"}}>
                                <Grid item>
                                    {/* <LinkIcon className={classes.linkIcon} /> */}
                                    {/* <span class='company-icon'></span> */}
                                    <Avatar className='company-icon'  variant="square" alt="CompanyIcon" src={image} />
                                </Grid>
                                <Grid item>
                                    <Typography variant="h5">
                                        {companyName}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}
                                direction="row"
                                justifyContent="center">
                                <Grid item xs={4}>
                                    <Typography>{address}</Typography>
                                    <Typography>{city} {state}</Typography>
                                    <Typography>{country} {zip}</Typography>
                                    <Typography><Link underline="none">{phone}</Link></Typography>
                                    <Typography><Link target="_blank" underline="none" href={website}>{website}</Link></Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography>
                                        Sector(s): <b>{sector}</b>
                                    </Typography>
                                    <Typography >
                                        Industry: <b>{industry}</b>
                                    </Typography>
                                    <Typography>
                                        Full Time Employees: <b>{fullTimeEmployees}</b>
                                    </Typography>
                                    <Typography>
                                        Exchange: <b>{exchange}</b>
                                    </Typography>
                                    <Typography>
                                        IPO Date: <b>{ipoDate}</b>
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography>
                                        Market Cap: <b>{mktCap}</b>
                                    </Typography>
                                    <Typography>
                                        Beta: <b>{beta}</b>
                                    </Typography>
                                    <Typography>
                                        Price: <b>{price}</b>
                                    </Typography>
                                    <Typography>
                                        Currency: <b>{currency}</b>
                                    </Typography>
                                    <Typography>
                                        Range: <b>{range}</b>
                                    </Typography>
                                    <Typography>
                                        Dcf: <b>{dcf}</b>
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Typography gutterBottom variant="h4" component="div">
                                Description
                            </Typography>
                            <Typography paragraph>
                                {description}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </div>
    );
};

export default ProfileDetails;