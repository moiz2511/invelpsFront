import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Autocomplete, Grid, MenuItem } from '@mui/material';
import ScreenerService from '../services/ScreenerService';


export default function SaveScreener({ isDialogOpened, handleCloseDialog, metricFilter, exchangeFilter, industryFilter, sectorFilter, periodFilter }) {
    const restClient = new ScreenerService();
    const [msg, setMsg] = useState("");
    const [name, setName] = useState(false);
    const [description, setDescription] = useState(false);


    const handleSubmit = async (event) => {
        console.log('metrics=> ', metricFilter)
        console.log('exchange=> ', exchangeFilter)
        console.log('sector=> ', sectorFilter)
        console.log('industry=> ', industryFilter)
        console.log('period=> ', periodFilter)
        console.log('name=> ', name)
        console.log('description=> ', description)
        const body = {
            "name" : name,
            "description" : description,
            "metricFilter" : metricFilter,
            "exchangeFilter" : exchangeFilter,
            "sectorFilter" : sectorFilter,
            "industryFilter" : industryFilter,
            "periodFilter" : periodFilter
        }
        await restClient.saveScreener(body)
            .then((response) => {
                console.log(response)
                // setMessage(response.data.authorization_url)
                setMsg(response.data.message)
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const handleClose = (event) => {
        handleCloseDialog(false)
    }

    return (
        <div>
            <Dialog open={isDialogOpened} onClose={handleClose}>
                <React.Fragment>
                    <DialogTitle sx={{ backgroundColor: '#007AAA', textAlign: 'center' }}>{"Save Screener"}</DialogTitle>
                    <DialogContent>
                        <Grid container sx={{ width: '100%' }}>
                            <Grid container
                                component="form"
                                sx={{
                                    '& .MuiTextField-root': { ml: 1 },
                                }}
                                noValidate
                                autoComplete="off">
                                <Grid item sx={{ width: '100%' }}>
                                    <TextField label="Name" fullWidth onChange={(e) => setName(e.target.value)} />
                                    <TextField label="Description" fullWidth onChange={(e) => setDescription(e.target.value)} />
                                </Grid>
                            </Grid>
                        </Grid>
                        {msg}
                    </DialogContent>
                </React.Fragment>


                <DialogActions sx={{ justifyContent: 'center', mb: 2 }}>
                    <Button type='submit' variant='contained' onClick={handleSubmit}>Save</Button>
                    <Button variant='outlined' onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div >
    );
}