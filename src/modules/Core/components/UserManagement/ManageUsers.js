
import React, { useEffect, useState } from 'react'
import { TextField, MenuItem, Grid, Card, Box, Button, Backdrop, CircularProgress, TableSortLabel } from '@mui/material';
import ColorConstants from '../../constants/ColorConstants.json'

import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { styled } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import PageInfoBreadCrumbs from '../Layout/PageInfoBreadCrumbs';
import ManageUsersService from '../../services/UserManagementService';

const headCells = {
    data: [
        {
            id: 'id',
            label: 'UserID',
            isValueLink: false,
            sorting: true,
        },
        {
            id: 'first_name',
            label: 'First Name',
            isValueLink: false,
            sorting: true,
        },
        {
            id: 'last_name',
            label: 'Last Name',
            isValueLink: false,
            sorting: true,
        },
        {
            id: 'username',
            label: 'UserName',
            isValueLink: false,
            sorting: true,
        },
        {
            id: 'email',
            label: 'Email',
            isValueLink: false,
            sorting: true,
        },
        {
            id: 'is_active',
            label: 'Is Active',
            isValueLink: false,
            sorting: true,
        },
        {
            id: 'is_superuser',
            label: 'Is Admin',
            isValueLink: false,
            sorting: true,
        },
        {
            id: 'actions',
            label: 'Actions',
            isValueLink: false,
            sorting: false,
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


const CustomSelectField = (props) => {
    let row = props.row
    let validAction = false
    const usersService = new ManageUsersService();

    async function UpdateUser(id, body) {
        await usersService.UpdateUser(id, body)
            .then((response) => {
                alert("User Data Updated Successfully!")
            })
            .catch((err) => {
                console.log(err);
                alert("Faled to Updated User Data.")

            });
    }
    const [selectedDropDownValue, setSelectedDropDownValue] = useState("");
    const handleOnChangeEvent = (event) => {
        let selectedVal = event.target.value
        setSelectedDropDownValue(selectedVal)
        if (selectedVal === "Active") {
            validAction = true
            console.log("Active")
            console.log(row)
            row.is_active = true
        }
        else if (selectedVal === "InActive") {
            validAction = true
            console.log("InActive")
            console.log(row)
            row.is_active = false
        }
        else if (selectedVal === "Admin") {
            validAction = true
            console.log("Admin")
            console.log(row)
            row.is_superuser = true
        }
        else if (selectedVal === "User") {
            validAction = true
            console.log("User")
            console.log(row)
            row.is_superuser = false
        }
        if (validAction) {
            UpdateUser(row.id, row);
        }
    }
    return (
        <TextField
            select
            label="Action"
            // value={JSON.stringify(row)}
            // select
            id={`${row.id}`}
            variant="standard"
            onChange={handleOnChangeEvent}
            value={selectedDropDownValue}
            margin='none'
            SelectProps={{ margin: 'none' }}
            sx={{ minWidth: '80px' }}
        >
            <MenuItem value="Active">
                Active
            </MenuItem>
            <MenuItem value="InActive">
                InActive
            </MenuItem>
            <MenuItem value="Admin">
                Admin
            </MenuItem>
            <MenuItem value="User">
                User
            </MenuItem>
        </TextField>
    );
}

const ManageUsers = () => {
    let pageLoc = window.location.pathname;
    const usersService = new ManageUsersService();
    // const [usersFilter, setUsersFilter] = useState("");
    const [usersRespData, setUsersRespData] = useState([]);

    const [showDataInProgress, setShowDataInProgress] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    // const setUsersFilterHandler = (event) => {
    //     setUsersFilter(event.target.value);
    // }

    useEffect(() => {
        getUsers();
    }, [])

    async function getUsers() {
        setShowDataInProgress(true);
        await usersService.getAllUsers()
            .then((response) => {
                console.log(response)
                setUsersRespData(response.data);
                // setResultItemsCount(response.data.page_data * rowsPerPage);
                setShowDataInProgress(false);
            })
            .catch((err) => {
                setShowDataInProgress(false);
                console.log(err);
            });
    }

    // const onSubmitHandler = (event) => {
    //     event.preventDefault();
    //     getUsers();
    // }
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - usersRespData.length) : 0;

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('id');

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
                {/* <Grid container
                    noValidate
                    autoComplete="off">
                    <Grid item sx={{ marginTop: 0.75 }}>
                        <TextField
                            id="usersFilter"
                            label="Filter"
                            variant="standard"
                            onChange={setUsersFilterHandler}
                            value={usersFilter}
                        />
                    </Grid>
                    <Grid item sx={{ mt: 2, ml: 1 }}>
                        <Button id="usersFilterButton" type="submit" onClick={onSubmitHandler} variant="contained" size="medium"> Filter </Button>
                    </Grid>
                </Grid> */}
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
                                    {stableSort(usersRespData, getComparator(order, orderBy))
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
                                                        {row.id}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {row.first_name}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {row.last_name}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {row.username}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {row.email}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {row.is_active ? "True" : "False"}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {row.is_superuser ? "True" : "False"}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <CustomSelectField row={row} />
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
                            count={usersRespData.length}
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
export default ManageUsers;
