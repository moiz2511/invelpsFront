import React, { useEffect, useState } from 'react'

import { Backdrop, Box, Button, Card, Checkbox, Chip, CircularProgress, MenuItem, Grid, Tooltip, Select, ListItemIcon, ListItemText, InputLabel } from '@mui/material';

import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import useMediaQuery from '@mui/material/useMediaQuery';
import Popper from '@mui/material/Popper';
import { useTheme, styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import { VariableSizeList } from 'react-window';
import Typography from '@mui/material/Typography';
import DAFinancialsService from '../services/FinancialsService';
import CompaniesService from '../services/CompaniesService';
import CustomizedTable from '../../UIUtils/Table/TableContentComponent';
import PageInfoBreadCrumbs from '../../Core/components/Layout/PageInfoBreadCrumbs';
import { useSearchParams } from 'react-router-dom';
import AnalysisModelService from '../../Context/services/AnalysisModelService';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import DatePicker from 'react-datepicker';


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

// const tableDropDownValues = [
//     "income-statement",
//     "balance-sheet-statement",
//     "cash-flow-statement",
//     "financial-growth",
//     "income-statement-growth",
//     "balance-sheet-statement-growth",
//     "cash-flow-statement-growth",
//     "pnl"
// ];

const tableDropDownValues = [
    "Income",
    "BalanceSheet",
    "CashFlows"
];

const displayDropDownValues = [
    "Value",
    "Growth"
];

const periodDropDownValues = [
    "Annual"
];

const periodValDropDownValues = [
    "Annual",
    "Quarter"
];

const quarterDropDownValues = [
    "Q1",
    "Q2",
    "Q3",
    "Q4"
];

const DAFinancials = () => {
    let pageLoc = window.location.pathname;
    const [searchParams] = useSearchParams();
    let company = searchParams.get("company", "") ? searchParams.get("company") : "";
    let exchange = searchParams.get("exchange") ? searchParams.get("exchange") : "";
    const restService = new DAFinancialsService();
    const companiesService = new CompaniesService();
    const restClientAnalysisModel = new AnalysisModelService();
    const [companyFilter, setCompanyFilter] = useState({ company_name: company });
    const [tableFilter, setTableFilter] = useState("Income");
    const [displayFilter, setDisplayFilter] = useState("Value");
    const [periodFilter, setPeriodFilter] = useState("Annual");
    // const [fromFilter, setFromFilter] = useState("");
    // const [toFilter, setToFilter] = useState("");
    const [fromFilter, setFromFilter] = useState("");
    const [toFilter, setToFilter] = useState("");
    const [fromFilterVal, setFromFilterVal] = useState("");
    const [toFilterVal, setToFilterVal] = useState("");
    const [exchangeFilter, setExchangeFilter] = useState(exchange);
    const [exchangeDropDownValues, setExchangeDropDownValues] = useState([]);
    const [showExchangeProp, setShowExchangeProp] = useState(false);

    const [tableContent, setTableContent] = useState([]);
    const [tableHeaderColumns, setTableHeaderColumns] = useState({});
    const [tableConentFetched, setTableContentFetched] = useState(false);
    const [companyDropDownValues, setCompanyDropDownValues] = useState([{ company_name: "" }]);
    // const [companyCurrency, setCompanyCurrency] = useState("");
    const [showCircularProgress, setCircularProgress] = useState(false);
    const [selectedQuarter, setSelectedQuarter] = React.useState([]);
    const isAllSelected =
        quarterDropDownValues.length > 0 && selectedQuarter.length === quarterDropDownValues.length;
    const buildTableHeadCells = (responseFileds, currency) => {
        let localHeadCells = {
            data: [
            ]
        };
        if (displayFilter === "Growth") {
            localHeadCells.data.push({
                id: 'metric',
                label: `Metric (in %)`,
                isValueLink: false,
            })
        } else {
            localHeadCells.data.push({
                id: 'metric',
                label: `Metric (${currency})`,
                isValueLink: false,
            })
        }
        for (let [index, year] of responseFileds.entries()) {
            localHeadCells.data.push({
                id: year,
                label: year,
                isValueLink: false
            })
        }
        return localHeadCells;
    }

    const getCompaniesDropDowns = async () => {
        await companiesService.getAllCompanies()
            .then((response) => {
                setCompanyDropDownValues(response.data.companies_data);
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

    const GetCompanyCurrency = async (respData) => {
        await companiesService.getProfileDataByCompanyAndTableName(companyFilter.company_name, exchangeFilter)
            .then((response) => {
                const headCells = buildTableHeadCells(respData.responseFileds, response.data.resp_data?.profile[0]?.currency);
                setTableHeaderColumns(headCells);
                console.log(headCells)
                setTableContent(respData.return_list);
                setTableContentFetched(true);
                setCircularProgress(false);
            })
            .catch((err) => {
                console.log(err);
            });

    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setTableContentFetched(false);
        setCircularProgress(true);
        console.log("to filter:",toFilter)
        console.log("from:", fromFilter)
        console.log("company name:", companyFilter.company_name)
        console.log("table:", tableFilter)
        console.log("display:", displayFilter)
        console.log("periodFilter:", periodFilter)
        console.log("selectedQuarter:", selectedQuarter)
        console.log("exchangeFilter:", exchangeFilter)



        await restService.getFinalcialsAnalysisReport({ company: companyFilter.company_name, table: tableFilter, display: displayFilter, period: periodFilter, quarter: selectedQuarter, from_year: fromFilter, to_year: toFilter, exchange: exchangeFilter })
            .then((response) => {
                GetCompanyCurrency(response.data);
            })
            .catch((err) => {
                console.log(err);
                setCircularProgress(false);
            });
    }

    useEffect(() => {
        getCompaniesDropDowns();
        if (company != null && company !== "") {
            getExchangesByCompanyName(company);
        }
    }, []);

    const handleChange = (event) => {
        const value = event.target.value;
        if (value[value.length - 1] === "all") {
            setSelectedQuarter(selectedQuarter.length === quarterDropDownValues.length ? [] : quarterDropDownValues);
            return;
        }
        setSelectedQuarter(value);
    };
    const handleFromChange = (date) => {
        setFromFilterVal(date)
        console.log(date)
        var da = date.toString().split(' ')[3]
        console.log(da)
        setFromFilter(da);
    }
    const handleToChange = (date) => {
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
                            isOptionEqualToValue={(option, value) => option === value}
                            // getOptionLabel={(option) => option.type}
                            // isOptionEqualToValue={(option, value) => option.type === value.type}
                            onChange={(event, newValue) => {
                                setTableFilter(newValue);
                            }}
                            value={tableFilter}
                            sx={{ minWidth: 240, mt: 0.4 }}
                            renderInput={(params) => <TextField
                                SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }}
                                {...params} variant="standard" label="Statement" />}
                        />
                    </Grid>
                    <Grid item sx={{ marginTop: 0.75 }}>
                        <Autocomplete
                            size="small"
                            disablePortal
                            id="display"
                            options={displayDropDownValues}
                            isOptionEqualToValue={(option, value) => option === value}
                            // getOptionLabel={(option) => option.type}
                            // isOptionEqualToValue={(option, value) => option.type === value.type}
                            onChange={(event, newValue) => {
                                setDisplayFilter(newValue);
                            }}
                            value={displayFilter}
                            sx={{ minWidth: 240, mt: 0.4 }}
                            renderInput={(params) => <TextField
                                SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }}
                                {...params} variant="standard" label="Display" />}
                        />
                    </Grid>
                    <Grid item sx={{ marginTop: 0.75 }}>
                        <Autocomplete
                            size="small"
                            disablePortal
                            id="frequency"
                            options={displayFilter === "Value" ? periodValDropDownValues : periodDropDownValues}
                            isOptionEqualToValue={(option, value) => option === value}
                            // getOptionLabel={(option) => option.type} "Quarter"
                            // isOptionEqualToValue={(option, value) => option.type === value.type}
                            onChange={(event, newValue) => {
                                setPeriodFilter(newValue);
                            }}
                            value={periodFilter}
                            sx={{ minWidth: 240, mt: 0.4 }}
                            renderInput={(params) => <TextField
                                SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }}
                                {...params} variant="standard" label="Frequency" />}
                        />
                    </Grid>
                    {periodFilter === "Quarter" && <Grid item sx={{ marginTop: 0.75 }}>
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
                    {/* {periodFilter === "Quarter" && <Grid item sx={{ marginTop: 0.75 }}>
                        <Autocomplete
                            size="small"
                            disablePortal
                            id="quarter"
                            options={quarterDropDownValues}
                            isOptionEqualToValue={(option, value) => option === value}
                            // getOptionLabel={(option) => option.type}
                            // isOptionEqualToValue={(option, value) => option.type === value.type}
                            onChange={(event, newValue) => {
                                setQuarterFilter(newValue);
                            }}
                            value={quarterFilter}
                            sx={{ minWidth: 240, mt: 0.4 }}
                            renderInput={(params) => <TextField
                                SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }}
                                {...params} variant="standard" label="Quarter" />}
                        />
                    </Grid>} */}
                    {/* <Grid item sx={{ marginTop: 1.2 }}>
                        
                        <label className="" style={{ color:'rgba(0, 0, 0, 0.6)',fontFamily:'"Roboto","Helvetica","Arial","sans-serif"'}}>
                                from:
                            </label>
                            <DatePicker
                                label="From"
                                selected={fromFilterVal}
                                onChange={(date) => handleFromChange(date)}
                                dateFormat="yyyy"
                                placeholderText="Year"
                                showYearPicker
                                minDate={new Date(1950, 0, 1)}
                                className="custom-datepicker"

                            />
                            
                        
                    </Grid> */}
                    {/* <Grid item sx={{ marginTop: 1.2 }}>
                       
                        <label style={{ color: 'rgba(0, 0, 0, 0.6)', fontFamily: '"Roboto","Helvetica","Arial","sans-serif"' }}>
                            to:
                        </label>
                        <DatePicker
                            selected={toFilterVal}
                            onChange={(date) => handleToChange(date)}
                            dateFormat="yyyy"
                            placeholderText="Year"
                            showYearPicker
                            minDate={new Date(1950, 0, 1)}
                            className="custom-datepicker"

                        />
                    </Grid> */}
                     <Grid item sx={{ marginTop: 0.75 }}>
                        <InputLabel> from:</InputLabel>
                        <Box sx={{ marginTop: 0.45 }}>
                            <DatePicker
                                selected={fromFilterVal}
                                onChange={(date) => handleFromChange(date)}
                                dateFormat="yyyy"
                                placeholderText="Year"
                                showYearPicker
                                minDate={new Date(1950, 0, 1)}
                                className="custom-datepicker"
                            />
                        </Box>
                    </Grid>
                    <Grid item sx={{ marginTop: 0.75 }}>
                        <InputLabel> to:</InputLabel>
                        <Box sx={{ marginTop: 0.45 }}>
                            <DatePicker
                                
                                selected={toFilterVal}
                                onChange={(date) => handleToChange(date)}
                                dateFormat="yyyy"
                                placeholderText="Year"
                                showYearPicker
                                minDate={new Date(1950, 0, 1)}
                                className="custom-datepicker"
                            />
                        </Box>
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
                {tableConentFetched && <CustomizedTable disablePagination={true} enableSorting={false} tableRows={tableContent} headCells={tableHeaderColumns} showTool={0} />}
            </Card>
        </React.Fragment>
    );
}

export default DAFinancials;
