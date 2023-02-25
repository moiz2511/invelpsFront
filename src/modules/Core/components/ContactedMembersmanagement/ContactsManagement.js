
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
            id: 'name',
            label: 'Name',
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
            id: 'isActive',
            label: 'IsActive',
            isValueLink: false,
            sorting: true,
        },
        {
            id: 'subject',
            label: 'Subject',
            isValueLink: false,
            sorting: true,
        },
        {
            id: 'message',
            label: 'Message',
            isValueLink: false,
            sorting: true,
        },
        {
            id: 'timestamp',
            label: 'Date Contacted',
            isValueLink: false,
            sorting: true,
        },
        {
            id: 'responded',
            label: 'Responded',
            isValueLink: false,
            sorting: true,
        },
        {
            id: 'Actions',
            label: 'actions',
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


const CustomSelectField = (props) => {
    let row = props.row
    let validAction = false
    const usersService = new ManageUsersService();

    async function UpdateContact(body) {
        await usersService.UpdateContactStatus(body)
            .then((response) => {
                alert("Contact Status Data Updated Successfully!")
            })
            .catch((err) => {
                console.log(err);
                alert("Faled to Updated Contact Status.")

            });
    }
    const [selectedDropDownValue, setSelectedDropDownValue] = useState("");
    const handleOnChangeEvent = (event) => {
        let selectedVal = event.target.value
        setSelectedDropDownValue(selectedVal)
        if (selectedVal === "Responded") {
            validAction = true
            console.log("Responded")
            console.log(row)
            row.responded = true
        }
        else if (selectedVal === "Pending") {
            validAction = true
            console.log("Pending")
            console.log(row)
            row.responded = false
        }
        if (validAction) {
            UpdateContact(row);
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
            <MenuItem value="Responded">
                Responded
            </MenuItem>
            <MenuItem value="Pending">
                Pending
            </MenuItem>
        </TextField>
    );
}

const ContactsManagement = () => {
    let pageLoc = window.location.pathname;
    const service = new ManageUsersService();
    // const [contactsFilter, setContactsFilter] = useState("");
    const [contactsRespData, setContactsRespData] = useState([]);

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

    // const setContactsFilterHandler = (event) => {
    //     setContactsFilter(event.target.value);
    // }

    useEffect(() => {
        getContacts();
    }, [])

    async function getContacts() {
        setShowDataInProgress(true);
        await service.getAllContacts()
            .then((response) => {
                console.log(response)
                setContactsRespData(response.data.response);
                setShowDataInProgress(false);
            })
            .catch((err) => {
                setShowDataInProgress(false);
                console.log(err);
            });
    }

    // const onSubmitHandler = (event) => {
    //     event.preventDefault();
    //     getContacts();
    // }
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - contactsRespData.length) : 0;

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('timestamp');

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
                            id="contactsFilter"
                            label="Filter"
                            variant="standard"
                            onChange={setContactsFilterHandler}
                            value={contactsFilter}
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
                                    {stableSort(contactsRespData, getComparator(order, orderBy))
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
                                                        {row.name}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {row.email}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {row.isActive ? "True" : "False"}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {row.subject}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {row.message}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {row.timestamp}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {row.responded ? "True" : "False"}
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
                            count={contactsRespData.length}
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
export default ContactsManagement;
