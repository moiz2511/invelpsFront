import React, { useState } from 'react';
import { Tooltip, Box,Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { HelpOutline } from '@mui/icons-material';

const BigBoxTooltip = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleTooltipHover = () => {
        setIsOpen(true);
    };

    const handleTooltipLeave = () => {
        setIsOpen(false);
    };
    console.log(props)
    const data = [
        {
            label: 'Label 1',
            value: 'Value 1'
        },
        {
            label: 'Label 2',
            value: 'Value 2'
        },
        {
            label: 'Label 3',
            value: 'Value 3'
        },
        {
            label: 'Label 4',
            value: 'Value 4'
        }
    ];

    const rows = [
        {
            col1: 'Measure',
            col2: 'Performance',
            col3: 'Category',
            col4: 'Profability Ratios',
        },
        {
            col1: 'Row 2',
            col2: 'Data 2',
               col3: 'Category',
            col4: 'Profability Ratios',
        },
        {
            col1: 'Row 3',
            col2: 'Data 3',
               col3: 'Category',
            col4: 'Profability Ratios',
        },
        {
            col1: 'Row 4',
            col2: 'Data 4',
               col3: 'Category',
            col4: 'Profability Ratios',
        },
        {
            col1: 'Row 5',
            col2: 'Data 5',
               col3: 'Category',
            col4: 'Profability Ratios',
        },
        {
            col1: 'Row 6',
            col2: 'Data 6',
               col3: 'Category',
            col4: 'Profability Ratios',
        }
    ];

    return (
        <>
        <Tooltip
sx={{ width: "40rem" ,boxShadow:"none",border:"none"}}
            title={

                <>
                    <TableContainer component={Paper} sx={{ width: "40rem", boxShadow: "none", border: "none" }}>
                        <Table>
                            <TableBody>
                                <TableRow >
                                    <TableCell align="left" style={{ width: '25%', fontWeight: 'bold' }}>Measure:</TableCell>
                                    <TableCell align="center" style={{ width: '25%' }}>{props.keyMatric == true ? props.row.unit.measure : props.row.measure}</TableCell>
                                    <TableCell align="left" style={{ width: '25%', fontWeight: 'bold' }}>{'Category:'}</TableCell>
                                    <TableCell align="center" style={{ width: '25%' }}>{props.keyMatric == true ? props.row.unit.category : props.row.category }</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TableContainer component={Paper} sx={{ width: "40rem", boxShadow: "none", border: "none" }}>
                        <Table>
                            <TableBody>
                                <TableRow style={{ backgroundColor: '#f5f5f5' }}>
                                    <TableCell align="left" style={{ width: '25%', fontWeight: 'bold' }}>Description:</TableCell>
                                    <TableCell style={{ width: '75%' }}>{props.keyMatric == true ? props.row.unit.description : props.row.description}</TableCell>
                                </TableRow>
                                <TableRow style={{ width: '100%' }}>
                                    <TableCell align="left" style={{ width: '25%', fontWeight: 'bold' }}>Formula:</TableCell>
                                    <TableCell style={{ width: '75%' }}>{props.keyMatric == true ? props.row.unit.function : props.row.function}</TableCell>
                                </TableRow>
                                <TableRow style={{ backgroundColor: '#f5f5f5' }}>
                                    <TableCell align="left" style={{ width: '25%', fontWeight: 'bold' }}>Interpretation:</TableCell>
                                    <TableCell style={{ width: '75%' }}>{props.keyMatric == true ? props.row.unit.interpretation : props.row.interpretation}</TableCell>
                                </TableRow>
                                <TableRow style={{ width: '100%' }}>
                                    <TableCell align="left" style={{ width: '25%', fontWeight: 'bold' }}>Limitation:</TableCell>
                                    <TableCell style={{ width: '75%' }}>{props.keyMatric == true ? props.row.unit.limitation : props.row.limitation}</TableCell>
                                </TableRow>

                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TableContainer component={Paper} sx={{ width: "40rem", boxShadow: "none", border: "none" }}>
                        <Table>
                            <TableBody>
                                <TableRow >
                                    <TableCell align="left" style={{ width: '25%', fontWeight: 'bold' }}>Good Range:</TableCell>
                                    <TableCell align="center" style={{ width: '25%' }}>{'>='}{props.keyMatric == true ? props.row.unit.good_range : props.row.good_range}</TableCell>
                                    <TableCell align="left" style={{ width: '25%', fontWeight: 'bold' }}>{'Bad Range:'}</TableCell>
                                    <TableCell align="center" style={{ width: '25%' }}>{'<='}{props.keyMatric == true ? props.row.unit.bad_range : props.row.bad_range}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            }
            enterDelay={500}
            leaveDelay={200}
            onOpen={handleTooltipHover}
            onClose={handleTooltipLeave}
            open={isOpen}
            placement="bottom-end"
        >
                <HelpOutline sx={{ color: '#1976d2', fontSize: '1.2rem' }} />
            
        </Tooltip>
            {/* <HelpOutline sx={{ color: 'blue' }} /> */}
        </>
    );
};

export default BigBoxTooltip;
