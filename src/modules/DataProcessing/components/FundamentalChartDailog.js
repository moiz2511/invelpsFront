import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Autocomplete, Grid, MenuItem } from '@mui/material';
import DpCreateMetricsService from '../services/DpCreateMetricsService';
import DpFundamentalChartService from '../services/DpFundamentalChartService';

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

export default function FundamentalChartDailog({ isDialogOpened, handleCloseDialog, data, type }) {
    const restClient = new DpFundamentalChartService();
    const [isEditReq, setIsEditReq] = useState(false);
    const [isDeleteEvent, setIsDeleteEvent] = useState(false);
    const [metric, setMetric] = useState("");
    const [source, setSource] = useState("");
    const [tool, setTool] = useState("");
    const [measure, setMeasure] = useState("");
    const [category, setCategory] = useState("");

    useEffect(() => {
        if (type === "edit") {
            setIsEditReq(true);
            setMetric(data.metric);
            setSource(data.source);
            setTool(data.tool);
            setMeasure(data.measure);
            setCategory(data.category);
        } else if (type === 'delete') {
            setIsDeleteEvent(true);
        }
    }, [type]);

    const handleClose = () => {
        handleCloseDialog(false);
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        if (type === "edit") {
            restClient.editFundamentalChartData({ id: data.id, metric, source, tool, measure, category });
            handleCloseDialog(false);
        } else if (type === "add") {
            restClient.createFundamentalChartData({ metric, source, tool, measure, category });
            handleCloseDialog(false);
        } else if (type === "delete") {
            restClient.deleteFundamentalChartData(data.id);
            handleCloseDialog(false);
        }
    }
    return (
        <div>
            <Dialog open={isDialogOpened} onClose={handleClose}>
                {!isDeleteEvent && <React.Fragment>
                    <DialogTitle sx={{ backgroundColor: '#007AAA', textAlign: 'center' }}>{isEditReq ? "Update FundamentalChart Data" : "Add New FundamentalChart Data"}</DialogTitle>
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
                                        fullWidth
                                        margin="dense"
                                        id="metric"
                                        label="Metric"
                                        variant="standard"
                                        value={metric}
                                        onChange={(event) => setMetric(event.target.value)}
                                    />
                                </Grid>
                                <Grid item sx={{ width: '100%' }}>
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        id="source"
                                        label="Source"
                                        variant="standard"
                                        value={source}
                                        onChange={(event) => setSource(event.target.value)}
                                    />
                                </Grid>
                                <Grid item sx={{ width: '100%' }}>
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        id="tool"
                                        label="Tool"
                                        variant="standard"
                                        value={tool}
                                        onChange={(event) => setTool(event.target.value)}
                                    />
                                </Grid>
                                <Grid item sx={{ width: '100%' }}>
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        id="measure"
                                        label="Measure"
                                        variant="standard"
                                        value={measure}
                                        onChange={(event) => setMeasure(event.target.value)}
                                    />
                                </Grid>
                                <Grid item sx={{ width: '100%' }}>
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        id="category"
                                        label="Category"
                                        variant="standard"
                                        value={category}
                                        onChange={(event) => setCategory(event.target.value)}
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
