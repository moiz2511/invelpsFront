import { TextField, MenuItem, Grid, Card, Box, Button, Backdrop, CircularProgress, Tooltip, Chip, Checkbox, TableSortLabel } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import ScreenModelService from '../services/ScreenModelService';
import Constants from '../../../Constants.json'
import AnalysisModelService from '../services/AnalysisModelService';
import ColorConstants from '../../Core/constants/ColorConstants.json'

import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import Popper from '@mui/material/Popper';
import { useTheme, styled } from '@mui/material/styles';
import { VariableSizeList } from 'react-window';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { visuallyHidden } from '@mui/utils';

import './AnalysisModel.css'
import DataVisualization from '../../DataVisualization/components/DataVisualization';
import PageInfoBreadCrumbs from '../../Core/components/Layout/PageInfoBreadCrumbs';
import AnalysisModelGetResults from './AnalysisModelGetResults';

const headCells = {
    data: [
        {
            id: 'question',
            label: 'Questions',
            isValueLink: false,
        },
        {
            id: 'tool',
            label: 'Tools',
            isValueLink: false,
        },
        {
            id: 'measure',
            label: 'Measure',
            isValueLink: false,
        },
        {
            id: 'category',
            label: 'Category',
            isValueLink: false,
        },
        {
            id: 'metric',
            label: 'Metrics',
            isValueLink: false,
        },
        {
            id: 'model_from',
            label: 'From',
            isValueLink: false,
        },
        {
            id: 'model_to',
            label: 'To',
            isValueLink: false,
        },
        {
            id: 'range',
            label: 'Range',
            isValueLink: false,
        },
        {
            id: 'display',
            label: 'Display',
            isValueLink: true,
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

const LISTBOX_PADDING = 8; // px

function renderRow(props) {
    const { data, index, style } = props;
    const dataSet = data[index];
    const inlineStyle = {
        ...style,
        top: style.top + LISTBOX_PADDING,
        fontSize: 12,
        width: '100%'
    };

    return (
        <Typography component="li" {...dataSet[0]} style={inlineStyle}>
            {dataSet[1].company_name}
        </Typography>
    );
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef((props, ref) => {
    const outerProps = React.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data) {
    const ref = React.useRef(null);
    useEffect(() => {
        if (ref.current != null) {
            ref.current.resetAfterIndex(0, true);
        }
    }, [data]);
    return ref;
}

// Adapter for react-window
const ListboxComponent = React.forwardRef(function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    const itemData = [];
    children.forEach((item) => {
        itemData.push(item);
        itemData.push(...(item.children || []));
    });

    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up('sm'), {
        noSsr: true,
    });

    const itemCount = itemData.length;
    const itemSize = smUp ? 36 : 48;

    const getChildSize = () => {
        return itemSize;
    };
    const getHeight = () => {
        if (itemCount > 8) {
            return 8 * itemSize;
        }
        return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
    };

    const gridRef = useResetCache(itemCount);

    return (
        <div ref={ref}>
            <OuterElementContext.Provider value={other}>
                <VariableSizeList
                    itemData={itemData}
                    height={getHeight() + 2 * LISTBOX_PADDING}
                    width="100%"
                    ref={gridRef}
                    outerElementType={OuterElementType}
                    innerElementType="ul"
                    itemSize={(index) => getChildSize(itemData[index])}
                    overscanCount={5}
                    itemCount={itemCount}
                >
                    {renderRow}
                </VariableSizeList>
            </OuterElementContext.Provider>
        </div>
    );
});

ListboxComponent.propTypes = {
    children: PropTypes.array,
};

const StyledPopper = styled(Popper)({
    [`& .${autocompleteClasses.listbox}`]: {
        boxSizing: 'border-box',
        '& ul': {
            padding: 0,
            margin: 0,
        },
    },
});


const AnalysisModel = () => {
    let pageLoc = window.location.pathname;
    const [searchParams] = useSearchParams();
    let company = searchParams.get("company", "") ? searchParams.get("company") : "";
    let styleValue = searchParams.get("style") ? searchParams.get("style") : "All";
    let mentorValue = searchParams.get("mentor") ? searchParams.get("mentor") : "All";
    let analysisModelValue = searchParams.get("screenModel") ? searchParams.get("screenModel") : "All";
    let exchange = searchParams.get("exchange") ? searchParams.get("exchange") : "";
    const restClient = new ScreenModelService();
    const restClientAnalysisModel = new AnalysisModelService();
    const [stylesDropDownValues, setStylesDropDownValues] = useState([]);
    const [mentorDropDownValues, setMentorDropDownValues] = useState([]);
    const [analysisModelDropDownValues, setAnalysisDropDownValues] = useState([]);
    const [measureDropDownValues, setMeasureDropDownValues] = useState([]);
    const [categoryDropDownValues, setCategoryDropDownValues] = useState([]);
    const [metricDropDownValues, setMetricDropDownValues] = useState([]);
    const [stylesFilter, setStylesFilter] = useState(styleValue);
    const [mentorFilter, setMentorFilter] = useState(mentorValue);
    const [analysisModelFilter, setAnalysisModelFilter] = useState(analysisModelValue);
    const [measureFilter, setMeasureFilter] = useState("All");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [metricFilter, setMetricFilter] = useState("All");
    const [companyFilter, setCompanyFilter] = useState({ company_name: company });
    const [analysisModelRespData, SetAnalysisModelRespData] = useState([]);
    const [companiesDropDownValues, setCompaniesDropDownValues] = useState([{ company_name: company }]);
    const [exchangeFilter, setExchangeFilter] = useState(exchange);
    const [exchangeDropDownValues, setExchangeDropDownValues] = useState([]);
    const [showExchangeProp, setShowExchangeProp] = useState(false);

    const [resultItemsCount, setResultItemsCount] = useState(0);
    const [displayAnalysisModel, setDisplayAnalysisModel] = useState(true);
    const [dataVisuaizationContent, setDataVisualizationContent] = useState([]);

    const [getResultsCheckedItems, setGetResultsCheckedItems] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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

    useEffect(() => {
        getStylesDropDown();
        getCompaniesDropDown();

        if (styleValue != null && styleValue !== "" && styleValue.toLowerCase() !== "all") {
            getMentorDropDownByStyle(styleValue);
        }
        if (mentorValue != null && mentorValue !== "" && mentorValue.toLowerCase() !== "all") {
            getAnalysisModelDropDownByMentor(mentorValue);
        }
        if (company != null && company !== "") {
            getExchangesByCompanyName(company);
        }
    }, []);

    const setStylesFilterHandler = (event) => {
        setStylesFilter(event.target.value);
        getMentorDropDownByStyle(event.target.value);
    }

    const setMentorFilterHandler = (event) => {
        setMentorFilter(event.target.value);
        getAnalysisModelDropDownByMentor(event.target.value);
    }

    const setMeasureFilterHandler = (event) => {
        setMeasureFilter(event.target.value);
        getCategoryDropDownByAnalysisModel(analysisModelFilter, event.target.value);
    }

    const setAnalysisModelFilterHandler = (event) => {
        setAnalysisModelFilter(event.target.value);
        // getAnalysisModelsData("All", event.target.value, "All", "All");
        getMeasureDropDownByAnalysisModel(event.target.value);
    }

    const setCategoryFilterHandler = (event) => {
        setCategoryFilter(event.target.value);
        getMetricDropDownByAnalysisModel(analysisModelFilter, measureFilter, event.target.value);
    }

    const setMetricFilterHandler = (event) => {
        setMetricFilter(event.target.value);
        // getAnalysisModelsData(categoryFilter, analysisModelFilter, measureFilter, event.target.value);
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
        // getAnalysisModelsData("All", "All", "All", "All");
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

    async function getAnalysisModelDropDownByMentor(mentor) {
        const body = { "mentor": mentor }
        await restClient.getScreenModelByModel(body)
            .then((response) => {
                console.log(response)
                setAnalysisDropDownValues(response.data.strategyNameFilter);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async function getMeasureDropDownByAnalysisModel(analysisModel) {
        const body = { "analysisModel": analysisModel }
        await restClientAnalysisModel.getMeasuresByAnalysisModel(body)
            .then((response) => {
                console.log(response)
                setMeasureDropDownValues(response.data.measureFilter);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async function getCategoryDropDownByAnalysisModel(analysisModel, measure) {
        const body = { "analysisModel": analysisModel, "measureFilter": measure }
        await restClientAnalysisModel.getCategoryByAnalysisModel(body)
            .then((response) => {
                console.log(response)
                setCategoryDropDownValues(response.data.categoryFilter);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async function getMetricDropDownByAnalysisModel(analysisModel, measure, category) {
        const body = { "analysisModel": analysisModel, "measureFilter": measure, "categoryFilter": category }
        await restClientAnalysisModel.getMetricsDropDown(body)
            .then((response) => {
                console.log(response)
                setMetricDropDownValues(response.data.metricFilter);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async function getCompaniesDropDown() {
        await restClientAnalysisModel.getAllCompanies()
            .then((response) => {
                // console.log(response)
                // let companies = response.data.companies_data.map((item) => { return { "value": item.company_name, "label": item.company_name } })
                // console.log(companies);
                setCompaniesDropDownValues(response.data.companies_data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async function getAnalysisModelsData(category, analysisModel, measure, metric) {
        setShowDataInProgress(true);
        const body = { "page": page + 1, "category": category, "analysisModel": analysisModel, "measure": measure, "metric": metric }
        await restClientAnalysisModel.getAnalysisModels(body)
            .then((response) => {
                console.log(response)
                SetAnalysisModelRespData(response.data.context_ananlysis_models_data);
                // setResultItemsCount(response.data.page_data * rowsPerPage);
                setResultItemsCount(response.data.context_ananlysis_models_data.length);
                setShowDataInProgress(false);
            })
            .catch((err) => {
                setShowDataInProgress(false);
                console.log(err);
            });
    }

    async function getExchangesByCompanyName(company) {
        await restClientAnalysisModel.getExchangesByCompany({ companyName: company })
            .then((response) => {
                setExchangeDropDownValues(response.data.resp_data);
                setShowExchangeProp(response.data.resp_data.length > 1);
                if (response.data.resp_data.length > 1) {
                    setShowExchangeProp(true);
                } else {
                    setShowExchangeProp(false);
                    setExchangeFilter(response.data.resp_data[0].exchange);

                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const OnColumnLinkClick = (event) => {
        const data = JSON.parse(event.target.value)
        let tool = data.tool ? "&tool=" + encodeURIComponent(data.tool) : "";
        let measure = data.measure ? "&measure=" + encodeURIComponent(data.measure) : "";
        let category = data.category ? "&category=" + encodeURIComponent(data.category) : "";
        let metrics = data.metric ? "&metrics=" + encodeURIComponent(data.metric) : "";
        let from = data.model_from ? "&from=" + encodeURIComponent(getTextToYearNotation(data.model_from)) : "";
        let to = data.model_to ? "&to=" + encodeURIComponent(getTextToYearNotation(data.model_to)) : "";
        let range = data.range ? "&range=" + encodeURIComponent(data.range) : "";
        window.open(Constants.APP_BASE_URL + "/context/chartanalysis?company=" +
            encodeURIComponent(companyFilter.company_name) + tool + measure + category + metrics + from + to + range, '_blank', 'noopener,noreferrer')
    }

    const getTextToYearNotation = (input) => {
        if (input.toLowerCase().trim().startsWith("current y")) {
            let res = parseInt(input.toLowerCase().replace("current y", "").replace("-", "").trim())
            const d = new Date();
            return d.getFullYear() - res;
        }
    }

    const onSubmitHandler = () => {
        setGetResultsCheckedItems([]);
        SetAnalysisModelRespData([]);
        getAnalysisModelsData(categoryFilter, analysisModelFilter, measureFilter, metricFilter);
    }

    const handleOnCheckboxClick = (row) => {
        console.log(row);
        setGetResultsCheckedItems(prevState =>
            row.checked ? [...prevState, row] : prevState.filter(obj => { return obj.id !== row.id; })
        )
    }

    const handleOnClickOfGetResults = () => {
        console.log(getResultsCheckedItems);
        setIsDialogOpen(true);
    }

    const getPageContentDetails = (event) => {
        event.preventDefault();
        setDisplayAnalysisModel(false);
        let start = page * rowsPerPage;
        let end = (page + 1) * rowsPerPage;
        console.log(start, end)
        console.log(analysisModelRespData.slice(start, end));
        setDataVisualizationContent(analysisModelRespData.slice(start, end));
    }

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - resultItemsCount) : 0;

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('question');

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
            {displayAnalysisModel &&
                <Grid container>
                    <PageInfoBreadCrumbs data={pageLoc} />
                    <React.Fragment>
                        <Grid container
                            spacing={1}
                            component="form"
                            sx={{
                                '& .MuiTextField-root': { minWidth: '20ch' },
                                ml: 1
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
                            </Grid>
                            <Grid item sx={{ marginTop: 0.75 }}>
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
                            <Grid item sx={{ marginTop: 0.75 }}>
                                <TextField
                                    select
                                    id="analysisModel"
                                    label="Analysis Model"
                                    variant="standard"
                                    value={analysisModelFilter}
                                    onChange={setAnalysisModelFilterHandler}
                                >
                                    <MenuItem key='all' value='All'>
                                        All
                                    </MenuItem>
                                    {analysisModelDropDownValues.map((option, index) => (
                                        <MenuItem key={index} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item sx={{ marginTop: 0.75 }}>
                                <TextField
                                    select
                                    id="measureFilter"
                                    label="Measure"
                                    variant="standard"
                                    value={measureFilter}
                                    onChange={setMeasureFilterHandler}
                                >
                                    <MenuItem key='all' value='All'>
                                        All
                                    </MenuItem>
                                    {measureDropDownValues.map((option, index) => (
                                        <MenuItem key={index} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item sx={{ marginTop: 0.75 }}>
                                <TextField
                                    select
                                    id="categoryFilter"
                                    label="Category"
                                    variant="standard"
                                    value={categoryFilter}
                                    onChange={setCategoryFilterHandler}
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
                            <Grid item sx={{ marginTop: 0.75 }}>
                                <TextField
                                    select
                                    id="metricFilter"
                                    label="Metric"
                                    variant="standard"
                                    value={metricFilter}
                                    onChange={setMetricFilterHandler}
                                >
                                    <MenuItem key='all' value='All'>
                                        All
                                    </MenuItem>
                                    {metricDropDownValues.map((option, index) => (
                                        <MenuItem key={index} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            {/* <Grid item sx={{ marginLeft: 1 }}>
                                <div style={{ width: '240px', fontSize: '12px', fontWeight: 'bold' }}>
                                    <label style={{ fontSize: '11px', fontWeight: 'normal' }} htmlFor='companiesFilter'>Company</label>
                                    <Select
                                        closeMenuOnSelect={true}
                                        placeholder='Select Company'
                                        id="companiesFilter"
                                        components={{ MenuList }}
                                        options={companiesDropDownValues}
                                        value={companyFilter}
                                        onChange={setCompanyFilter}
                                    />
                                </div>
                            </Grid> */}
                            <Grid item sx={{ marginTop: 1.1 }}>
                                <Autocomplete
                                    size="small"
                                    disablePortal
                                    id="companiesFilter"
                                    sx={{ width: 240 }}
                                    disableListWrap
                                    getOptionLabel={(option) => option.company_name}
                                    isOptionEqualToValue={(option, value) => option.company_name === value.company_name}
                                    PopperComponent={StyledPopper}
                                    ListboxComponent={ListboxComponent}
                                    options={companiesDropDownValues}
                                    onChange={(event, newValue) => {
                                        setCompanyFilter(newValue);
                                        getExchangesByCompanyName(newValue.company_name);
                                    }}
                                    value={companyFilter}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Tooltip key={index} title={option.company_name}>
                                                <Chip size='small' sx={{ width: "65%" }} variant="contained" label={option.company_name} {...getTagProps({ index })} />
                                            </Tooltip>
                                        ))
                                    }
                                    renderInput={(params) => <TextField
                                        {...params} label="Company" variant='standard' />}
                                    renderOption={(props, option) => [props, option]}
                                />
                            </Grid>
                            <Grid item sx={{ marginTop: 0.75 }}>
                                {showExchangeProp && <TextField
                                    select
                                    id="exchangeFilter"
                                    label="Exchange"
                                    variant="standard"
                                    value={exchangeFilter}
                                    onChange={(event) => { setExchangeFilter(event.target.value) }}
                                >
                                    {exchangeDropDownValues.map((option, index) => (
                                        <MenuItem key={index} value={option.exchange}>
                                            {option.exchange}
                                        </MenuItem>
                                    ))}
                                </TextField>}
                            </Grid>
                            <Grid item sx={{ mt: 2, ml: 1 }}>
                                <Button disabled={showDataInProgress} id="analysisModelFilterButton" type="submit" onClick={onSubmitHandler} variant="contained" size="medium"> Filter </Button>
                            </Grid>
                        </Grid>
                        <Card sx={{ width: '100%', m: 1, position: 'relative' }}>
                            <Grid container sx={{ justifyContent: 'end' }}>
                                {/* <Grid item>
                                    <Box sx={{ mr: 1 }}>
                                        <Button variant='outlined' onClick={getPageContentDetails} sx={{ mt: 0.5, textTransform: 'none' }} >Get Analysis for this page</Button>
                                    </Box>
                                </Grid> */}
                                <Grid item>
                                    <Box sx={{ mr: 1 }}>
                                        <Button variant='outlined' disabled={getResultsCheckedItems.length < 1} onClick={handleOnClickOfGetResults} sx={{ mt: 0.5, textTransform: 'none' }} >Get Results</Button>
                                    </Box>
                                </Grid>
                            </Grid>
                            {/* <CustomizedTable headCells={headCells} tableRows={analysisModelRespData} company={companyFilter} /> */}
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
                                                <StyledTableCell
                                                    key='checkbox'
                                                    padding='normal'
                                                >
                                                    Yes
                                                </StyledTableCell>
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
                                                                {row.question}
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
                                                            <StyledTableCell>
                                                                {row.metric}
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                {row.model_from}
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                {row.model_to}
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                {row.range}
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                <Button
                                                                    size='small'
                                                                    onClick={OnColumnLinkClick}
                                                                    value={JSON.stringify(row)}
                                                                    sx={{ textTransform: 'none' }}
                                                                >
                                                                    {'AnalysisChart'}
                                                                </Button>
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                <Checkbox checked={row.hasOwnProperty('checked') ? row.checked : false} onChange={(event) => { row['checked'] = event.target.checked; handleOnCheckboxClick(row) }} />
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
                            {isDialogOpen && <AnalysisModelGetResults
                                isDialogOpened={isDialogOpen}
                                handleCloseDialog={() => setIsDialogOpen(false)}
                                selectedData={getResultsCheckedItems}
                                fetchedData={analysisModelRespData}
                                company={companyFilter.company_name}
                                analysisModel={analysisModelFilter} />
                            }
                        </Card>
                    </React.Fragment>
                </Grid>
            }
            {!displayAnalysisModel && <DataVisualization content={dataVisuaizationContent} company={companyFilter.company_name} />}

        </React.Fragment>
    )
}
export default AnalysisModel;
