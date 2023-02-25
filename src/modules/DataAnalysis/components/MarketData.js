import React, { useEffect, useState } from 'react'

import { Backdrop, Box, Button, Card, Chip, CircularProgress, Grid, MenuItem, Tooltip } from '@mui/material';

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
import DAMarketDataService from '../services/MarketDataService';
import PageInfoBreadCrumbs from '../../Core/components/Layout/PageInfoBreadCrumbs';
import { useSearchParams } from 'react-router-dom';
import AnalysisModelService from '../../Context/services/AnalysisModelService';

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

const tableDropDownValues = [
    "Historical Stock Price",
    "Historical dividend"
]

const DAMarketData = () => {
    let pageLoc = window.location.pathname;
    const [searchParams] = useSearchParams();
    let company = searchParams.get("company", "") ? searchParams.get("company") : "";
    let exchange = searchParams.get("exchange") ? searchParams.get("exchange") : "";
    const restService = new DAMarketDataService();
    const companiesService = new CompaniesService();
    const restClientAnalysisModel = new AnalysisModelService();
    const [companyFilter, setCompanyFilter] = useState({ company_name: company });
    const [exchangeFilter, setExchangeFilter] = useState(exchange);
    const [exchangeDropDownValues, setExchangeDropDownValues] = useState([]);
    const [showExchangeProp, setShowExchangeProp] = useState(false);
    const [tableFilter, setTableFilter] = useState("Historical Stock Price");
    // const NewDate = moment(new Date()).format("yyyy/MM/DD");
    const [fromFilter, setFromFilter] = useState(new Date());
    const [toFilter, setToFilter] = useState(new Date());

    const [tableContent, setTableContent] = useState([]);
    const [tableHeaderColumns, setTableHeaderColumns] = useState({});
    const [tableConentFetched, setTableContentFetched] = useState(false);
    const [companyDropDownValues, setCompanyDropDownValues] = useState([{ company_name: "" }]);
    const [showCircularProgress, setCircularProgress] = useState(false);

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

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setTableContentFetched(false);
        setCircularProgress(true);
        let tableFilterValue = "stock-dividend"
        if (tableFilter == "Historical Stock Price"){
            tableFilterValue = "historical-price-full"
        }
        await restService.getMarketDataForCompany({ company: companyFilter.company_name, table: tableFilterValue, from_date: fromFilter, to_date: toFilter, exchange:exchangeFilter })
            .then((response) => {
                setTableContent(response.data.resp_data);
                setTableHeaderColumns({ data: response.data.col_list.map((item) => { return { id: item, label: item } }) });
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
    }, []);

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
                            }}
                            value={tableFilter}
                            sx={{ minWidth: 240, mt: 0.4 }}
                            renderInput={(params) => <TextField
                                SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }}
                                {...params} variant="standard" label="Table" />}
                        />
                    </Grid>
                    <Grid item sx={{ marginTop: 0.75 }}>
                        <TextField
                            id="fromFilter"
                            label="From"
                            placeholder='Date'
                            InputLabelProps={{ shrink: true }}
                            variant="standard"
                            onChange={(event) => { setFromFilter(event.target.value); console.log(event.target.value) }}
                            value={fromFilter}
                            type='date'
                        />
                        {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DesktopDatePicker
                                label="From"
                                inputFormat="yyyy/MM/DD"
                                value={fromFilter}
                                onChange={(newValue) => { console.log(newValue); setFromFilter(newValue) }}
                                renderInput={(params) => <TextField {...params} variant="standard" />}
                            />
                        </LocalizationProvider> */}
                    </Grid>
                    <Grid item sx={{ marginTop: 0.75 }}>
                        <TextField
                            id="toFilter"
                            label="To"
                            placeholder='Date'
                            variant="standard"
                            InputLabelProps={{ shrink: true }}
                            onChange={(event) => setToFilter(event.target.value)}
                            value={toFilter}
                            type='date'
                        />
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
                {tableConentFetched && <CustomizedTable tableRows={tableContent} headCells={tableHeaderColumns} />}
            </Card>
        </React.Fragment>
    );
}

export default DAMarketData;
