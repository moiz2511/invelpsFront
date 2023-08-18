import React from "react";
import CustomProgressBar from "../../UIUtils/ProgressBar";
import ColorConstants from '../../Core/constants/ColorConstants.json';
import { styled } from '@mui/material/styles';
import { Bubble } from 'react-chartjs-2';
import { Box, Card, Checkbox, Dialog, DialogContent, Divider, Grid, Table, TableBody, TableCell, tableCellClasses, TableHead, TableRow, Typography } from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: ColorConstants.APP_TABLE_HEAD_COLOR,
        color: theme.palette.common.white
    }
}));

const AnalysisModelGetResults = ({ isDialogOpened, handleCloseDialog, selectedData, fetchedData, company, analysisModel }) => {
    console.log(isDialogOpened,selectedData,fetchedData,company,analysisModel)
    let selectedRestructuredData = {}
    let selectedDataIds = []
    let fetchedRestructuredData = {}
    let displayData = {}
    selectedData.map(obj => {
        selectedDataIds.push(obj.id);
        selectedRestructuredData.hasOwnProperty(obj.measure) ? selectedRestructuredData[obj.measure].push(obj) : selectedRestructuredData[obj.measure] = [obj]
    })
    console.log(selectedRestructuredData);
    fetchedData.map(obj => {
        obj["checked"] = selectedDataIds.includes(obj.id) ? true : false
        fetchedRestructuredData.hasOwnProperty(obj.measure) ? fetchedRestructuredData[obj.measure].push(obj) : fetchedRestructuredData[obj.measure] = [obj]
    })
    Object.keys(fetchedRestructuredData).map(measure => {
        displayData[measure] = { countResult: { value: String(selectedRestructuredData[measure]?.length || 0) + "/" + String(fetchedRestructuredData[measure]?.length), result: (selectedRestructuredData[measure] ? (selectedRestructuredData[measure].length / fetchedRestructuredData[measure]?.length) : 0) * 100 } }
        fetchedRestructuredData[measure].map((obj) => {
            displayData[measure].hasOwnProperty(obj.category) ? displayData[measure][obj.category].push(obj) : displayData[measure][obj.category] = [obj]   
        })
    });

    const chartOptions = {
        plugins: {
            legend: {
                display: false
            }
        },
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                steps: 3,
                stepValue: 1,
                max: 4,
                title: {
                    display: true,
                    text: "Performance"
                },
            }, x: {
                beginAtZero: true,
                steps: 3,
                stepValue: 1,
                max: 4,
                title: {
                    display: true,
                    text: "Risk"
                }
            }
        }
    }

    return (
        <Dialog fullWidth maxWidth={false} open={isDialogOpened} onClose={handleCloseDialog}>
            <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
                <Grid item>
                    <Typography variant="h5">
                        Company: {company}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="h5">
                        Analysis Model: {analysisModel}
                    </Typography>
                </Grid>
            </Grid>
            <DialogContent>
                <Grid spacing={2} xs={12} container>
                    {Object.keys(displayData).map((measure) => {
                        const measurePercentage = displayData[measure].countResult.result;
                        return (
                            <>
                                <Grid item xs={6} key={measure}>
                                    <Card elevation={2} key={measure} sx={{ padding: '2' }}>
                                        <Grid xs={12} spacing={2} container sx={{ padding: 2 }}>
                                            <Grid xs={2} item>
                                                <Typography key={measure} sx={{ fontWeight: 'bold' }}>
                                                    {measure}
                                                </Typography>
                                            </Grid>
                                            <Grid xs={8} item>
                                                <CustomProgressBar bgcolor={measurePercentage > 66 ? "green" : measurePercentage > 33 ? "orange" : "red"} progress={String(measurePercentage.toFixed(2))} showBarText={true} textToDisplay={`${String(measurePercentage.toFixed(2))}%`} height={30} />
                                            </Grid>
                                            <Grid xs={2} item>
                                                <Typography key={measure}>
                                                    {displayData[measure].countResult.value}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid spacing={4} container>
                                            {
                                                Object.keys(displayData[measure]).filter((value) => value !== "countResult").map((category) => {
                                                    let percent = ((displayData[measure][category].filter((obj) => obj.checked === true).length / displayData[measure][category].length) * 100).toFixed(2)
                                                    return (
                                                        <Grid item>
                                                            <Table key={category} sx={{
                                                                [`& .${tableCellClasses.root}`]: {
                                                                    borderBottom: "none",
                                                                    fontSize: 12,
                                                                    padding: 0,
                                                                    paddingLeft: 2,
                                                                    paddingRight: 2
                                                                }
                                                            }} aria-label="caption table">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell sx={{ fontWeight: 'bold' }}>{category}</TableCell>
                                                                        <TableCell sx={{ fontWeight: 'bold' }}>Metric</TableCell>
                                                                        <TableCell><CustomProgressBar bgcolor={percent > 66 ? "green" : percent > 33 ? "orange" : "red"} progress={String(percent)} showBarText={true} textToDisplay={`${String(percent)}%`} height={30} /></TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {
                                                                        displayData[measure][category].map((obj) => (
                                                                            <TableRow key={obj.id}>
                                                                                <TableCell component="th" scope="row">
                                                                                    {obj.question}
                                                                                </TableCell>
                                                                                <TableCell>{obj.metric}</TableCell>
                                                                                <TableCell><Checkbox disabled checked={obj.checked} /></TableCell>
                                                                            </TableRow>
                                                                        ))
                                                                    }
                                                                </TableBody>
                                                            </Table>
                                                        </Grid>
                                                    )
                                                })
                                            }
                                        </Grid>
                                    </Card>
                                </Grid>
                            </>
                        )
                    })}
                </Grid>
                {/* <Divider /> */}
                <Card sx={{ padding: 2 }}>
                    <Grid spacing={2} container sx={{ justifyContent: 'center', textAlign: 'center' }}>
                        <Grid item>
                            <Table sx={{
                                [`&.${tableCellClasses.head}`]: {
                                    backgroundColor: ColorConstants.APP_TABLE_HEAD_COLOR,
                                    color: 'white',
                                    padding: 12
                                }
                            }
                            }>
                                <TableHead>
                                    <StyledTableCell>
                                        Company
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        Performance
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        Risk
                                    </StyledTableCell>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            {company}
                                        </TableCell>
                                        <TableCell>
                                            {displayData['Performance'].countResult.result > 66 ? '3' : displayData['Performance'].countResult.result > 33 ? '2' : '1'}
                                        </TableCell>
                                        <TableCell>
                                            {displayData['Risk'].countResult.result > 66 ? '1' : displayData['Risk'].countResult.result > 33 ? '2' : '3'}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <Table>
                                <TableHead>
                                    <StyledTableCell>
                                        Result Ranges
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        Performance
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        Risk
                                    </StyledTableCell>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <CustomProgressBar bgcolor='red' progress='100' height={30} showBarText={true} textToDisplay='0-33%' />
                                        </TableCell>
                                        <TableCell>
                                            1 Low
                                        </TableCell>
                                        <TableCell>
                                            3 High
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <CustomProgressBar bgcolor='orange' progress='100' height={30} showBarText={true} textToDisplay='33%-66%' />
                                        </TableCell>
                                        <TableCell>
                                            2 Medium
                                        </TableCell>
                                        <TableCell>
                                            2 Medium
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <CustomProgressBar bgcolor='green' progress='100' height={30} showBarText={true} textToDisplay='66%-100%' />
                                        </TableCell>
                                        <TableCell>
                                            3 High
                                        </TableCell>
                                        <TableCell>
                                            1 Low
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Grid>
                        <Grid item>
                            <Box sx={{ display: 'flex', m: 2 }}>
                                <Grid container>
                                    <Grid item sx={{ width: '100%' }}>
                                        {/* <label htmlFor='chartswitch' style={{ marginLeft: 10 }}> Line Chart</label> */}

                                        <div className="chart-container">
                                            <Bubble options={chartOptions} data={{
                                                datasets: [{
                                                    data: [{
                                                        x: displayData['Risk'].countResult.result > 66 ? '1' : displayData['Risk'].countResult.result > 33 ? '2' : '3',
                                                        y: displayData['Performance'].countResult.result > 66 ? '3' : displayData['Performance'].countResult.result > 33 ? '2' : '1',
                                                        r: 5
                                                    }],
                                                    backgroundColor: 'blue'
                                                }]
                                            }} />
                                        </div >
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                </Card>
            </DialogContent >
        </Dialog >
    );
}

export default AnalysisModelGetResults;