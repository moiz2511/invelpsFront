import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid, MenuItem } from '@mui/material';
import DpInvestingStyleService from '../services/DpInvestingStyleService';

const riskToleranceOptions = [
    {
        label: "Conservative",
        value: "Conservative"
    },
    {
        label: "Moderate",
        value: "Moderate"
    },
    {
        label: "Aggressive",
        value: "Aggressive"
    },
]

export default function InvestingStyleDialog({ isDialogOpened, handleCloseDialog, data, type }) {
    const restClient = new DpInvestingStyleService();
    console.log(type);
    const [isEditReq, setIsEditReq] = useState(false);
    const [isDeleteEvent, setIsDeleteEvent] = useState(false);
    const [style, setStyle] = useState("");
    const [mentor, setMentor] = useState("");
    const [strategyName, setStrategyName] = useState("");
    const [source, setSource] = useState("");
    const [philosophy, setPhilosophy] = useState("");
    const [riskTolerance, setRiskTolerance] = useState("");
    const [periodRange, setPeriodRange] = useState("");
    const [fundReturn, setFundReturn] = useState("");
    const [marketReturn, setMarketReturn] = useState("");

    useEffect(() => {
        if (type === "edit") {
            setIsEditReq(true);
            setStyle(data.style);
            setMentor(data.mentor);
            setStrategyName(data.strategy_name);
            setSource(data.source);
            setPhilosophy(data.philosophy);
            setRiskTolerance(data.riskTolerance);
            setPeriodRange(data.periodRange);
            setFundReturn(data.fundReturn);
            setMarketReturn(data.marketReturn);
            console.log(isEditReq)
        } else if (type === 'delete') {
            setIsDeleteEvent(true);
        }
    }, [type]);

    const styleChangeHandler = (event) => {
        setStyle(event.target.value)
    }

    const mentorChangeHandler = (event) => {
        setMentor(event.target.value)
    }

    const strategyNameChangeHandler = (event) => {
        setStrategyName(event.target.value)
    }

    const sourceChangeHandler = (event) => {
        setSource(event.target.value)
    }

    const handleClose = () => {
        handleCloseDialog(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (type === "edit") {
            restClient.editInvestingStyle({ id: data.id, style, mentor, source, strategy_name: strategyName, periodRange, philosophy, fundReturn, marketReturn, riskTolerance });
            handleCloseDialog(false);
        } else if (type === "add") {
            restClient.createInvestingStyle({ style, mentor, source, strategy_name: strategyName, periodRange, philosophy, fundReturn, marketReturn, riskTolerance });
            handleCloseDialog(false);
        } else if (type === "delete") {
            restClient.deleteInvestingStyle(data.id);
            handleCloseDialog(false);
        }
    }
    return (
        <div>
            <Dialog open={isDialogOpened} onClose={handleClose}>
                {!isDeleteEvent && <React.Fragment>
                    <DialogTitle sx={{ backgroundColor: '#007AAA', textAlign: 'center' }}>{isEditReq ? "Edit Investing Style" : "Add New Investing Style"}</DialogTitle>
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
                                        id="style"
                                        label="Style"
                                        variant="standard"
                                        value={style}
                                        onChange={styleChangeHandler}
                                    />
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        id="mentor"
                                        label="Mentor"
                                        variant="standard"
                                        value={mentor}
                                        onChange={mentorChangeHandler}
                                    />
                                </Grid>
                                <Grid item sx={{ width: '100%' }}>
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        id="philosophy"
                                        label="Philosophy"
                                        variant="standard"
                                        value={philosophy}
                                        onChange={(event) => setPhilosophy(event.target.value)}
                                    />
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        id="startegyName"
                                        label="StrategyName"
                                        variant="standard"
                                        value={strategyName}
                                        onChange={strategyNameChangeHandler}
                                    />
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        id="period"
                                        label="Period"
                                        variant="standard"
                                        value={periodRange}
                                        onChange={(event) => setPeriodRange(event.target.value)}
                                    />
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        id="fundReturn"
                                        label="Avg annual return"
                                        variant="standard"
                                        value={fundReturn}
                                        onChange={(event) => setFundReturn(event.target.value)}
                                    />
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        id="marketReturn"
                                        label="Market avg annual return"
                                        variant="standard"
                                        value={marketReturn}
                                        onChange={(event) => setMarketReturn(event.target.value)}
                                    />
                                    <TextField
                                        fullWidth
                                        select
                                        margin="dense"
                                        id="riskTolerance"
                                        label="Risk Tolerance"
                                        variant="standard"
                                        value={riskTolerance}
                                        onChange={(event) => setRiskTolerance(event.target.value)}
                                    >
                                        {riskToleranceOptions.map((item) => (
                                            <MenuItem key={item.label} value={item.value}>
                                                {item.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        id="source"
                                        label="Source"
                                        variant="standard"
                                        value={source}
                                        onChange={sourceChangeHandler}
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
                        Are you sure on deleting the InvestingStyle?
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