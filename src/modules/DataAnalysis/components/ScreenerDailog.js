import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Autocomplete, Grid, MenuItem } from '@mui/material';
import ScreenerService from '../services/ScreenerService';
import { DataArray } from '@mui/icons-material';


const operatorDropDownValues = [
    {
        value: "greaterThanOrEqual"
    },
    {
        value: "lessThanOrEqual"
    },
    {
        value: "greaterThan"
    },
    {
        value: "lessThan"
    }
]

export default function AddMetricFilterDialog({ isDialogOpened, handleCloseDialog, data, type, setTableContent, counter}) {
    const restClient = new ScreenerService();
    const [isEditReq, setIsEditReq] = useState(false);
    const [isDeleteEvent, setIsDeleteEvent] = useState(false);
    const [category, setCategory] = useState({ category: "" });
    const [metric, setMetric] = useState({ metric: "", description: "",min:"",max:"",range:"" });
    const [operator, setOperator] = useState({value: "greaterThanOrEqual"});
    const [rangeValue, setRangeValue] = useState("");
    const [categoryDropDownValues, setCategoryDropDownValues] = useState([{ category: "" }]);
    const [metricDropDownValues, setMetricDropDownValues] = useState([{ metric: "", description: "" }]);

    useEffect(() => {
        if (type === "edit") {
            getCategoryDropDownValues();
            setIsEditReq(true);
            setCategory({ category: data.category });
            setMetric({ metric: data.metric, description: data.description,min:data.min, max:data.max ,range:data.range});
            setOperator({label: data.operator, value: data.operator});
            // setRangeValue(data.range =='available'?data.min: '0.15')
            setRangeValue('0.15')
            console.log('setting range')
        } else if (type === 'delete') {
            setIsDeleteEvent(true);
        } else {
            getCategoryDropDownValues();
        }
    }, [type]);

    const handleClose = () => {
        handleCloseDialog(false);
    };
    console.log(metric)
    console.log(rangeValue)
    async function getCategoryDropDownValues() {
        await restClient.getCategories()
            .then((response) => {
                setCategoryDropDownValues(response.data.resp_data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async function getMetricDropDown(category) {
        await restClient.getMetricsByCategory(category)
            .then((response) => {
                setMetricDropDownValues(response.data.resp_data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (type === "edit") {setTableContent((prevState) => prevState.map((obj)=> {
            if(obj.id === data.id){
                obj = {id: obj.id, category: category.category, metric: metric.metric, description: metric.description, operator: operator.value, value: rangeValue}
            }
            return obj;
        }));
            // restClient.editMetric({ id: data.id, measure: measure.measure, category: category.category, metric: metric.metric, item1: item1.metric, operator1, item2: item2.metric, operator2, item3: item3 ? item3.metric : "", operator3, item4: item4 ? item4.metric : "", operator4, item5: item5 ? item5.metric : "" });
            handleCloseDialog(false);
        } else if (type === "add") {
            setTableContent((prevState) => [...prevState, {id: counter+1, category: category.category, metric: metric.metric, description: metric.description, operator: operator.value, value: rangeValue}]);
            // restClient.createMetric({ measure: measure.measure, category: category.category, metric: metric.metric, item1: item1.metric, operator1, item2: item2.metric, operator2, item3: item3 ? item3.metric : "", operator3, item4: item4 ? item4.metric : "", operator4, item5: item5 ? item5.metric : "" });
            handleCloseDialog(false);
        } else if (type === "delete") {
            setTableContent((prevState) => [...prevState].filter((obj)=>obj.id !== data.id));
            // restClient.deleteMetric(data.id);
            handleCloseDialog(false);
        }
    }
    const setMetricFunc=(value)=>{
        setMetric(value)
        console.log(value)
        setRangeValue(value.range=='available'?value.min:'.15')
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
                                            setMetricFunc(newValue)
                                            // setMetric(newValue);
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
                                        fullWidth
                                        disabled 
                                        variant="standard"
                                        id="description"
                                        label="Description"
                                        value={metric.description}
                                    // onChange={(event)=>{setDescription(event.target.value)}}
                                    />
                                </Grid>

                                <Grid item sx={{ width: '100%' }}>
                                    <Autocomplete
                                        size="small"
                                        fullWidth
                                        disablePortal={true}
                                        id="operator"
                                        getOptionLabel={(option) => option.value}
                                        isOptionEqualToValue={(option, value) => option.value === value.value}
                                        options={operatorDropDownValues}
                                        onChange={(event, newValue) => {
                                            setOperator(newValue);
                                        }}
                                        value={operator}
                                        renderInput={(params) => <TextField
                                            fullWidth
                                            margin="dense"
                                            SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }}
                                            {...params}
                                            variant="standard"
                                            label="Operator"
                                        />
                                        }
                                    />
                                </Grid>
                                <Grid item sx={{ width: '100%', marginBottom: '4px', marginTop: '3px' }}>
                                    Range
                                    Min {metric.unit == 'percent' ? Number((metric.min || .15) * 100).toFixed(0) +'%' : metric.min || '.15'} -
                                    Max {metric.unit == 'percent' ? Number((metric.max || .15) * 100).toFixed(0) + '%' : metric.max || '.15'} 
                                </Grid>
                                <Grid item sx={{ width: '100%' }}>
                                    {/* <TextField
                                         required
                                        fullWidth
                                        variant="standard"
                                        id="range"
                                        label="Range"
                                        value={rangeValue}
                                        onChange={(event) => { setRangeValue(event.target.value) }}
                                    /> */}
                                    {metric.unit == 'percent' ? Number((rangeValue) * 100).toFixed(0) + '%' : rangeValue}
                                    <input type={'range'} min={metric.range == 'available' ? metric.min : '0.15'} max={metric.range =='available' ? metric.max :'0.15'} step={0.01} value={rangeValue}  onChange={(event) => { setRangeValue(event.target.value) }}  />
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