
import React, { useEffect, useState } from 'react'
import ScreenModelService from '../services/ScreenModelService';
import ColorConstants from '../../Core/constants/ColorConstants.json';
import Constants from '../../../Constants.json';
import { TextField, MenuItem, Grid, Card, Box, Button, Backdrop, CircularProgress, TableSortLabel, Link } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { styled } from '@mui/material/styles';
import PageInfoBreadCrumbs from '../../Core/components/Layout/PageInfoBreadCrumbs';
import InvestingStyleService from '../services/InvestingStylesService';

const headCells = {
    data: [
        {
            id: 'style',
            label: 'Style',
            isValueLink: false,
        },
        {
            id: 'mentor',
            label: 'Mentor',
            isValueLink: false,
        },
        {
            id: 'philosophy',
            label: 'Philosophy',
            isValueLink: false,
        },
        {
            id: 'strategy_name',
            label: 'Strategy Name',
            isValueLink: true,
        },
        {
            id: 'periodRange',
            label: 'Period',
            isValueLink: false,
        },
        {
            id: 'fundReturn',
            label: 'Return/yr',
            isValueLink: false,
        },
        {
            id: 'marketReturn',
            label: 'S&P Return/yr',
            isValueLink: false,
        },
        {
            id: 'riskTolerance',
            label: 'Risk tolerance',
            isValueLink: false,
        },
        {
            id: 'source',
            label: 'Source',
            isValueLink: false,
        },
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

const InvestingStyle = () => {
    let pageLoc = window.location.pathname;
    const restClient = new ScreenModelService();
    const restClientinvestingStyle = new InvestingStyleService();
    const [stylesDropDownValues, setStylesDropDownValues] = useState([]);
    const [mentorDropDownValues, setMentorDropDownValues] = useState([]);
    const [stylesFilter, setStylesFilter] = useState("All");
    const [mentorFilter, setMentorFilter] = useState("All");
    const [investingStyleRespData, setInvestingStyleRespData] = useState([]);
    const [resultItemsCount, setResultItemsCount] = useState(0);

    const [showDataInProgress, setShowDataInProgress] = useState(false);
    const [enableFilterButton, setEnableFilterButton] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        // setRowsPerPage(parseInt(event.target.value, 15));
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        getStylesDropDown();
    }, []);

    const setStylesFilterHandler = (event) => {
        setStylesFilter(event.target.value);
        getMentorDropDownByStyle(event.target.value);
    }

    const setMentorFilterHandler = (event) => {
        setMentorFilter(event.target.value);
    }

    async function getStylesDropDown() {
        await restClient.getStyles()
            .then((response) => {
                console.log(response)
                setStylesDropDownValues(response.data.styleFilter);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async function getMentorDropDownByStyle(style) {
        const body = { "style": style }
        await restClient.getMentorByStyle(body)
            .then((response) => {
                console.log(response)
                setMentorDropDownValues(response.data.mentorFilter);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    async function getInvestingStyles() {
        setShowDataInProgress(true);
        setEnableFilterButton(false);
        const body = { "page": page + 1, "style": stylesFilter, "mentor": mentorFilter }
        await restClientinvestingStyle.getInvestingStyles(body)
            .then((response) => {
                console.log(response)
                setInvestingStyleRespData(response.data.investing_style_data);
                setResultItemsCount(response.data.investing_style_data.length);
                setShowDataInProgress(false);
                setEnableFilterButton(true);
            })
            .catch((err) => {
                setShowDataInProgress(false);
                setEnableFilterButton(true);
                console.log(err);
            });
    }

    const handlePageRedirect = (row) => {
        let style = row.style ? encodeURIComponent(row.style) : "";
        let mentor = row.mentor ? "&mentor=" + encodeURIComponent(row.mentor) : "";
        let model = row.strategy_name ? "&model=" + encodeURIComponent(row.strategy_name) : "";
        window.open(Constants.APP_BASE_URL + "/context/screenmodel?style=" + style + mentor +model, '_blank', 'noopener,noreferrer')
    };

    const onSubmitHandler = (event) => {
        event.preventDefault();
        getInvestingStyles();
    }
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - resultItemsCount) : 0;


    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('style');

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
                        '& .MuiTextField-root': { ml: 1, minWidth: '20ch' },
                    }}
                    noValidate
                    autoComplete="off">
                    <Grid item sx={{ marginTop: 0.75 }}>
                        <TextField
                            select
                            id="styleFilter"
                            label="Style"
                            variant="standard"
                            onChange={setStylesFilterHandler}
                            value={stylesFilter}
                        >
                            <MenuItem key='all' value='All'>
                                All
                            </MenuItem>
                            {stylesDropDownValues.map((option, index) => (
                                <MenuItem key={index} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            id="mentorFilter"
                            label="Mentor"
                            variant="standard"
                            onChange={setMentorFilterHandler}
                            value={mentorFilter}
                        >
                            <MenuItem key='all' value='All'>
                                All
                            </MenuItem>
                            {mentorDropDownValues.map((option, index) => (
                                <MenuItem key={index} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item sx={{ mt: 2, ml: 1 }}>
                        <Button disabled={!enableFilterButton} id="investingStyleButton" type="submit" onClick={onSubmitHandler} variant="contained" size="medium"> Filter </Button>
                    </Grid>
                </Grid>
                <Card sx={{ width: '100%', m: 1, position: 'relative' }}>
                    <Box sx={{ width: '100%' }}>
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
                                                <TableSortLabel
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
                                                </TableSortLabel>
                                            </StyledTableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        stableSort(investingStyleRespData, getComparator(order, orderBy))
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
                                                            {row.style}
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            {row.mentor}
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            {row.philosophy}
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            <Link onClick={() => handlePageRedirect(row)}>
                                                                {row.strategy_name}
                                                            </Link>
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            {row.periodRange}
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            {row.fundReturn}
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            {row.marketReturn}
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            {row.riskTolerance}
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            {row.source}
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
                </Card>
            </React.Fragment>
        </Grid >
    )
}
export default InvestingStyle;
