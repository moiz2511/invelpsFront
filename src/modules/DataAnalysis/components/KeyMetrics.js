import React, { useEffect, useState } from 'react'

import { Backdrop, Box, Button, Card, Checkbox, Chip, CircularProgress, FormControl, Grid, InputLabel, ListItemIcon, ListItemText, MenuItem, Select, Tooltip } from '@mui/material';

import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import useMediaQuery from '@mui/material/useMediaQuery';
import Popper from '@mui/material/Popper';
import { useTheme, styled } from '@mui/material/styles';
import { VariableSizeList } from 'react-window';
import Typography from '@mui/material/Typography';
import CompaniesService from '../services/CompaniesService';
import CustomizedTable from '../../UIUtils/Table/TableContentComponent';
import DAKeyMetricsService from '../services/KeyMetricsService';
import PageInfoBreadCrumbs from '../../Core/components/Layout/PageInfoBreadCrumbs';
import { useSearchParams } from 'react-router-dom';
import AnalysisModelService from '../../Context/services/AnalysisModelService';
import DateDropdown from './DateDropDown';
import "../../../assets/styles/whole.css";

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const LISTBOX_PADDING = 8;
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

const unitSymbolDict = {
    "million": "M",
    "decimal": "",
    "days": "days",
    "x time": "x",
    "percent": "%",
    "monetary": "ccy"
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

// const tableDropDownValues = [
//     "ratios-ttm",
//     "key-metrics-ttm"
// ];

const tableDropDownValues = [
    "Ratios",
    "Key metrics"
];

const frequencyDropDownValues = [
    "Annual",
    "Quarter"
];

const quarterDropDownValues = [
    "Q1",
    "Q2",
    "Q3",
    "Q4"
];


const DAKeyMetrics = () => {

    let pageLoc = window.location.pathname;
    const [searchParams] = useSearchParams();
    let company = searchParams.get("company", "") ? searchParams.get("company") : "";
    let exchange = searchParams.get("exchange") ? searchParams.get("exchange") : "";
    const restService = new DAKeyMetricsService();
    const companiesService = new CompaniesService();
    const restClientAnalysisModel = new AnalysisModelService();
    const [companyFilter, setCompanyFilter] = useState({ company_name: company });
    const [exchangeFilter, setExchangeFilter] = useState(exchange);
    const [exchangeDropDownValues, setExchangeDropDownValues] = useState([]);
    const [categoryDropDownValues, setCategoryDropDownValues] = useState([{category: ""}]);
    const [showExchangeProp, setShowExchangeProp] = useState(false);
    const [tableFilter, setTableFilter] = useState("Ratios");

    const [frequencyFilter, setFrequencyFilter] = useState("Annual");
    const [categoryFilter, setCategoryFilter] = useState({category: ""});
    const [fromFilter, setFromFilter] = useState("");
    const [toFilter, setToFilter] = useState("");
    const [fromFilterVal, setFromFilterVal] = useState("");
    const [toFilterVal, setToFilterVal] = useState("");

    const [tableContent, setTableContent] = useState([]);
    // const [table2Content, setTable2Content] = useState([]);

    const [tableHeaders, setTableHeaders] = useState({data: []});
    // const [table2Headers, setTable2Headers] = useState({data: []});

    const [tableConentFetched, setTableContentFetched] = useState(false);
    const [companyDropDownValues, setCompanyDropDownValues] = useState([{ company_name: "" }]);
    const [showCircularProgress, setCircularProgress] = useState(false);
    const [selectedQuarter, setSelectedQuarter] = React.useState([]);
    const isAllSelected =
        quarterDropDownValues.length > 0 && selectedQuarter.length === quarterDropDownValues.length;

    const getCompaniesDropDowns = async () => {
        await companiesService.getAllCompanies()
            .then((response) => {
                setCompanyDropDownValues(response.data.companies_data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const getCategoryDropDowns = async (type) => {
        console.log('emitted', type)
        await companiesService.getAllCategories(type)
            .then((response) => {
                setCategoryDropDownValues(response.data.resp_data);
            })
            .catch((err) => {
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

    const buildTableHeaders = (table1) => {
        if (tableFilter === "Ratios") {
            let ratiostableHeaderColumns = {
                data: [
                    {
                        id: "field",
                        label: "Ratios"
                    }
                ]
            }
            let table1Head = ratiostableHeaderColumns
            for(let col of table1) {
                table1Head.data.push({
                    id: col,
                    label: col
                })
            }
            table1Head.data.push({
                id: "ttm",
                label: "TTM"
            })
            setTableHeaders(table1Head)
            // let table2Head = ratiosTTMtableHeaderColumns
            // for(let col of table2) {
            //     table2Head.data.push({
            //         id: col,
            //         label: col
            //     })
            // }
            // setTable2Headers(table2Head)
        } else {
            let metricstableHeaderColumns = {
                data: [
                    {
                        id: "field",
                        label: "KeyMetrics"
                    }
                ]
            }
            let table1Head = metricstableHeaderColumns
            for(let col of table1) {
                table1Head.data.push({
                    id: col,
                    label: col
                })
            }
            table1Head.data.push({
                id: "ttm",
                label: "TTM"
            })
            setTableHeaders(table1Head)
            // let table2Head = metricsTTMtableHeaderColumns
            // for(let col of table2) {
            //     table2Head.data.push({
            //         id: col,
            //         label: col
            //     })
            // }
            // setTable2Headers(table2Head)
        }
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setTableContentFetched(false);
        setCircularProgress(true);
        console.log({ company: companyFilter.company_name, table: tableFilter });
        await restService.getKeyMetricsForCompany({ company: companyFilter.company_name, table: tableFilter, exchange: exchangeFilter, category: categoryFilter.category, frequency: frequencyFilter, quarter: selectedQuarter, fromYear: fromFilter, toYear: toFilter })
            .then((response) => {
                console.log(response.data.resp_data)
                if(tableFilter === "Ratios"){
                    buildTableHeaders(response.data.resp_data[0].ratiosRespFields)
                    setTableContent(response.data.resp_data[0].ratiosResp);
                   
                    // setTable2Content(response.data.resp_data[0].ratiosTTMResp);
                } else {
                    buildTableHeaders(response.data.resp_data[0].keyMetricsRespFields)
                    setTableContent(response.data.resp_data[0].keyMetricsResp);
                    // setTable2Content(response.data.resp_data[0].keyTTMMetricsResp);
                }
                setTableContentFetched(true);
                setCircularProgress(false);
            })
            .catch((err) => {
                console.log(err);
            });

        setCircularProgress(false);
    }

    useEffect(() => {
        getCompaniesDropDowns();
        if (company != null && company !== "") {
            getExchangesByCompanyName(company);
        }
        getCategoryDropDowns(tableFilter);
    }, []);

    const handleChange = (event) => {
        const value = event.target.value;
        if (value[value.length - 1] === "all") {
            setSelectedQuarter(selectedQuarter.length === quarterDropDownValues.length ? [] : quarterDropDownValues);
            return;
        }
        setSelectedQuarter(value);
    };
    const handleFromChange=(date)=> {
        setFromFilterVal(date)
        console.log(date)
        var da=date.toString().split(' ')[3]
        console.log(da)
        setFromFilter(da);
    }
    const handleToChange=(date)=> {
        var da = date.toString().split(' ')[3]
        setToFilterVal(date)
        setToFilter(da);
    }
    return (
        <React.Fragment>
            <Box sx={{ marginLeft: 1 }}>
                <PageInfoBreadCrumbs data={pageLoc} />
                <Grid container
                    spacing={1}
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { minWidth: '20ch' },
                    }}
                    noValidate
                    autoComplete="off">
                    <Grid item sx={{ marginTop: 1.2 }}>
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
                            options={companyDropDownValues}
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
                    <Grid item sx={{ marginTop: 0.75 }}>
                        <Autocomplete
                            size="small"
                            disablePortal
                            id="tableFilter"
                            options={tableDropDownValues}
                            getOptionLabel={(option) => option}
                            isOptionEqualToValue={(option, value) => option === value}
                            onChange={(event, newValue) => {
                                setTableFilter(newValue);
                                getCategoryDropDowns(newValue);
                            }}
                            value={tableFilter}
                            sx={{ minWidth: 240, mt: 0.4 }}
                            renderInput={(params) => <TextField
                                SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }}
                                {...params} variant="standard" label="Type" />}
                        />
                    </Grid><Grid item sx={{ marginTop: 0.75 }}>
                        <Autocomplete
                            size="small"
                            disablePortal
                            id="category"
                            options={categoryDropDownValues}
                            isOptionEqualToValue={(option, value) => option.category === value.category}
                            getOptionLabel={(option) => option.category}
                            // isOptionEqualToValue={(option, value) => option.type === value.type}
                            onChange={(event, newValue) => {
                                setCategoryFilter(newValue);
                            }}
                            value={categoryFilter}
                            sx={{ minWidth: 240, mt: 0.4 }}
                            renderInput={(params) => <TextField
                                SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }}
                                {...params} variant="standard" label="Category" />}
                        />
                    </Grid>
                    <Grid item sx={{ marginTop: 0.75 }}>
                        <Autocomplete
                            size="small"
                            disablePortal
                            id="frequency"
                            options={frequencyDropDownValues}
                            isOptionEqualToValue={(option, value) => option === value}
                            // getOptionLabel={(option) => option.type} "Quarter"
                            // isOptionEqualToValue={(option, value) => option.type === value.type}
                            onChange={(event, newValue) => {
                                setFrequencyFilter(newValue);
                            }}
                            value={frequencyFilter}
                            sx={{ minWidth: 240, mt: 0.4 }}
                            renderInput={(params) => <TextField
                                SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }}
                                {...params} variant="standard" label="Frequency" />}
                        />
                    </Grid>
                    {frequencyFilter === "Quarter" && <Grid item sx={{ marginTop: 0.75 }}>
                        <FormControl sx={{minWidth: '20ch'}}>
                        <InputLabel id="quarters-select-label">Quarter</InputLabel>
                            <Select
                                labelId="quarters-select-label"
                                multiple
                                value={selectedQuarter}
                                onChange={handleChange}
                                renderValue={(selected) => selected.join(", ")}
                                variant="standard"
                                label="Quarter"
                            >
                                <MenuItem
                                    value="all"
                                >
                                    <ListItemIcon>
                                        <Checkbox
                                            // classes={{ indeterminate: classes.indeterminateColor }}
                                            checked={isAllSelected}
                                            indeterminate={
                                                selectedQuarter.length > 0 && selectedQuarter.length < quarterDropDownValues.length
                                            }
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        // classes={{ primary: classes.selectAllText }}
                                        primary="All"
                                    />
                                </MenuItem>
                                {quarterDropDownValues.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        <ListItemIcon>
                                            <Checkbox checked={selectedQuarter.indexOf(option) > -1} />
                                        </ListItemIcon>
                                        <ListItemText primary={option} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>}
                    <Grid item sx={{ marginTop: 1.2 }}>
                        {/* <TextField
                            id="fromFilter"
                            label="From"
                            placeholder='Year'
                            helperText="Enter From Year Example: 2010"
                            variant="standard"
                            onChange={(event) => setFromFilter(event.target.value)}
                            value={fromFilter}
                        /> */}
                        <label style={{ color: 'rgba(0, 0, 0, 0.6)', fontFamily: '"Roboto","Helvetica","Arial","sans-serif"' }}>
                            from:
                        </label>
                        <DatePicker
                            selected={fromFilterVal}
                            onChange={(date)=>handleFromChange(date)}
                            dateFormat="yyyy"
                            placeholderText="Year"
                            showYearPicker
                            minDate={new Date(1950, 0, 1)}
                            className="custom-datepicker"

                        />
                    </Grid>
                    <Grid item sx={{ marginTop: 1.2}}>
                        <label style={{ color: 'rgba(0, 0, 0, 0.6)', fontFamily: '"Roboto","Helvetica","Arial","sans-serif"' }}>
                            to:
                        </label>
                        <DatePicker
                            selected={toFilterVal}
                            onChange={(date)=>handleToChange(date)}
                            dateFormat="yyyy"
                            placeholderText="Year"
                            showYearPicker
                            minDate={new Date(1950, 0, 1)}
                            className="custom-datepicker"

                        />
                        {/* <DateDropdown/> */}
                        {/* <TextField
                            id="toFilter"
                            label="To"
                            placeholder='Year'
                            helperText="Enter To Year Example: 2020"
                            variant="standard"
                            onChange={(event) => setToFilter(event.target.value)}
                            value={toFilter}
                        /> */}
                    </Grid>
                    <Grid item sx={{ marginTop: 0.75 }}>
                        <Button id="daFinancialsSubmit" type="submit" variant="contained" size="medium" onClick={onSubmitHandler} sx={{ mt: 1.5 }} > Submit </Button>
                    </Grid>
                </Grid>
            </Box>
            <Card sx={{ width: '98%', m: 1, position: 'relative' }}>
                {showCircularProgress && <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}
                {showCircularProgress && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Backdrop
                        sx={{ color: '#fff', position: 'absolute', zIndex: (theme) => theme.zIndex.drawer - 1, opacity: 0.5 }}
                        open={showCircularProgress}
                    >
                        <CircularProgress />
                    </Backdrop>
                </Box>}
                {tableConentFetched && <CustomizedTable tableRows={tableContent} headCells={tableHeaders} showTool={1} />}
                {/* {tableConentFetched && <CustomizedTable tableRows={table2Content} headCells={table2Headers} />} */}
            </Card>
        </React.Fragment>
    );
}

export default DAKeyMetrics;
