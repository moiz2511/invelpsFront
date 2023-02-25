import React, { useEffect, useState } from 'react'

import { Backdrop, Box, Card, CircularProgress, Grid, Tooltip } from '@mui/material';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CustomizedTable from '../../UIUtils/Table/TableContentComponent';
import DARangesService from '../services/RangesService';
import PageInfoBreadCrumbs from '../../Core/components/Layout/PageInfoBreadCrumbs';

const DARanges = () => {
    let pageLoc = window.location.pathname;
    const restService = new DARangesService();
    const [metricsFilter, setMetricsFilter] = useState("");
    const [metricDropDowns, setMetricDropDowns] = useState([]);

    const [tableContent, setTableContent] = useState([]);
    const tableHeaderColumns = {
        data: [
            {
                id: "metrics",
                label: "Metrics"
            }, {
                id: "name",
                label: "Name"
            }, {
                id: "source",
                label: "Source"
            }, {
                id: "operator",
                label: "Operator"
            }, {
                id: "min",
                label: "Min"
            }, {
                id: "max",
                label: "Max"
            }, {
                id: "analysis",
                label: "Analysis"
            }
        ]
    }

    const [tableConentFetched, setTableContentFetched] = useState(false);
    const [showCircularProgress, setCircularProgress] = useState(false);

    const getRangeMetricDropDowns = async () => {
        await restService.getDARangeMetrics()
            .then((response) => {
                setMetricDropDowns(response.data.resp_data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const getMetricRangeDataHandler = async (metric) => {
        setTableContentFetched(false);
        setCircularProgress(true);
        await restService.getDARangeMetricsData({ metric })
            .then((response) => {
                setTableContent(response.data.resp_data);
                setTableContentFetched(true);
                setCircularProgress(false);
            })
            .catch((err) => {
                console.log(err);
            });

        setCircularProgress(false);
    }

    useEffect(() => {
        getRangeMetricDropDowns();
    }, []);

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
                    <Grid item sx={{ marginTop: 0.75 }}>
                        <Autocomplete
                            size="small"
                            disablePortal
                            id="metricFilter"
                            options={metricDropDowns}
                            getOptionLabel={(option) => option}
                            isOptionEqualToValue={(option, value) => option === value}
                            onChange={(event, newValue) => {
                                setMetricsFilter(newValue);
                                getMetricRangeDataHandler(newValue);
                            }}
                            value={metricsFilter}
                            sx={{ minWidth: 240, mt: 0.4 }}
                            renderInput={(params) => <TextField
                                SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }}
                                {...params} variant="standard" label="Metrics" />}
                        />
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

export default DARanges;
