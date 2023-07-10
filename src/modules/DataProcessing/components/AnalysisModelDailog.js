import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Autocomplete, Grid, MenuItem } from '@mui/material';
import DpAnalysisModelService from '../services/DpAnalysisModelService';

const fromAndToDropDownValues = [
    {
        label: "CurrentYear-1",
        value: "Current Y -1"
    },
    {
        label: "CurrentYear-2",
        value: "Current Y -2"
    },
    {
        label: "CurrentYear-3",
        value: "Current Y -3"
    },
    {
        label: "CurrentYear-5",
        value: "Current Y -5"
    },
    {
        label: "CurrentYear-10",
        value: "Current Y -10"
    },
    {
        label: "CurrentYear-15",
        value: "Current Y -15"
    },
    {
        label: "CurrentYear-20",
        value: "Current Y -20"
    }
]

export default function AnalysisModelDialog({ isDialogOpened, handleCloseDialog, data, type }) {
    const restClient = new DpAnalysisModelService();
    console.log(type);
    const [isEditReq, setIsEditReq] = useState(false);
    const [isDeleteEvent, setIsDeleteEvent] = useState(false);
    const [model, setModel] = useState("");
    const [category, setCategory] = useState({ category: "" });
    const [measure, setMeasure] = useState({ measure: "" });
    const [question, setQuestion] = useState("");
    const [metric, setMetric] = useState({ metric: "" });
    const [tool, setTool] = useState({ tool: "" });
    const [range, setRange] = useState({ name: "" });
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const [toolDropDownValues, setToolDropDownValues] = useState([{ tool: "" }]);
    const [measureDropDownValues, setMeasureDropDownValues] = useState([{ measure: "" }]);
    const [categoryDropDownValues, setCategoryDropDownValues] = useState([{ category: "" }]);
    const [metricDropDownValues, setMetricDropDownValues] = useState([{ metric: "" }]);
    const [rangeNameDropDownValues, setRangeNameDropDownValues] = useState([{ name: "" }]);

    useEffect(() => {
        getToolsDropDown();
    }, []);

    useEffect(() => {
        if (type === "edit") {
            setIsEditReq(true);
            setModel(data.model);
            setCategory({ category: data.category });
            setMeasure({ measure: data.measure });
            setQuestion(data.question);
            setMetric({ metric: data.metric });
            setTool({ tool: data.tool });
            setRange({name: data.range});
            setFrom(data.model_from);
            setTo(data.model_to)
            console.log(isEditReq)
            console.log(data)
        } else if (type === 'delete') {
            setIsDeleteEvent(true);
        }
    }, [type]);

    const modelChangeHandler = (event) => {
        setModel(event.target.value)
    }

    const questionChangeHandler = (event) => {
        setQuestion(event.target.value)
    }

    const rangeChangeHandler = (event) => {
        setRange(event.target.value)
    }

    const fromChangeHandler = (event) => {
        setFrom(event.target.value)
    }

    const toChangeHandler = (event) => {
        setTo(event.target.value)
    }

    const handleClose = () => {
        handleCloseDialog(false);
    };

    async function getToolsDropDown() {
        await restClient.getToolsDropDownOptions()
            .then((response) => {
                setToolDropDownValues(response.data.resp_data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async function getMeasureDropDown(tool) {
        await restClient.getMeasureDropDownOptions({ tool })
            .then((response) => {
                setMeasureDropDownValues(response.data.resp_data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async function getCategoryDropDown(measure) {
        await restClient.getCategoryDropDownOptions({ tool: tool.tool, measure })
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

    async function getRangesNamesDropDown(metric) {
        await restClient.getRangesNamesDropDownOptions({ metric })
            .then((response) => {
                setRangeNameDropDownValues(response.data.resp_data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (type === "edit") {
            restClient.editAnalysisModel({ id: data.id, model, category: category.category, question, metric: metric.metric, tool: tool.tool, range: range.name, model_from: from, model_to: to, measure: measure.measure });
            handleCloseDialog(false);
        } else if (type === "add") {
            restClient.createAnalysisModel({ model, category: category.category, question, metric: metric.metric, tool: tool.tool, range: range.name, model_from: from, model_to: to, measure: measure.measure });
            handleCloseDialog(false);
        } else if (type === "delete") {
            restClient.deleteAnalysisModel(data.id);
            handleCloseDialog(false);
        }
    }
    return (
        <div>
            <Dialog open={isDialogOpened} onClose={handleClose}>
                {!isDeleteEvent && <React.Fragment>
                    <DialogTitle sx={{ backgroundColor: '#007AAA', textAlign: 'center' }}>{isEditReq ? "Edit AnalysisModel" : "Add New AnalysisModel"}</DialogTitle>
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
                                        id="model"
                                        label="Model"
                                        variant="standard"
                                        value={model}
                                        onChange={modelChangeHandler}
                                    />
                                    <Autocomplete
                                        size="small"
                                        fullWidth
                                        disablePortal={true}
                                        id="tool"
                                        getOptionLabel={(option) => option.tool}
                                        isOptionEqualToValue={(option, value) => option.tool === value.tool}
                                        options={toolDropDownValues}
                                        onChange={(event, newValue) => {
                                            setTool(newValue);
                                            getMeasureDropDown(newValue.tool)
                                        }}
                                        value={tool}
                                        renderInput={(params) => <TextField
                                            fullWidth
                                            margin="dense"
                                            SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }}
                                            {...params}
                                            variant="standard"
                                            label="Tool"
                                        />
                                        }
                                    />
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
                                </Grid>
                                <Grid item sx={{ width: '100%' }}>
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
                                            getRangesNamesDropDown(newValue.metric);
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
                                    <TextField
                                        margin="dense"
                                        id="question"
                                        label="Question"
                                        variant="standard"
                                        value={question}
                                        onChange={questionChangeHandler}
                                        fullWidth
                                    />
                                    <Autocomplete
                                        size="small"
                                        fullWidth
                                        disablePortal={true}
                                        id="range"
                                        getOptionLabel={(option) => option.name}
                                        isOptionEqualToValue={(option, value) => option.name === value.name}
                                        options={rangeNameDropDownValues}
                                        onChange={(event, newValue) => {
                                            setRange(newValue);
                                        }}
                                        // onChange={setMetricsFilter}
                                        value={range}
                                        // sx={{ minWidth: 240, mt: 0.4 }}
                                        renderInput={(params) => <TextField
                                            fullWidth
                                            margin="dense"
                                            SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }}
                                            {...params}
                                            variant="standard"
                                            label="Range"
                                        />
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        select
                                        margin="dense"
                                        id="from"
                                        label="From"
                                        variant="standard"
                                        value={from}
                                        onChange={fromChangeHandler}
                                    >
                                        {fromAndToDropDownValues.map((item) => (
                                            <MenuItem key={item.value} value={item.value}>
                                                {item.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField
                                        fullWidth
                                        select
                                        margin="dense"
                                        id="to"
                                        label="To"
                                        variant="standard"
                                        value={to}
                                        onChange={toChangeHandler}
                                    >
                                        {fromAndToDropDownValues.map((item) => (
                                            <MenuItem key={item.value} value={item.value}>
                                                {item.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </React.Fragment>
                }
                {
                    isDeleteEvent &&
                    <DialogContent>
                        Are you sure on deleting the AnalysisModel?
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