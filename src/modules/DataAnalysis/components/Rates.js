import React, { useEffect, useState } from 'react'

import { Backdrop, Box, Button, Card, Chip, CircularProgress, Grid, Tooltip } from '@mui/material';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CustomizedTable from '../../UIUtils/Table/TableContentComponent';
import PageInfoBreadCrumbs from '../../Core/components/Layout/PageInfoBreadCrumbs';
import DARatesService from '../services/RatesService';

const tableHeaderColumns = {
    data: [
        {
            id: "country",
            label: "Country"
        },
        {
            id: "year",
            label: "Year"
        },
        {
            id: "rate",
            label: "Rate"
        },
        {
            id: "rate_type",
            label: "RateType"
        }
    ]
}

const DARates = () => {
    let pageLoc = window.location.pathname;
    const restService = new DARatesService();
    const [countryFilter, setCountryFilter] = useState({country: ""});
    const [rateTypeFilter, setRateTypeFilter] = useState({rate_type: ""});
    const [fromFilter, setFromFilter] = useState("");
    const [toFilter, setToFilter] = useState("");

    const [tableContent, setTableContent] = useState([]);
    const [tableConentFetched, setTableContentFetched] = useState(false);
    const [countryDropDownValues, setCountryDropDownValues] = useState([{country: ""}]);
    const [rateTypesDropDownValues, setRateTypesDropDownValues] = useState([{rate_type: ""}]);
    const [showCircularProgress, setCircularProgress] = useState(false);

    useEffect(()=>{
        getCountriesDropDowns();
    }, []);

    const getCountriesDropDowns = async () => {
        await restService.getRatesCountriesDropDowns()
            .then((response) => {
                setCountryDropDownValues(response.data.countries);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const getRateTypesDropDowns = async (country) => {
        await restService.getRateTypesByCountry({country})
            .then((response) => {
                setRateTypesDropDownValues(response.data.rate_types);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setTableContentFetched(false);
        setCircularProgress(true);
        await restService.getDARatesData({ country: countryFilter.country, rateType: rateTypeFilter.rate_type, from_year: fromFilter, to_year: toFilter })
            .then((response) => {
                setTableContent(response.data.resp_data);
                setTableContentFetched(true);
                setCircularProgress(false);
            })
            .catch((err) => {
                console.log(err);
                setCircularProgress(false);
            });
    }

    return (
        <React.Fragment>
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
                    <Grid item sx={{ marginTop: 1.2 }}>
                        <Autocomplete
                            size="small"
                            disablePortal
                            id="countriesFilter"
                            sx={{ width: 240 }}
                            getOptionLabel={(option) => option.country}
                            isOptionEqualToValue={(option, value) => option.country === value.country}
                            options={countryDropDownValues}
                            onChange={(event, newValue) => {
                                setCountryFilter(newValue)
                                getRateTypesDropDowns(newValue.country)
                            }}
                            renderInput={(params) => <TextField
                                SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }}
                                {...params} variant="standard" label="Country" />}
                        />
                    </Grid>
                    <Grid item sx={{ marginTop: 0.75 }}>
                        <Autocomplete
                            size="small"
                            disablePortal
                            id="rateTypeFilter"
                            options={rateTypesDropDownValues}
                            getOptionLabel={(option) => option.rate_type}
                            isOptionEqualToValue={(option, value) => option.rate_type === value.rate_type}
                            onChange={(event, newValue) => {
                                setRateTypeFilter(newValue);
                            }}
                            sx={{ minWidth: 240, mt: 0.4 }}
                            renderInput={(params) => <TextField
                                SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }}
                                {...params} variant="standard" label="Rate Type" />}
                        />
                    </Grid>
                    <Grid item sx={{ marginTop: 0.75 }}>
                        <TextField
                            id="fromFilter"
                            label="From"
                            placeholder='Year'
                            helperText="Enter From Year Example: 2010"
                            variant="standard"
                            onChange={(event) => setFromFilter(event.target.value)}
                            value={fromFilter}
                        />
                    </Grid>
                    <Grid item sx={{ marginTop: 0.75 }}>
                        <TextField
                            id="toFilter"
                            label="To"
                            placeholder='Year'
                            helperText="Enter To Year Example: 2020"
                            variant="standard"
                            onChange={(event) => setToFilter(event.target.value)}
                            value={toFilter}
                        />
                    </Grid>
                    <Grid item sx={{ marginTop: 0.75 }}>
                        <Button id="daRatesSubmit" type="submit" variant="contained" size="medium" onClick={onSubmitHandler} sx={{ mt: 1.5 }} > Submit </Button>
                    </Grid>
                </Grid>
            </Box>

            <Card sx={{ width: '98%', m: 1, position: 'relative' }}>
                {showCircularProgress && <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}
                {showCircularProgress && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Backdrop
                        sx={{ color: '#fff', position: 'absolute', zIndex: (theme) => theme.zIndex.drawer - 1, opacity: 0.5 }}
                        open={showCircularProgress}
                    >
                        <CircularProgress />
                    </Backdrop>
                </Box>}
                {tableConentFetched && <CustomizedTable tableRows={tableContent} headCells={tableHeaderColumns} />}
            </Card>
        </React.Fragment>
    );
}

export default DARates;
