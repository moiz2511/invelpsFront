import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Autocomplete, Grid, MenuItem } from '@mui/material';
import DpRangesService from '../services/DpRangesService';

export default function RangesDialog({ isDialogOpened, handleCloseDialog, data, type }) {
    const restClient = new DpRangesService();
    console.log(type);
    const [isEditReq, setIsEditReq] = useState(false);
    const [isDeleteEvent, setIsDeleteEvent] = useState(false);
    const [metric, setMetric] = useState({ metric: "" });
    const [name, setName] = useState("");
    const [source, setSource] = useState("");
    const [operator, setOperator] = useState("");
    const [min, setMin] = useState("");
    const [max, setMax] = useState("");
    const [analysis, setAnalysis] = useState("");
    const [metricDropDownValues, setMetricDropDownValues] = useState([{ metric: "" }]);

    useEffect(()=>{
        getMetricsDropDown();
    }, []);

    useEffect(() => {
        if (type === "edit") {
            setIsEditReq(true);
            setMetric({metric: data.metric});
            setName(data.name);
            setSource(data.source);
            setOperator(data.operator ? data.operator : "");
            setMin(data.min);
            setMax(data.max);
            setAnalysis(data.analysis);
            console.log(isEditReq)
        } else if (type === 'delete') {
            setIsDeleteEvent(true);
        }
    }, [type]);

    const nameChangeHandler = (event) => {
        setName(event.target.value)
    }

    const sourceChangeHandler = (event) => {
        setSource(event.target.value)
    }

    const operatorChangeHandler = (event) => {
        setOperator(event.target.value)
    }

    const minChangeHandler = (event) => {
        setMin(event.target.value)
    }

    const maxChangeHandler = (event) => {
        setMax(event.target.value)
    }

    const analysisChangeHandler = (event) => {
        setAnalysis(event.target.value)
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
            restClient.editRange({ id: data.id, metric: metric.metric, name, source, operator, min, max, analysis });
            handleCloseDialog(false);
        } else if (type === "add") {
            restClient.createRange({ metric: metric.metric, name, source, operator, min, max, analysis });
            handleCloseDialog(false);
        } else if (type === "delete") {
            restClient.deleteRange(data.id);
            handleCloseDialog(false);
        }
    }
    return (
        <div>
            <Dialog open={isDialogOpened} onClose={handleClose}>
                {!isDeleteEvent && <React.Fragment>
                    <DialogTitle sx={{ backgroundColor: '#007AAA', textAlign: 'center' }}>{isEditReq ? "Edit Range" : "Add New Range"}</DialogTitle>
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
                                    <Autocomplete
                                        autoFocus
                                        size="small"
                                        fullWidth
                                        disablePortal={true}
                                        id="metric"
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
                                            autoFocus
                                            fullWidth
                                            margin="dense"
                                            SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }}
                                            {...params}
                                            variant="standard"
                                            label="Metric"
                                        />
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        id="name"
                                        label="Name"
                                        variant="standard"
                                        value={name}
                                        onChange={nameChangeHandler}
                                    />
                                </Grid>
                                <Grid item sx={{ width: '100%' }}>
                                    <TextField
                                        margin="dense"
                                        id="source"
                                        label="Source"
                                        variant="standard"
                                        value={source}
                                        onChange={sourceChangeHandler}
                                        sx={{ minWidth: "48%" }}
                                    />
                                    <TextField
                                        margin="dense"
                                        select
                                        id="operator"
                                        label="Operator"
                                        variant="standard"
                                        value={operator}
                                        onChange={operatorChangeHandler}
                                        sx={{ minWidth: "48%" }}
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
                                </Grid>
                                <Grid item>
                                    <TextField
                                        sx={{ minWidth: "48%" }}
                                        margin="dense"
                                        id="min"
                                        label="Min"
                                        variant="standard"
                                        value={min}
                                        onChange={minChangeHandler}
                                    />
                                    <TextField
                                        sx={{ minWidth: "48%" }}
                                        margin="dense"
                                        id="max"
                                        label="Max"
                                        variant="standard"
                                        value={max}
                                        onChange={maxChangeHandler}
                                    />
                                    <TextField
                                        fullWidth
                                        multiline
                                        margin="dense"
                                        id="analysis"
                                        label="Analysis"
                                        variant="standard"
                                        value={analysis}
                                        onChange={analysisChangeHandler}
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
                        Are you sure on deleting the Range?
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