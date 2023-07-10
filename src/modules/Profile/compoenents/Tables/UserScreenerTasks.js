import React, { useEffect, useState } from 'react';
import ScreenModelService from '../../services/ScreenModelService';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

const UserScreenTasks = (props) => {
    const restClient = new ScreenModelService();

    const [getAgain, setGetAgain] = useState(false)

    const [tasks, setTasks] = useState([])
    const [currentTask, setCurrentTask] = useState(null)
    const [open, setOpen] = useState(false);

    const columns = [
        { id: 'button', label: '' },
        { id: 'name', label: 'Name' },
        { id: 'screener', label: 'Screener' },
        { id: 'created', label: 'Created' },
        { id: 'frequency', label: 'Frequency' },
        { id: 'button1', label: '' }
    ];
    const renderDataCell = (data) => {
        return (
            <TableCell>{data}</TableCell>
        );
    };

    const renderDateCell = (data, number) => {
        const date = new Date(data.created);

        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });

        return (
            <TableCell>
                {`${formattedDate} ${formattedTime}`}
            </TableCell>
        );
    };

    const details = (value) => {
        setCurrentTask(value)
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const renderButtonCell = (row, name) => {
        const buttonColor = name == "Details" ? 'secondary' : 'primary';

        return (
            <TableCell>
                <Button variant="contained" color={buttonColor} onClick={() => name == 'Details' ? details(row) : null} >{name}</Button>
            </TableCell>
        );
    };

    const executeEvent = async (task_id) => {
        // setIsDisable(true)
        // const body={
        //     'task_id':task_id
        // }
        // await restClient.runScreener(body)
        //     .then((response) => {
        //         console.log(response)
        //         alert(response.data.message)
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //         alert('Network Error occurred')
        //     });

    }
    const deleteEvent = async (task_id) => {
        const body = {
            'id': task_id
        }
        //     await restClient.deleteScreener(body)
        //         .then((response) => {
        //             console.log(response)
        //             alert(response.data.message)
        //             props.setGetAgain(props.getAgain?false:true)
        //         })
        //         .catch((err) => {
        //             console.log(err);
        //             alert('Network Error occurred')
        //         });
    }
    const renderBooleanIcon = (value) => {
        return value ? <CheckIcon style={{ color: 'green' }} /> : <ClearIcon style={{ color: 'red' }} />;
    };



    useEffect(() => {
        const getUserScreenerTasks = async () => {
            await restClient.getUserScreenerTasks()
                .then((response) => {
                    console.log(response)
                    setTasks(response.data.tasks)
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        getUserScreenerTasks()
    }, [getAgain])
    return (
        <div>
            <TableContainer sx={{ width: "100%", overflowX: "hidden" }}>
                <Table sx={{ border: "1px solid grey", borderRadius: ".5rem" }}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#FF4500" }}>
                            {columns.map((column) => (
                                <TableCell key={column.id} sx={{ color: "#fff", fontWeight: "bold" }}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {tasks && tasks.map((row, i) => (
                            <TableRow key={row.id} sx={{ backgroundColor: i % 2 == 0 ? "#fff" : "#ddd" }}>
                                {renderButtonCell(row, 'RUN')}
                                {renderDataCell(row.name)}
                                {renderDataCell(row.screener)}
                                {renderDateCell(row, 1)}
                                {renderDataCell(row.recurrence_pattern || 'Once')}
                                {renderButtonCell(row, 'Details')}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {currentTask &&
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{currentTask.name}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <strong>Name:</strong> {currentTask.name}
                        </DialogContentText>
                        <DialogContentText>
                            <strong>Description:</strong> {currentTask.description}
                        </DialogContentText>
                        <DialogContentText>
                            <strong>Email:</strong> {currentTask.email}
                        </DialogContentText>
                        <DialogContentText>
                            <strong>Screener Name:</strong> {currentTask.screener}
                        </DialogContentText>
                        <DialogContentText>
                            <strong>Created:</strong> {currentTask.created}
                        </DialogContentText>
                        <DialogContentText>
                            <strong>recurrence_pattern:</strong> {currentTask.recurrence_pattern || 'Once'}
                        </DialogContentText>
                        <DialogContentText>
                            <strong>isEmail:</strong> {renderBooleanIcon(currentTask.isEmail)}
                        </DialogContentText>
                        <DialogContentText>
                            <strong>isRecurring:</strong> {renderBooleanIcon(currentTask.isRecurring)}
                        </DialogContentText>
                    </DialogContent>
                </Dialog>}
        </div>
    );
};

export default UserScreenTasks;
