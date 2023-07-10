import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Autocomplete, Grid, MenuItem } from '@mui/material';
import DpCreateMetricsService from '../services/DpCreateMetricsService';
import DpAnalysisModelService from '../services/DpAnalysisModelService';

const operatorOptions = [
    {
        label: "Plus",
        value: "Plus"
    },
    {
        label: "Minus",
        value: "Minus"
    },
    {
        label: "DividedBy",
        value: "Dividedby"
    },
    {
        label: "MultipliedBy",
        value: "MultipliedBy"
    }
]

export default function CreateMetricsDialog({ isDialogOpened, handleCloseDialog, data, type }) {
    const restClient = new DpCreateMetricsService();
    const restClientAnalysis = new DpAnalysisModelService();
    const [isEditReq, setIsEditReq] = useState(false);
    const [isDeleteEvent, setIsDeleteEvent] = useState(false);
    const [measure, setMeasure] = useState({ measure: "" });
    const [category, setCategory] = useState({ category: "" });
    const [metric, setMetric] = useState({ metric: "" });
    const [item1, setItem1] = useState({ metric: "" });
    const [operator1, setOperator1] = useState("");
    const [item2, setItem2] = useState({ metric: "" });
    const [operator2, setOperator2] = useState("");
    const [item3, setItem3] = useState({ metric: "" });
    const [operator3, setOperator3] = useState("");
    const [item4, setItem4] = useState({ metric: "" });
    const [operator4, setOperator4] = useState("");
    const [item5, setItem5] = useState({ metric: "" });
    const [measureDropDownValues, setMeasureDropDownValues] = useState([{ measure: "" }]);
    const [categoryDropDownValues, setCategoryDropDownValues] = useState([{ category: "" }]);
    const [metricDropDownValues, setMetricDropDownValues] = useState([{ metric: "" }]);
    const [allMetricDropDownValues, setAllMetricDropDownValues] = useState([{ metric: "" }]);

    useEffect(() => {
        getMeasureDropDownValues();
    }, []);

    useEffect(() => {
        if (type === "edit") {
            setIsEditReq(true);
            setMeasure({ measure: data.measure });
            setCategory({ category: data.category });
            setMetric({ metric: data.metric });
            setItem1({ metric: data.item1 });
            setOperator1(data.operator1);
            setItem2({ metric: data.item2 });
            setOperator2(data.operator2);
            setItem3({ metric: data.item3 });
            setOperator3(data.operator3);
            setItem4({ metric: data.item4 });
            setOperator4(data.operator4);
            setItem5({ metric: data.item5 });
        } else if (type === 'delete') {
            setIsDeleteEvent(true);
        }
    }, [type]);

    const handleClose = () => {
        handleCloseDialog(false);
    };

    async function getMeasureDropDownValues() {
        await restClient.getMeasureDropDownOptions()
            .then((response) => {
                setMeasureDropDownValues(response.data.resp_data);
            })
            .catch((err) => {
                console.log(err);
            });
        getAllMetricDropDown();
    }

    async function getAllMetricDropDown() {
        await restClientAnalysis.getAllMetricsDropDownOptions()
            .then((response) => {
                setAllMetricDropDownValues(response.data.resp_data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async function getCategoryDropDown(measure) {
        await restClient.getCategoryDropDownOptions({ measure })
            .then((response) => {
                setCategoryDropDownValues(response.data.resp_data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async function getMetricDropDown(category) {
        await restClient.getMetricDropDownOptions({ category })
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
            restClient.editMetric({ id: data.id, measure: measure.measure, category: category.category, metric: metric.metric, item1: item1.metric, operator1, item2: item2.metric, operator2, item3: item3 ? item3.metric : "", operator3, item4: item4 ? item4.metric : "", operator4, item5: item5 ? item5.metric : "" });
            handleCloseDialog(false);
        } else if (type === "add") {
            restClient.createMetric({ measure: measure.measure, category: category.category, metric: metric.metric, item1: item1.metric, operator1, item2: item2.metric, operator2, item3: item3 ? item3.metric : "", operator3, item4: item4 ? item4.metric : "", operator4, item5: item5 ? item5.metric : "" });
            handleCloseDialog(false);
        } else if (type === "delete") {
            restClient.deleteMetric(data.id);
            handleCloseDialog(false);
        }
    }
    return (
        <div>
            <Dialog open={isDialogOpened} onClose={handleClose}>
                {!isDeleteEvent && <React.Fragment>
                    <DialogTitle sx={{ backgroundColor: '#007AAA', textAlign: 'center' }}>{isEditReq ? "Edit Metric" : "Add New Metric"}</DialogTitle>
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
                                        size="small"
                                        fullWidth
                                        disablePortal={true}
                                        id="measure"
                                        getOptionLabel={(option) => option.measure}
                                        isOptionEqualToValue={(option, value) => option.measure === value.measure}
                                        options={measureDropDownValues}
                                        onChange={(event, newValue) => {
                                            setMeasure(newValue);
                                            getCategoryDropDown(newValue.measure)
                                        }}
                                        value={measure}
                                        renderInput={(params) => <TextField
                                            fullWidth
                                            margin="dense"
                                            SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }}
                                            {...params}
                                            variant="standard"
                                            label="Measure"
                                        />
                                        }
                                    />
                                    <Autocomplete
                                        size="small"
                                        fullWidth
                                        disablePortal={true}
                                        id="category"
                                        getOptionLabel={(option) => option.category}
                                        isOptionEqualToValue={(option, value) => option.category === value.category}
                                        options={categoryDropDownValues}
                                        onChange={(event, newValue) => {
                                            setCategory(newValue);
                                            getMetricDropDown(newValue.category)
                                        }}
                                        value={category}
                                        renderInput={(params) => <TextField
                                            fullWidth
                                            margin="dense"
                                            SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }}
                                            {...params}
                                            variant="standard"
                                            label="Category"
                                        />
                                        }
                                    />
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
                                    <Autocomplete
                                        size="small"
                                        disablePortal={true}
                                        id="item1Filter"
                                        getOptionLabel={(option) => option.metric}
                                        isOptionEqualToValue={(option, value) => option.metric === value.metric}
                                        options={allMetricDropDownValues}
                                        onChange={(event, newValue) => {
                                            setItem1(newValue);
                                        }}
                                        // onChange={setMetricsFilter}
                                        value={item1}
                                        // sx={{ minWidth: 240, mt: 0.4 }}
                                        renderInput={(params) => <TextField
                                            fullWidth
                                            SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }}
                                            {...params}
                                            variant="standard"
                                            label="Item1"
                                        />
                                        }
                                    />
                                    <TextField
                                        select
                                        fullWidth
                                        margin="dense"
                                        id="operator1"
                                        label="Operator1"
                                        variant="standard"
                                        value={operator1}
                                        onChange={(event) => setOperator1(event.target.value)}
                                    >
                                        <MenuItem key="operator1Key" value="">
                                            None
                                        </MenuItem>
                                        {operatorOptions.map((item) => (
                                            <MenuItem key={item.value} value={item.value}>
                                                {item.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item sx={{ width: '100%' }}>
                                    <Autocomplete
                                        size="small"
                                        disablePortal={true}
                                        id="item2Filter"
                                        getOptionLabel={(option) => option.metric}
                                        isOptionEqualToValue={(option, value) => option.metric === value.metric}
                                        options={allMetricDropDownValues}
                                        onChange={(event, newValue) => {
                                            setItem2(newValue);
                                        }}
                                        value={item2}
                                        renderInput={(params) => <TextField
                                            fullWidth
                                            SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }}
                                            {...params}
                                            variant="standard"
                                            label="Item2"
                                        />
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        select
                                        margin="dense"
                                        id="operator2"
                                        label="Operator2"
                                        variant="standard"
                                        value={operator2}
                                        onChange={(event) => setOperator2(event.target.value)}
                                    >
                                        <MenuItem key="operator2Key" value="">
                                            None
                                        </MenuItem>
                                        {operatorOptions.map((item) => (
                                            <MenuItem key={item.value} value={item.value}>
                                                {item.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item sx={{ width: '100%' }}>
                                    <Autocomplete
                                        size="small"
                                        disablePortal={true}
                                        id="item3Filter"
                                        getOptionLabel={(option) => option.metric}
                                        isOptionEqualToValue={(option, value) => option.metric === value.metric}
                                        options={allMetricDropDownValues}
                                        onChange={(event, newValue) => {
                                            setItem3(newValue);
                                        }}
                                        value={item3}
                                        renderInput={(params) => <TextField
                                            fullWidth
                                            SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }}
                                            {...params}
                                            variant="standard"
                                            label="Item3"
                                        />
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        select
                                        margin="dense"
                                        id="operator3"
                                        label="Operator3"
                                        variant="standard"
                                        value={operator3}
                                        onChange={(event) => setOperator3(event.target.value)}
                                    >
                                        <MenuItem key="operator3Key" value="">
                                            None
                                        </MenuItem>
                                        {operatorOptions.map((item) => (
                                            <MenuItem key={item.value} value={item.value}>
                                                {item.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item sx={{ width: '100%' }}>
                                    <Autocomplete
                                        size="small"
                                        disablePortal={true}
                                        id="item4Filter"
                                        getOptionLabel={(option) => option.metric}
                                        isOptionEqualToValue={(option, value) => option.metric === value.metric}
                                        options={allMetricDropDownValues}
                                        onChange={(event, newValue) => {
                                            setItem4(newValue);
                                        }}
                                        value={item4}
                                        renderInput={(params) => <TextField
                                            fullWidth
                                            SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }}
                                            {...params}
                                            variant="standard"
                                            label="Item4"
                                        />
                                        }
                                    />
                                    <TextField
                                        select
                                        fullWidth
                                        margin="dense"
                                        id="operator4"
                                        label="Operator4"
                                        variant="standard"
                                        value={operator4}
                                        onChange={(event) => setOperator4(event.target.value)}
                                    >
                                        <MenuItem key="operator4Key" value="">
                                            None
                                        </MenuItem>
                                        {operatorOptions.map((item) => (
                                            <MenuItem key={item.value} value={item.value}>
                                                {item.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item sx={{ width: '100%' }}>

                                    <Autocomplete
                                        size="small"
                                        disablePortal={true}
                                        id="item5Filter"
                                        getOptionLabel={(option) => option.metric}
                                        isOptionEqualToValue={(option, value) => option.metric === value.metric}
                                        options={allMetricDropDownValues}
                                        onChange={(event, newValue) => {
                                            setItem5(newValue);
                                        }}
                                        value={item5}
                                        renderInput={(params) => <TextField
                                            fullWidth
                                            SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }}
                                            {...params}
                                            variant="standard"
                                            label="Item5"
                                        />
                                        }
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
                        Are you sure on deleting the Metric?
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