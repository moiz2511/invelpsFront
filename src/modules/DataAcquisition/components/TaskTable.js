import  React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Constants from "./../../../Constants.json"

import * as axios from "axios";

const columns = [
    { id: 'button', label: '' },
    { id: 'name', label: 'Name' },
    { id: 'status', label: 'Last Result' },
    { id: 'lastResult', label: 'Last Run Time' },
    { id: 'nextRunTime', label: 'Next Run Time' },
    { id: 'frequency', label: 'Frequency' },
    { id: 'button1', label: '' },
    { id: 'button2', label: '' },
];

const rows = [
    {
        id: 1,
        name: 'Run Next',
        status: true,
        lastResult: '2022-04-15',
        nextRunTime: '2022-04-16',
        frequency: 'Daily',
    },
    // add more rows as needed
];

const MyTable = (props) => {

    const [isDisable,setIsDisable]=useState(false)
    const executeEvent=(event_id)=>{
        setIsDisable(true)
        axios.post(`${Constants.BACKEND_SERVER_BASE_URL}/automation/executeEvent`, { id: event_id })
            .then(response => {
                console.log(response)
                alert("Event being executed in the background.");
                setIsDisable(false)
            })
            .catch(error => {
                alert("Network or server Error.");
                setIsDisable(false)
            })
    }
    const deleteEvent = (event_id) => {
        setIsDisable(true)
        axios.post(`${Constants.BACKEND_SERVER_BASE_URL}/automation/deleteEvent`, { id: event_id })
            .then(response => {
                console.log(response)
                alert("Event deleted successfully.");
                setIsDisable(false)
                props.setHandler(props.handler==true?false:true)
            })
            .catch(error => {
                alert("Network or server Error.");
                setIsDisable(false)
            })
    }
    const renderButtonCell = (row,name) => {
        const buttonColor = name == "DELETE" ? 'secondary' : 'primary';

        return (
            <TableCell>
                <Button variant="contained" color={buttonColor} disabled={isDisable} onClick={() => { name == 'LOGS' ? props.handleEventClick(row) : name == 'RUN'? executeEvent(row.id):deleteEvent(row.id) }}>{name}</Button>
            </TableCell>
        );
    };

    const renderStatusCell = (row) => {
        return (
            <TableCell>
                <Checkbox checked={true} color="primary" />
            </TableCell>
        );
    };

    const renderDataCell = (data) => {
        return (
            <TableCell>{data}</TableCell>
        );
    };

    const renderDateCell = (data, number) => {
        const date = number === 1 ? new Date(data.last_occurrence) : new Date(getRecurrenceMultiplier(data.recurrence_pattern, new Date(data.last_occurrence))) ;

        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });

        return (
            <TableCell>
                {number == 1 ? `${formattedDate} ${formattedTime}` : data.is_recurring?`${formattedDate} ${formattedTime}`:''}
            </TableCell>
        );
    };

    const getRecurrenceMultiplier = (pattern,date) => {
        if (pattern === 'D') {
            // add 1 day
            date.setDate(date.getDate() + 1);
        } else if (pattern === 'W') {
            // add 1 week
            date.setDate(date.getDate() + 7);
        } else if (pattern === 'M') {
            // add 1 month
            date.setMonth(date.getMonth() + 1);
        } else if (pattern === 'HY') {
            // add 6 months
            date.setMonth(date.getMonth() + 6);
        } else if (pattern === 'Y') {
            // add 1 year
            date.setFullYear(date.getFullYear() + 1);
        }
        return date
    };



    return (
        <TableContainer sx={{width:"80%",overflowX:"hidden" }}>
            <Table sx={{ border: "1px solid grey", borderRadius: ".5rem" }}>
                <TableHead>
                    <TableRow sx={{ backgroundColor:"#FF4500"}}>
                        {columns.map((column) => (
                            <TableCell key={column.id} sx={{color:"#fff",fontWeight:"bold"}}>
                                {column.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody >
                    {props.data.map((row , i) => (
                        <TableRow key={row.id} sx={{backgroundColor:i%2==0 ? "#fff":"#ddd"}}>
                            {renderButtonCell(row,'RUN')}
                            {renderDataCell(row.name)}
                            {renderStatusCell(row)}
                            {renderDateCell(row,1)}
                            {renderDateCell(row,2)}
                            {renderDataCell(row.recurrence_pattern || 'Once')}
                            {renderButtonCell(row,'DELETE')}
                            {renderButtonCell(row,'LOGS')}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default MyTable;
