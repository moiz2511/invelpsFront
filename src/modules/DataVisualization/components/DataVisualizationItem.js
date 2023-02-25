import React, { useEffect, useState } from 'react'
import Chart from '../../UIUtils/Charts/ChartComponent';
import ColorConstants from '../../Core/constants/ColorConstants.json'
import { TextField, Card, Box, Divider, Chip, Backdrop, CircularProgress } from '@mui/material';

import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { styled } from '@mui/material/styles';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import FundamentalChartService from '../../DataAnalysis/services/FundamentalChartService';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: ColorConstants.APP_TABLE_HEAD_COLOR,
        color: theme.palette.common.white,
        padding: 8,
        fontSize: 11
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 11,
        padding: 8
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type()': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const Root = styled('h4')(({ theme }) => ({
    width: '100%',
    ...theme.typography.h4,
    '& > :not(style) + :not(style)': {
        marginTop: theme.spacing(2),
    },
}));


const DataVisualizationItem = (props) => {
    const restClient = new FundamentalChartService();
    const [showCircularProgress, setCircularProgress] = useState(false);
    const [analysisOverview, setAnalysisOverview] = useState("");
    const getTextToYearNotation = (input) => {
        if (input.toLowerCase().trim().startsWith("current y")) {
            let res = parseInt(input.toLowerCase().replace("current y", "").replace("-", "").trim())
            const d = new Date();
            return d.getFullYear() - res;

        }
    }
    let company = props.company;
    let tool = props.content.tool
    let measure = props.content.measure;
    let category = props.content.category;
    let metrics = props.content.metric;
    let from = getTextToYearNotation(props.content.model_from);
    let to = getTextToYearNotation(props.content.model_to);
    let ranges = props.content.range;

    useEffect(() => {
        getAnalysisData();
    }, []);

    const DeStructureAnalysisApiData = (apiData) => {
        let analysisOverview = ""
        let data = {
            labels: apiData.date_range,
            datasets: []
        }
        let dataLists = []
        for (let [dataIndex, companyData] of apiData.return_list.entries()) {
            let subList = []
            let obj = {}
            obj.label = companyData.company_name
            obj.borderColor = ColorConstants.CHART_COLORS[dataIndex]
            obj.backgroundColor = ColorConstants.CHART_COLORS[dataIndex]
            data.datasets.push(obj)
            console.log(companyData);
            if (companyData.company_name === company) {
                analysisOverview = analysisOverview.concat(String(company)).concat(" mean ").concat(String(companyData.metric))
                    .concat(" from ").concat(String(from))
                    .concat(" to ").concat(String(to)).concat(" is ")
                    .concat(String(companyData.mean));
            }
            for (let [index, key] of apiData.date_range.entries()) {
                subList.push(typeof (companyData[key]) === "string" ? companyData[key].replace("M", "") : companyData[key]);
            }
            dataLists.push(subList);
        }
        for (let [index, object] of data.datasets.entries()) {
            object.data = dataLists[index]
        }
        setAnalysisOverview(analysisOverview);
        return data;
    }

    ranges = ranges.split(",")
    ranges = ranges.map((range) => range.trim())
    metrics = metrics.split(",")
    metrics = metrics.map((metric) => metric.trim())
    console.log(company, tool, measure, category, metrics, from, to, ranges);
    const [headCellsData, setHeadCellsData] = useState({});
    const [chartInputData, setChartInputData] = useState({});
    const [onSubmitResponseReceived, setOnSubmitResponseReceived] = useState(false);
    const [chartTableContent, setChartTableContent] = useState([])
    const [chartApiResponse, setChartApiResponse] = useState("");


    const getAnalysisData = async () => {
        setCircularProgress(true);
        let body = {
            "companies": [company],
            "types": tool,
            "sc": measure,
            "cat": category,
            "from": from,
            "to": to,
            "metrics": metrics,
            "rangemetrics": ranges
        }
        await restClient.submitData(body)
            .then((response) => {
                console.log(response)
                const data = DeStructureAnalysisApiData(response.data);
                const localHeadCells = buildTableHeadCells(response.data);
                setChartApiResponse(response.data)
                setChartTableContent(response.data.return_list);
                // setAnalysisOverview(response.data.return_list.company_name+` average` + response.data.return_list.metric +
                // ` from ` + from + ` to  ` + to + ` is 25%,
                //  while average ReturnOnEquity of Luxury Goods industry is 7% and 8% for the sector Consumer Cyclical  
                // `)
                console.log(data)
                console.log(localHeadCells)
                setHeadCellsData(localHeadCells);
                setChartInputData(data);
                setOnSubmitResponseReceived(true);
                setCircularProgress(false);
                // setResultItemsCount(response.data.page_data * rowsPerPage)
            })
            .catch((err) => {
                console.log(err);
                setCircularProgress(false);
            });

    }

    // useEffect(() => {
    //   console.log("USE EFFECT TRIGGERED");
    //   buildTableHeadCells();
    // }, []);

    const buildTableHeadCells = (apiData) => {
        let localHeadCells = {
            data: [
                {
                    id: 'company_name',
                    label: 'Company',
                    isValueLink: false,
                },
                {
                    id: 'symbol',
                    label: 'Symbol',
                    isValueLink: false,
                },
                {
                    id: 'metric',
                    label: 'Metric',
                    isValueLink: false,
                }
            ]
        };
        console.log("Head Cells Function triggered");
        console.log(localHeadCells);
        for (let [index, year] of apiData.date_range.entries()) {
            localHeadCells.data.push({
                id: year,
                label: year,
                isValueLink: false
            })
        }
        localHeadCells.data.push({
            id: "mean",
            label: "Mean",
            isValueLink: false
        })
        localHeadCells.data.push({
            id: "sd",
            label: "SD",
            isValueLink: false
        })
        localHeadCells.data.push({
            id: "rsd",
            label: "RSD",
            isValueLink: false
        })
        localHeadCells.data.push({
            id: "n_years",
            label: "NbrOfYears",
            isValueLink: false
        })
        localHeadCells.data.push({
            id: "range",
            label: "Range",
            isValueLink: false
        })
        localHeadCells.data.push({
            id: "comment",
            label: "comment",
            isValueLink: false
        })
        return localHeadCells;
    }

    // const emptyRows =
    //   page > 0 ? Math.max(0, (1 + page) * rowsPerPage - resultItemsCount) : 0;
    return (
        <React.Fragment >
            {/* <Card sx={{ width: '98%', m: 1 }}>
                    </Card> */}
            <Card sx={{ width: '98%', m: 1, fontWeight: 'bold', position: 'relative' }}>
                <Root>
                    <Divider variant="middle" sx={{ mb: 0, padding: 0 }}>
                        <Chip label={props.content.question} />
                    </Divider>
                </Root>
                <TextField
                    margin='none'
                    sx={{ ml: 2, mr: 2, padding: 0, fontWeight: 'bold' }}
                    fullWidth
                    variant='filled'
                    multiline
                    value={analysisOverview}
                />
                {showCircularProgress && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Backdrop
                        sx={{ color: '#fff', position: 'absolute', zIndex: (theme) => theme.zIndex.drawer - 1, opacity: 0.5 }}
                        open={showCircularProgress}
                    >
                        <CircularProgress />
                    </Backdrop>
                </Box>}
                {onSubmitResponseReceived && <React.Fragment>
                    <Chart data={chartInputData}></Chart>
                    <Box sx={{ width: '100%' }}>
                        {/* <Paper sx={{ width: '100%', mb: 2 }}> */}
                        <TableContainer>
                            <Table
                                sx={{ minWidth: '98%', maxWidth: '99%', mt: 1 }}
                                aria-labelledby="tableTitle"
                                size='medium'
                            >
                                <TableHead>
                                    <TableRow>
                                        {headCellsData.data.map((headCell) => (
                                            <StyledTableCell
                                                key={headCell.id}
                                                padding='normal'
                                            >
                                                {headCell.label}
                                            </StyledTableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {chartTableContent
                                        // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            return (
                                                <StyledTableRow
                                                    hover
                                                    tabIndex={-1}
                                                    key={index}
                                                    sx={{ ml: 3 }}
                                                >
                                                    <StyledTableCell>
                                                        {row.company_name}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {row.symbol}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {row.metric}
                                                    </StyledTableCell>
                                                    {
                                                        chartApiResponse.date_range.map((field, index) => {
                                                            return (
                                                                <StyledTableCell key={index}>
                                                                    {row[field]}
                                                                </StyledTableCell>
                                                            );
                                                        })
                                                    }
                                                    <StyledTableCell>
                                                        {row.mean}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {row.sd}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {row.rsd}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {row.n_years}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {row.range}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {row.comment === "Above" ? <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}><span style={{ color: "#00B050", fontSize: 10, fontWeight: "bold" }}>{row.comment}</span><ArrowUpwardIcon sx={{ color: "#00B050" }} /></div> :
                                                            row.comment === "Below" ? <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}><span style={{ color: "#FF0000", fontSize: 10, fontWeight: "bold" }}>{row.comment}</span><ArrowDownwardIcon sx={{ color: "#FF0000" }} /></div> :
                                                                <span style={{ color: "#00B050", fontWeight: "bold" }}>{row.comment}</span>}
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </React.Fragment>
                }
            </Card>
        </React.Fragment >
    );
}

export default DataVisualizationItem;
