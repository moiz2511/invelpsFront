import React, { useEffect, useState } from 'react'
import { TextField, MenuItem, Grid, Card, Button, Autocomplete, Box, ButtonGroup, Tooltip, Backdrop, CircularProgress, TableSortLabel } from '@mui/material';
import DpRangesService from '../services/DpRangesService';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';

import ColorConstants from '../../Core/constants/ColorConstants.json'
import RangesDialog from './RangesDialog';
import PageInfoBreadCrumbs from '../../Core/components/Layout/PageInfoBreadCrumbs';

const headCells = {
    data: [
        {
            id: 'metric',
            label: 'Metrics',
            isValueLink: false,
            sorting: true,
        },
        {
            id: 'name',
            label: 'Name',
            isValueLink: false,
            sorting: true,
        },
        {
            id: 'source',
            label: 'Source',
            isValueLink: false,
            sorting: true,
        },
        {
            id: 'operator',
            label: 'Operator',
            isValueLink: false,
            sorting: true,
        },
        {
            id: 'min',
            label: 'Min',
            isValueLink: false,
            sorting: true,
        },
        {
            id: 'max',
            label: 'Max',
            isValueLink: false,
            sorting: true,
        },
        {
            id: 'analysis',
            label: 'Analysis',
            isValueLink: false,
            sorting: true,
        },
        {
            id: 'actions',
            label: 'Actions',
            isValueLink: false,
            sorting: false,
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

const DataProcessingRanges = () => {

    let pageLoc = window.location.pathname;
    const restClient = new DpRangesService();
    const [metricFilter, setMetricFilter] = useState("All");
    const [metricFilterDropDownValues, setMetricFilterDropDownValues] = useState([]);
    const [nameFilter, setNameFilter] = useState("All");
    const [nameFilterDropDownValues, setNameFilterDropDownValues] = useState([]);

    const [resultItemsCount, setResultItemsCount] = useState(0);

    const [eventType, setEventType] = useState("add");

    const [submitResponse, setSubmitresponse] = useState([]);

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [clickedRowData, setclickedRowData] = useState("");
    const [showCircularProgress, setCircularProgress] = useState(false);
    const [enableSubmitButton, setEnableSubmitButton] = useState(false);
    const [allRangesDropDowns, setAllRangesDropDowns] = useState([])
    // const setMetricFilterHandler = (event) => {
    //     setMetricFilter(event.target.value);
    // }
    const setNameFilterHandler = (event) => {
        setNameFilter(event.target.value);
    }

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        // fetchRanges(newPage + 1);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOnAddRowClick = () => {
        setEventType("add")
        setIsDialogOpen(true);
    }

    const handleOnEditRowClick = (rowData) => {
        setEventType("edit")
        console.log(rowData);
        setclickedRowData(JSON.parse(rowData));
        setIsDialogOpen(true);
    }

    const handleOnDeleteRowClick = (rowData) => {
        setEventType("delete")
        console.log(rowData);
        setclickedRowData(JSON.parse(rowData));
        setIsDialogOpen(true);
    }

    useEffect(() => {
        setEnableSubmitButton(false);
        getDropDownValues();
        fetchRanges(1);
    }, [])

    async function getDropDownValues() {
        await restClient.getAllDropDownValues()
            .then((response) => {
                console.log(response)
                let values = ["All"].concat(response.data.dropdown_metric)
                console.log(values);
                setMetricFilterDropDownValues(values);
                setNameFilterDropDownValues(response.data.dropdown_name);
                setAllRangesDropDowns(response.data.dropdown_name)
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async function getRangesDropDownValuesByMetric(metric) {
        if (metric.toLowerCase() === null || metric.toLowerCase() === "all" || metric.toLowerCase() === "") {
            setNameFilterDropDownValues(allRangesDropDowns);
        } else {
            await restClient.getRangesByMetric(metric)
                .then((response) => {
                    setNameFilterDropDownValues(response.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    const onFilterSubmit = (event) => {
        event.preventDefault();
        fetchRanges(1);
    }

    async function fetchRanges(pageVal) {
        setCircularProgress(true);
        setEnableSubmitButton(false)
        await restClient.submitData({ "search_metric": metricFilter, "search_name": nameFilter, "page": pageVal })
            .then((response) => {
                console.log(response);
                setSubmitresponse(response.data.get_data);
                setResultItemsCount(response.data.get_data.length);
                setCircularProgress(false);
                setEnableSubmitButton(true)
            })
            .catch((err) => {
                console.log(err);
                setCircularProgress(false);
                setEnableSubmitButton(true)
            });
    }
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - resultItemsCount) : 0;

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

        <Grid container>
            <PageInfoBreadCrumbs data={pageLoc} />
            <Grid container
                spacing={1}
                component="form"
                sx={{
                    '& .MuiTextField-root': { ml: 1, minWidth: '25ch' },
                }}
                noValidate
                autoComplete="off">
                <Grid item>
                    <Autocomplete
                        sx={{ width: 330 }}
                        options={metricFilterDropDownValues}
                        // getOptionLabel={(option) => option}
                        id="controlled-demo"
                        value={metricFilter}
                        onChange={(event, newValue) => {
                            console.log(newValue);
                            setMetricFilter(newValue);
                            getRangesDropDownValuesByMetric(newValue)
                        }}
                        // defaultValue={'All'}
                        renderInput={(params) => (
                            <TextField {...params} label="Metric" variant="standard" />
                        )}
                    />
                </Grid>
                <Grid item>
                    {/* <Autocomplete
                        sx={{ width: 330 }}
                        options={metricFilterDropDownValues}
                        id="disable-close-on-select"
                        disableCloseOnSelect
                        renderInput={(params) => (
                            <TextField {...params} label="disableCloseOnSelect" variant="standard" />
                        )}
                    /> */}
                    {/* <TextField
                        select
                        id="metricsFilter"
                        label="Metrics"
                        variant="standard"
                        onChange={setMetricFilterHandler}
                        value={metricFilter}
                    >
                        <MenuItem key='select-metric' value=''>
                            --- Select Metric ---
                        </MenuItem>
                        {metricFilterDropDownValues.map((option, index) => (
                            <MenuItem key={index} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField> */}
                    <TextField
                        select
                        id="nameFilter"
                        label="Name"
                        variant="standard"
                        onChange={setNameFilterHandler}
                        value={nameFilter}
                    >
                        <MenuItem key='All' value='All'>
                            All
                        </MenuItem>
                        {nameFilterDropDownValues.map((option, index) => (
                            <MenuItem key={index} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item sx={{ mt: 1.5 }}>
                    <Button disabled={!enableSubmitButton} id="dpRangesSubmit" type="submit" onClick={onFilterSubmit} variant="contained" size="medium"> Submit </Button>
                </Grid>
            </Grid>
            <Card sx={{ width: '100%', m: 1, position: 'relative' }}>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ textAlign: 'end', mt: 0.5 }}>
                        <Button variant='outlined' onClick={handleOnAddRowClick} startIcon={<AddCircleOutlineIcon />} sx={{ textTransform: 'none' }}>Add New Range</Button>
                    </Box>
                    <TableContainer>
                        <Table
                            sx={{ minWidth: '100%', mt: 1 }}
                            aria-labelledby="tableTitle"
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
                            {showCircularProgress && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Backdrop
                                    sx={{ color: '#fff', position: 'absolute', zIndex: (theme) => theme.zIndex.drawer - 1, opacity: 0.5 }}
                                    open={showCircularProgress}
                                >
                                    <CircularProgress />
                                </Backdrop>
                            </Box>}
                            <TableBody>
                                {stableSort(submitResponse, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        return (
                                            <StyledTableRow
                                                hover
                                                tabIndex={-1}
                                                key={index}
                                                sx={{ ml: 3 }}
                                            >
                                                <StyledTableCell padding='normal'>
                                                    {row.metric}
                                                </StyledTableCell>
                                                <StyledTableCell padding='normal'>
                                                    {row.name}
                                                </StyledTableCell>
                                                <StyledTableCell padding='normal'>
                                                    {row.source}
                                                </StyledTableCell>
                                                <StyledTableCell padding='normal'>
                                                    {row.operator}
                                                </StyledTableCell>
                                                <StyledTableCell padding='normal'>
                                                    {row.min}
                                                </StyledTableCell>
                                                <StyledTableCell padding='normal'>
                                                    {row.max}
                                                </StyledTableCell>
                                                <StyledTableCell padding='normal'>
                                                    {row.analysis}
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
                        count={resultItemsCount}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Box>
                {isDialogOpen && <RangesDialog
                    isDialogOpened={isDialogOpen}
                    handleCloseDialog={() => setIsDialogOpen(false)}
                    data={clickedRowData}
                    type={eventType} />
                }
            </Card>
        </Grid>
    );
}

export default DataProcessingRanges;