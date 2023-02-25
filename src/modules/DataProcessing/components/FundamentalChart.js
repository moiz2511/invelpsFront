import { TextField, Grid, Card, Box, Button, ButtonGroup, Backdrop, CircularProgress, Tooltip, Autocomplete, TableSortLabel } from '@mui/material';
import React, { useEffect, useState } from 'react'

import PageInfoBreadCrumbs from '../../Core/components/Layout/PageInfoBreadCrumbs';
import ColorConstants from '../../Core/constants/ColorConstants.json'

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import IconButton from '@mui/material/IconButton';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { visuallyHidden } from '@mui/utils';

import FundamentalChartDailog from './FundamentalChartDailog';
import DpAnalysisModelService from '../services/DpAnalysisModelService';
import DpFundamentalChartService from '../services/DpFundamentalChartService';

const headCells = {
    data: [
        {
            id: 'metric',
            label: 'Metric',
            isValueLink: false,
            sorting: true,
        },

        {
            id: 'source',
            label: 'Source',
            isValueLink: false,
            sorting: true
        },
        {
            id: 'tool',
            label: 'Tool',
            isValueLink: false,
            sorting: true
        },
        {
            id: 'measure',
            label: 'Measure',
            isValueLink: false,
            sorting: true
        },
        {
            id: 'category',
            label: 'Category',
            isValueLink: false,
            sorting: true
        },
        {
            id: 'actions',
            label: 'Actions',
            isValueLink: false,
            sorting: false
        }
    ]
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: ColorConstants.APP_TABLE_HEAD_COLOR,
        color: theme.palette.common.white,
        padding: 12
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 12,
        padding: 12
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

const DPFundamentalChart = () => {
    let pageLoc = window.location.pathname;
    const restClient = new DpFundamentalChartService();
    const restClientAnalysisModel = new DpAnalysisModelService();
    const [toolDropDownValues, setToolDropDownValues] = useState([{ tool: "All" }]);
    const [measureDropDownValues, setMeasureDropDownValues] = useState([{ measure: "All" }]);
    const [categoryDropDownValues, setCategoryDropDownValues] = useState([{ category: "All" }]);
    const [metricDropDownValues, setMetricDropDownValues] = useState([{ metric: "All" }]);
    const [tool, setTool] = useState({ tool: "All" });
    const [category, setCategory] = useState({ category: "All" });
    const [measure, setMeasure] = useState({ measure: "All" });
    const [metric, setMetric] = useState({ metric: "All" });
    const [metricListRespData, SetMetricListRespData] = useState([]);
    const [showDataInProgress, setShowDataInProgress] = useState(true);
    const [eventType, setEventType] = useState("add");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [clickedRowData, setclickedRowData] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 15));
        setPage(0);
    };

    useEffect(() => {
        getToolDropDown();
    }, []);

    async function getToolDropDown() {
        await restClientAnalysisModel.getToolsDropDownOptions()
            .then((response) => {
                setToolDropDownValues(response.data.resp_data);
            })
            .catch((err) => {
                console.log(err);
            });
        getMetricsListTableData("All", "All", "All", "All");
    }

    async function getMeasureDropDownByTool(tool) {
        const body = { tool }
        await restClientAnalysisModel.getMeasureDropDownOptions(body)
            .then((response) => {
                setMeasureDropDownValues(response.data.resp_data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async function getCategoryDropDownByMeasure(measure) {
        const body = { tool: tool.tool, measure }
        await restClientAnalysisModel.getCategoryDropDownOptions(body)
            .then((response) => {
                setCategoryDropDownValues(response.data.resp_data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async function getMetricDropDownByCategory(tool, measure, category) {
        const body = { tool, measure, category }
        await restClientAnalysisModel.getMetricDropDownOptions(body)
            .then((response) => {
                setMetricDropDownValues(response.data.resp_data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async function getMetricsListTableData(tool, measure, category, metric) {
        setShowDataInProgress(true);
        console.log(tool, measure, category, metric)
        const body = { tool, measure, category, metric }
        await restClient.getFundamentalChartData(body)
            .then((response) => {
                SetMetricListRespData(response.data.resp_data);
                setShowDataInProgress(false);
            })
            .catch((err) => {
                setShowDataInProgress(false);
                console.log(err);
            });
    }

    const handleOnAddRowClick = () => {
        setEventType("add")
        setIsDialogOpen(true);
    }

    const handleOnEditRowClick = (rowData) => {
        setEventType("edit")
        setclickedRowData(JSON.parse(rowData));
        setIsDialogOpen(true);
    }

    const handleOnDeleteRowClick = (rowData) => {
        setEventType("delete")
        setclickedRowData(JSON.parse(rowData));
        setIsDialogOpen(true);
    }

    const onFilterClick = () => {
        getMetricsListTableData(tool.tool, measure.measure, category.category, metric.metric)
    }

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - metricListRespData.length) : 0;

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('metric');

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    // This method is created for cross-browser compatibility, if you don't
    // need to support IE11, you can use Array.prototype.sort() directly
    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) {
                return order;
            }
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    const createSortHandler = (property) => (event) => {
        handleRequestSort(event, property);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    return (
        <React.Fragment>
            <Grid container>
                <PageInfoBreadCrumbs data={pageLoc} />
                <Grid container
                    spacing={2}
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { ml: 1, minWidth: '25ch' },
                    }}
                    noValidate
                    autoComplete="off">
                    <Grid item>
                        <Autocomplete
                            disablePortal={true}
                            id="tool"
                            getOptionLabel={(option) => option.tool}
                            isOptionEqualToValue={(option, value) => option.tool === value.tool}
                            options={toolDropDownValues}
                            onChange={(event, newValue) => {
                                setTool(newValue);
                                getMeasureDropDownByTool(newValue.tool)
                            }}
                            value={tool}
                            // sx={{ minWidth: 120, mt: 0.4 }}
                            renderInput={(params) => <TextField
                                margin="dense"
                                {...params}
                                variant="standard"
                                label="Tool"
                            />
                            }
                        />
                    </Grid>
                    <Grid item>
                        <Autocomplete
                            disablePortal={true}
                            id="measure"
                            getOptionLabel={(option) => option.measure}
                            isOptionEqualToValue={(option, value) => option.measure === value.measure}
                            options={measureDropDownValues}
                            onChange={(event, newValue) => {
                                setMeasure(newValue);
                                getCategoryDropDownByMeasure(newValue.measure)
                            }}
                            value={measure}
                            renderInput={(params) => <TextField
                                margin="dense"
                                {...params}
                                variant="standard"
                                label="Measure"
                            />
                            }
                        />
                    </Grid>
                    <Grid item>
                        <Autocomplete
                            disablePortal
                            id="category"
                            getOptionLabel={(option) => option.category}
                            isOptionEqualToValue={(option, value) => option.category === value.category}
                            options={categoryDropDownValues}
                            onChange={(event, newValue) => {
                                setCategory(newValue);
                                getMetricDropDownByCategory(tool.tool, measure.measure, newValue.category)
                            }}
                            value={category}
                            renderInput={(params) => <TextField

                                margin="dense"
                                {...params}
                                variant="standard"
                                label="Category"
                            />
                            }
                        />
                    </Grid>
                    <Grid item>
                        <Autocomplete
                            disablePortal
                            id="metric"
                            getOptionLabel={(option) => option.metric}
                            isOptionEqualToValue={(option, value) => option.metric === value.metric}
                            options={metricDropDownValues}
                            onChange={(event, newValue) => {
                                setMetric(newValue);
                            }}
                            value={metric}
                            renderInput={(params) => <TextField
                                margin="dense"
                                {...params}
                                variant="standard"
                                label="Metric"
                            />
                            }
                        />
                    </Grid>
                    <Grid item sx={{ mt: 2.4 }}>
                        <Button disabled={showDataInProgress} id="dpFundamentalChartFilter" type="submit" onClick={onFilterClick} variant="contained" size="medium"> Filter </Button>
                    </Grid>
                </Grid>
                <Card sx={{ width: '100%', m: 1, position: 'relative' }}>
                    {/* <CustomizedTable headCells={headCells} tableRows={analysisModelRespData} company={companyFilter} /> */}
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ textAlign: 'end', mt: 0.5 }}>
                            <Button variant='outlined' onClick={handleOnAddRowClick} startIcon={<AddCircleOutlineIcon />} sx={{ textTransform: 'none' }} >Add New Fundamental Chart</Button>
                        </Box>
                        <TableContainer>
                            <Table
                                sx={{ minWidth: '100%', maxWidth: '100%', mt: 1 }}
                                size='medium'
                            >
                                <TableHead>
                                    <TableRow>
                                        {headCells.data.map((headCell) => (
                                            <StyledTableCell
                                                key={headCell.id}
                                                padding='normal'
                                            >
                                                {headCell.sorting && <TableSortLabel
                                                    active={orderBy === headCell.id}
                                                    direction={orderBy === headCell.id ? order : 'asc'}
                                                    onClick={createSortHandler(headCell.id)}
                                                >
                                                    {headCell.label}
                                                    {orderBy === headCell.id ? (
                                                        <Box component="span" sx={visuallyHidden}>
                                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                        </Box>
                                                    ) : null}
                                                </TableSortLabel>}
                                                {!headCell.sorting &&
                                                    headCell.label
                                                }
                                            </StyledTableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {stableSort(metricListRespData, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            return (
                                                <StyledTableRow
                                                    hover
                                                    tabIndex={-1}
                                                    key={index}
                                                    sx={{ ml: 3 }}
                                                >
                                                    <StyledTableCell>
                                                        {row.metric}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {row.source}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {row.tool}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {row.measure}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {row.category}
                                                    </StyledTableCell>
                                                    <StyledTableCell padding='normal'>
                                                        <ButtonGroup disableElevation>
                                                            <Tooltip title="Edit">
                                                                <IconButton
                                                                    size="small"
                                                                    aria-label="edit"
                                                                    onClick={() => handleOnEditRowClick(JSON.stringify(row))}
                                                                >
                                                                    <EditIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Delete">
                                                                <IconButton
                                                                    size="small"
                                                                    aria-label="delete"
                                                                    onClick={() => handleOnDeleteRowClick(JSON.stringify(row))}
                                                                >
                                                                    <DeleteIcon color='error' />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </ButtonGroup>
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            );
                                        })}
                                    {emptyRows > 0 && (
                                        <TableRow
                                            style={{
                                                height: 53 * emptyRows,
                                            }}
                                        >
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[15, 20, 25, 50]}
                            component="div"
                            count={metricListRespData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Box>
                    {showDataInProgress && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Backdrop
                            sx={{ color: '#fff', position: 'absolute', zIndex: (theme) => theme.zIndex.drawer - 1, opacity: 0.5 }}
                            open={showDataInProgress}
                        >
                            <CircularProgress />
                        </Backdrop>
                    </Box>}

                    {isDialogOpen && <FundamentalChartDailog
                        isDialogOpened={isDialogOpen}
                        handleCloseDialog={() => setIsDialogOpen(false)}
                        data={clickedRowData}
                        type={eventType} />
                    }
                </Card>
            </Grid>
        </React.Fragment>
    )
}
export default DPFundamentalChart;
