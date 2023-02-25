import { TextField, MenuItem, Grid, Card, Box, Button, Backdrop, CircularProgress, ButtonGroup, Tooltip, TableSortLabel } from '@mui/material';
import React, { useEffect, useState } from 'react'
import ColorConstants from '../../Core/constants/ColorConstants.json'

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import IconButton from '@mui/material/IconButton';

import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { styled } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';

import PageInfoBreadCrumbs from '../../Core/components/Layout/PageInfoBreadCrumbs';
import DpAnalysisModelService from '../services/DpAnalysisModelService';
import AnalysisModelDialog from './AnalysisModelDailog';

const headCells = {
    data: [
        {
            id: 'model',
            label: 'Model',
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
            id: 'question',
            label: 'Question',
            isValueLink: false,
            sorting: true
        },
        {
            id: 'metric',
            label: 'Metric',
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
            id: 'range',
            label: 'Range',
            isValueLink: false,
            sorting: true
        },
        {
            id: 'model_from',
            label: 'From',
            isValueLink: false,
            sorting: true
        },
        {
            id: 'model_to',
            label: 'To',
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

const DpAnalysisModel = () => {
    let pageLoc = window.location.pathname;
    const restClientAnalysisModel = new DpAnalysisModelService();
    const [modelDropDownValues, setModelDropDownValues] = useState([]);
    const [modelFilter, setModelFilter] = useState("All");
    const [categoryDropDownValues, setCategoryDropDownValues] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [analysisModelRespData, setanalysisModelRespData] = useState([]);
    const [resultItemsCount, setResultItemsCount] = useState(0);

    const [showDataInProgress, setShowDataInProgress] = useState(false);
    const [enableFilterButton, setEnableFilterButton] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [eventType, setEventType] = useState("add");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [clickedRowData, setclickedRowData] = useState("");

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        getModelsDropDown();
        getAnalysisModelsData(modelFilter, categoryFilter);
    }, []);

    const setModelFilterHandler = (event) => {
        setModelFilter(event.target.value);
        // getCategoryDropDown(event.target.value);
    }

    const setCategoryFilterHandler = (event) => {
        setCategoryFilter(event.target.value);
    }

    async function getModelsDropDown() {
        await restClientAnalysisModel.getDropDownOptions()
            .then((response) => {
                console.log(response)
                setModelDropDownValues(response.data.dropdown_model);
                setCategoryDropDownValues(response.data.dropdown_category);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // async function getCategoryDropDown(model) {
    //     await restClientScreenModel.getCategoryOptions()
    //         .then((response) => {
    //             console.log(response)
    //             setCategoryDropDownValues(response.data);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // }

    async function getAnalysisModelsData(model, category) {
        setShowDataInProgress(true);
        setEnableFilterButton(false);
        const body = { "page": page + 1, model, category }
        await restClientAnalysisModel.getAnalysisModelsData(body)
            .then((response) => {
                console.log(response)
                setanalysisModelRespData(response.data.get_data);
                setResultItemsCount(response.data.get_data.length);
                setShowDataInProgress(false);
                setEnableFilterButton(true);
            })
            .catch((err) => {
                setShowDataInProgress(false);
                setEnableFilterButton(true);
                console.log(err);
            });
    }

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

    const onFilterHandler = (event) => {
        event.preventDefault();
        getAnalysisModelsData(modelFilter, categoryFilter);
    }

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - resultItemsCount) : 0;


    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('model');

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
            <React.Fragment>
                <Grid container
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { ml: 1, minWidth: '25ch' },
                    }}
                    noValidate
                    spacing={1}
                    autoComplete="off">
                    <Grid item sx={{ marginTop: 0.75 }}>
                        <TextField
                            select
                            id="screenModelFilter"
                            label="Strategy"
                            variant="standard"
                            onChange={setModelFilterHandler}
                            value={modelFilter}
                        >
                            <MenuItem key='all' value='All'>
                                All
                            </MenuItem>
                            {modelDropDownValues.map((option, index) => (
                                <MenuItem key={index} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid><Grid item sx={{ marginTop: 0.75 }}>
                        <TextField
                            select
                            id="categoryFilter"
                            label="Category"
                            variant="standard"
                            onChange={setCategoryFilterHandler}
                            value={categoryFilter}
                        >
                            <MenuItem key='all' value='All'>
                                All
                            </MenuItem>
                            {categoryDropDownValues.map((option, index) => (
                                <MenuItem key={index} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item sx={{ mt: 2 }}>
                        <Button disabled={!enableFilterButton} id="analysisModelSubmit" type="submit" onClick={onFilterHandler} variant="contained" size="medium"> Filter </Button>
                    </Grid>
                </Grid>
                <Card sx={{ width: '100%', m: 1, position: 'relative' }}>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ textAlign: 'end', mt: 0.5 }}>
                            <Button variant='outlined' onClick={handleOnAddRowClick} startIcon={<AddCircleOutlineIcon />} sx={{ textTransform: 'none' }} >Add New AnalysisModel</Button>
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
                                                sortDirection={orderBy === headCell.id ? order : false}
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
                                    {stableSort(analysisModelRespData, getComparator(order, orderBy))
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
                                                        {row.model}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {row.measure}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {row.category}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {row.question}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {row.metric}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {row.tool}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {row.range}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {row.model_from}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {row.model_to}
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
                    {showDataInProgress && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Backdrop
                            sx={{ color: '#fff', position: 'absolute', zIndex: (theme) => theme.zIndex.drawer - 1, opacity: 0.5 }}
                            open={showDataInProgress}
                        >
                            <CircularProgress />
                        </Backdrop>
                    </Box>}

                    {isDialogOpen && <AnalysisModelDialog
                        isDialogOpened={isDialogOpen}
                        handleCloseDialog={() => setIsDialogOpen(false)}
                        data={clickedRowData}
                        type={eventType} />
                    }
                </Card>
            </React.Fragment>
        </Grid >
    )
}
export default DpAnalysisModel;
