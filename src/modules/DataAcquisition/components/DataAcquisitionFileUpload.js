import React, { useState } from 'react'

import { Backdrop, Box, Button, CircularProgress, Grid, MenuItem } from '@mui/material';

import TextField from '@mui/material/TextField';
import DataAcquisitionService from '../services/DataAcquisitionService';
import PageInfoBreadCrumbs from '../../Core/components/Layout/PageInfoBreadCrumbs';

const DataAcquisitionFileUpload = () => {
    let pageLoc = window.location.pathname;
    const restService = new DataAcquisitionService();
    const [file, setFile] = useState("");
    const [table, setTable] = useState("Reported income statement");
    const [showCircularProgress, setCircularProgress] = useState(false);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setCircularProgress(true);
        let formData = new FormData();
        formData.append('file', file)
        formData.append('table', table)
        // console.log({ companies: companiesFilter.map((item) => item.symbol), type: typeFilter.type, years: nYearsFilter, apiKey })
        await restService.dataAcquisitionFileUpload(formData)
            .then((response) => {
                setCircularProgress(false);
                alert("Data Acquisition Successfull");
            })
            .catch((err) => {
                setCircularProgress(false);
                alert("Data Acquisition Failed", err);
                console.log(err);
            });
    }

    const fileHandler = (event) => {
        setFile(event.target.files[0]);
    }

    return (
        <Box sx={{ marginLeft: 1 }}>
            <PageInfoBreadCrumbs data={pageLoc} />
            <Grid container
                spacing={1}
                component="form"
                sx={{
                    '& .MuiTextField-root': { minWidth: '20ch' },
                }}
                noValidate
                autoComplete="off">

                <Grid item sx={{ marginTop: 0.75 }}>
                    <TextField
                        id="excel-file"
                        label="ExcelFile"
                        variant="standard"
                        onChange={fileHandler}
                        // value={file}
                        type='file'
                    />
                </Grid>
                <Grid item sx={{ marginTop: 0.75 }}>
                    <TextField
                        select
                        id="table"
                        label="Table"
                        variant="standard"
                        onChange={(event) => setTable(event.target.value)}
                        value={table}
                    >
                        <MenuItem key={"Reported income statement"} value="Reported income statement">
                            {"Reported income statement"}
                        </MenuItem>
                        <MenuItem key={"Reported balance sheet"} value="Reported balance sheet">
                            {"Reported balance sheet"}
                        </MenuItem>
                        <MenuItem key={"Reported cash flow sheet"} value="Reported cash flow sheet">
                            {"Reported cash flow sheet"}
                        </MenuItem>
                        <MenuItem key={"Rates"} value="Rates">
                            {"Rates"}
                        </MenuItem>
                        <MenuItem key={"Aggregate Codes"} value="Aggregate Codes">
                            {"Aggregate Codes"}
                        </MenuItem>
                        <MenuItem key={"Ranges"} value="Ranges">
                            {"Ranges"}
                        </MenuItem>
                        <MenuItem key={"Revenue Sector"} value="Revenue Sector">
                            {"Revenue Sector"}
                        </MenuItem>
                        <MenuItem key={"Revenue Location"} value="Revenue Location">
                            {"Revenue Location"}
                        </MenuItem>
                    </TextField>
                </Grid>
                <Grid item sx={{ marginTop: 0.75 }}>
                    <Button id="dataAcquisitionUploadFileSubmit" type="submit" variant="contained" size="medium" onClick={onSubmitHandler} sx={{ mt: 1.5 }} > Submit </Button>
                </Grid>
                {showCircularProgress && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Backdrop
                        sx={{ color: '#fff', position: 'absolute', zIndex: (theme) => theme.zIndex.drawer - 1, opacity: 0.5 }}
                        open={showCircularProgress}
                    >
                        <CircularProgress />
                    </Backdrop>
                </Box>}
            </Grid>
        </Box>
    );
}

export default DataAcquisitionFileUpload;
