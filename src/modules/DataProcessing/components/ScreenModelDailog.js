import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Autocomplete, Grid, MenuItem } from '@mui/material';
import DpScreenModelService from '../services/DpScreenModelService';

export default function ScreenModelDialog({ isDialogOpened, handleCloseDialog, data, type }) {
    const restClient = new DpScreenModelService();
    console.log(type);
    const [isEditReq, setIsEditReq] = useState(false);
    const [isDeleteEvent, setIsDeleteEvent] = useState(false);
    const [strategy, setStrategy] = useState("");
    const [description, setDescription] = useState("");
    const [metric, setMetric] = useState({ metric: "" });
    const [metricDropDownValues, setMetricDropDownValues] = useState([{ metric: "" }]);
    const [operator, setOperator] = useState("");
    const [range, setRange] = useState("");
    const [period, setPeriod] = useState("");

    useEffect(() => {
        getMetricsDropDown();
    }, []);

    useEffect(() => {
        if (type === "edit") {
            setIsEditReq(true);
            setStrategy(data.strategy);
            setDescription(data.description);
            setMetric({ metric: data.metric });
            setOperator(data.operator);
            setRange(data.range);
            setPeriod(data.period);
            console.log(isEditReq)
        } else if (type === 'delete') {
            setIsDeleteEvent(true);
        }
    }, [type]);

    const strategyChangeHandler = (event) => {
        setStrategy(event.target.value)
    }

    const descriptionChangeHandler = (event) => {
        setDescription(event.target.value)
    }

    const operatorChangeHandler = (event) => {
        setOperator(event.target.value)
    }

    const rangeChangeHandler = (event) => {
        setRange(event.target.value)
    }

    const periodChangeHandler = (event) => {
        setPeriod(event.target.value)
    }

    const handleClose = () => {
        handleCloseDialog(false);
    };

    async function getMetricsDropDown() {
        await restClient.getMetricsOptions()
            .then((response) => {
                setMetricDropDownValues(response.data.resp_data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (type === "edit") {
            restClient.editScreenModel({ id: data.id, strategy, description, metric: metric.metric, operator, range, period });
            handleCloseDialog(false);
        } else if (type === "add") {
            restClient.createScreenModel({ strategy, description, metric: metric.metric, operator, range, period });
            handleCloseDialog(false);
        } else if (type === "delete") {
            restClient.deleteScreenModel(data.id);
            handleCloseDialog(false);
        }
    }
    return (
        <div>
            <Dialog open={isDialogOpened} onClose={handleClose}>
                {!isDeleteEvent && <React.Fragment>
                    <DialogTitle sx={{ backgroundColor: '#007AAA', textAlign: 'center' }}>{isEditReq ? "Edit ScreenModel Style" : "Add New ScreenModel"}</DialogTitle>
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
                                    <TextField
                                        autoFocus
                                        fullWidth
                                        margin="dense"
                                        id="strategy"
                                        label="Strategy"
                                        variant="standard"
                                        value={strategy}
                                        onChange={strategyChangeHandler}
                                    />
                                    <TextField
                                        multiline
                                        fullWidth
                                        margin="dense"
                                        id="description"
                                        label="Description"
                                        variant="standard"
                                        value={description}
                                        onChange={descriptionChangeHandler}
                                    />
                                    {/* <TextField
                                        fullWidth
                                        margin="dense"
                                        id="metric"
                                        label="Metric"
                                        variant="standard"
                                        value={metric}
                                        onChange={metricChangeHandler}
                                    /> */}
                                    <Autocomplete
                                        size="small"
                                        fullWidth
                                        disablePortal={true}
                                        id="metricsFilter"
                                        getOptionLabel={(option) => option.metric}
                                        isOptionEqualToValue={(option, value) => option.metric === value.metric}
                                        options={metricDropDownValues}
                                        onChange={(event, newValue) => {
                                            setMetric(newValue);
                                        }}
                                        // onChange={setMetricsFilter}
                                        value={metric}
                                        // sx={{ minWidth: 240, mt: 0.4 }}
                                        renderInput={(params) => <TextField
                                            fullWidth
                                            SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }}
                                            {...params}
                                            variant="standard"
                                            label="Metric"
                                        />
                                        }
                                    />
                                </Grid>
                                <Grid item sx={{ width: '100%' }}>
                                    <TextField
                                        margin="dense"
                                        select
                                        id="operator"
                                        label="Operator"
                                        variant="standard"
                                        value={operator}
                                        onChange={operatorChangeHandler}
                                        fullWidth
                                    >
                                        <MenuItem value={'greaterThanOrEqual'}>
                                            GreaterThan Or Equal
                                        </MenuItem>
                                        <MenuItem value={'lessThanOrEqual'}>
                                            LessThan Or Equal
                                        </MenuItem>
                                        <MenuItem value={'greaterThan'}>
                                            GreaterThan
                                        </MenuItem>
                                        <MenuItem value={'lessThan'}>
                                            lessThan
                                        </MenuItem>
                                    </TextField>
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        id="range"
                                        label="Range"
                                        variant="standard"
                                        value={range}
                                        onChange={rangeChangeHandler}
                                    />
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        id="period"
                                        label="Period"
                                        variant="standard"
                                        value={period}
                                        onChange={periodChangeHandler}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </React.Fragment>
                }
                {
                    isDeleteEvent &&
                    <DialogContent>
                        Are you sure on deleting the ScreenModel?
                    </DialogContent>
                }
                <DialogActions sx={{ justifyContent: 'center', mb: 2 }}>
                    <Button type='submit' variant='contained' onClick={handleSubmit}>{isDeleteEvent ? "Delete" : isEditReq ? "Save" : "Submit"}</Button>
                    <Button variant='outlined' onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div >
    );
}