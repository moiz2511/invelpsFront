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
import { DoneOutline, CancelOutlined } from '@mui/icons-material';
import { green, red } from '@mui/material/styles';
import ScreenModelService from '../services/ScreenModelService';



import * as axios from "axios";

const columns = [
    { id: 'button', label: '' },
    { id: 'name', label: 'Name' },
    // { id: 'description', label: 'Descri' },
    { id: 'style', label: 'Style' },
    { id: 'mentor', label: 'Mentor' },
    { id: 'model', label: 'Screen Model' },
    { id: 'status', label: 'Last Result' },
    { id: 'isEmail', label: 'Email Notification' },
    { id: 'isTwitter', label: 'Tweet' },
    { id: 'isAIDescription', label: 'AI Description' },
    { id: 'lastResult', label: 'Last Run Time' },
    { id: 'nextRunTime', label: 'Next Run Time' },
    { id: 'frequency', label: 'Frequency' },
    { id: 'button1', label: '' },
    // { id: 'button2', label: '' },
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
    const restClient = new ScreenModelService();

    const [isDisable,setIsDisable]=useState(false)
    const executeEvent=async(task_id)=>{
        // setIsDisable(true)
        const body={
            'task_id':task_id
        }
        await restClient.runScreener(body)
            .then((response) => {
                console.log(response)
                alert(response.data.message)
            })
            .catch((err) => {
                console.log(err);
                alert('Network Error occurred')
            });
        
    }
    const deleteEvent = async(task_id) => {
        const body={
            'id':task_id
        }
        await restClient.deleteScreener(body)
            .then((response) => {
                console.log(response)
                alert(response.data.message)
                props.setGetAgain(props.getAgain?false:true)
            })
            .catch((err) => {
                console.log(err);
                alert('Network Error occurred')
            });
    }
    const renderButtonCell = (row,name) => {
        const buttonColor = name == "DELETE" ? 'secondary' : 'primary';

        return (
            <TableCell>
                <Button variant="contained" color={buttonColor} disabled={isDisable} onClick={() => { name == 'RUN'? executeEvent(row.id):deleteEvent(row.id) }}>{name}</Button>
            </TableCell>
        );
    };

    const renderStatusCell = (row) => {
        return (
            // <TableCell>
            //     <Checkbox checked={row.error&&row?.error=='no'? true:false} color="primary" />
            // </TableCell>
            <TableCell>
                { row.isError ==false ? (
                   <DoneOutline sx={{ color: '#4CAF50' }} /> 
                ) : (
                        <CancelOutlined sx={{ color: '#f44336' }} /> 
                )}
            </TableCell>
        );
    };

    const renderCheckCell = (row) => {
        return (
            // <TableCell>
            //     <Checkbox checked={row.error&&row?.error=='no'? true:false} color="primary" />
            // </TableCell>
            <TableCell>
                {row && row === true ? (
                   <DoneOutline sx={{ color: '#4CAF50' }} /> 
                ) : (
                        <CancelOutlined sx={{ color: '#f44336' }} /> 
                )}
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
        <TableContainer sx={{width:"100%",overflowX:"hidden" }}>
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
                            {renderDataCell(row.task_name)}
                            {/* {renderDataCell(row.task_Description)} */}
                            {renderDataCell(row.style)}
                            {renderDataCell(row.mentor)}
                            {renderDataCell(row.model)}
                            {renderStatusCell(row)}
                            {renderCheckCell(row.isEmail)}
                            {renderCheckCell(row.isTwitter)}
                            {renderCheckCell(row.isAIDescription)}
                            {renderDateCell(row,1)}
                            {renderDateCell(row,2)}
                            {renderDataCell(row.recurrence_pattern || 'Once')}
                            {renderButtonCell(row,'DELETE')}
                            {/* {renderButtonCell(row,'LOGS')} */}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default MyTable;
