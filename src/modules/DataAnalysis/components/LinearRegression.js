import React, { useEffect, useState } from 'react'

import { Backdrop, Box, Button, Card, Chip, CircularProgress, Grid, Tooltip, InputLabel } from '@mui/material';

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
import DALinearRegressionService from '../services/LinearRegressionService';
import ReactHighcharts from 'react-highcharts/ReactHighstock.src'
import PageInfoBreadCrumbs from '../../Core/components/Layout/PageInfoBreadCrumbs';
import moment from 'moment'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

const DALinearRegression = () => {
    let pageLoc = window.location.pathname;
    const restService = new DALinearRegressionService();
    const companiesService = new CompaniesService();
    const [companyFilter, setCompanyFilter] = useState("");
    const [fromFilter, setFromFilter] = useState("");
    const [toFilter, setToFilter] = useState("");
    const [fromFilterVal, setFromFilterVal] = useState("");
    const [toFilterVal, setToFilterVal] = useState("");
    const [tableContent, setTableContent] = useState([]);
    const tableHeaderColumns = {
        data: [
            {
                id: "startDate",
                label: "Starting Date"
            },
            {
                id: "endDate",
                label: "Ending Date"
            },
            {
                id: "years",
                label: "Years"
            },
            {
                id: "startingPrice",
                label: "Starting Price"
            },
            {
                id: "endingPrice",
                label: "Ending Price"
            },
            {
                id: "performance",
                label: "Performance(%)"
            },
            {
                id: "cagr",
                label: "CAGR(%)"
            },
            {
                id: "sd",
                label: "SD"
            },
            {
                id: "rsd",
                label: "RSD(%)"
            },
            {
                id: "2sd",
                label: "2 SD"
            },
            {
                id: "2rsd",
                label: "2 RSD(%)"
            },
        ]
    }
    const [tableConentFetched, setTableContentFetched] = useState(false);
    const [companyDropDownValues, setCompanyDropDownValues] = useState([{ company_name: "" }]);
    const [showCircularProgress, setCircularProgress] = useState(false);

    function toTimestamp(strDate) {
        let datum = Date.parse(strDate);
        return datum;
    }
    // const options = { style: 'currency', currency: 'USD' };
    const numberFormat = new Intl.NumberFormat('en-US');
    const [configPrice, setConfigPrice] = useState({

        yAxis: [{
            offset: 20,

            labels: {
                formatter: function () {
                    return numberFormat.format(this.value)
                }
                ,
                x: -15,
                style: {
                    "color": "#000", "position": "absolute"

                },
                align: 'left'
            },
        },

        ],
        tooltip: {
            // shared: true,
            split: true,
            valueDecimals: 2,
            // formatter: function () {
            //     return numberFormat.format(this.y, 0) + '</b><br/>' + moment(this.x).format('MMMM Do YYYY')
            // },
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>'
        },
        plotOptions: {
            series: {
                // compare: 'percent',
                showInNavigator: true,
                gapSize: 6,

            }
        },
        chart: {
            height: 550,
        },

        credits: {
            enabled: false
        },

        legend: {
            enabled: true
        },
        xAxis: {
            type: 'year',
        },
        rangeSelector: {
            buttons: [{
                type: 'day',
                count: 7,
                text: '7d',
            }, {
                type: 'month',
                count: 6,
                text: '6m'
            }, {
                type: 'year',
                count: 1,
                text: '1y'
            }, {
                type: 'year',
                count: 2,
                text: '2y'
            },
            {
                type: 'all',
                text: 'All'
            }],
            selected: 4
        },
        series: []
    });
    const StructureChartData = (apiData) => {
        let result = []
        let closePrice = []
        let regressionValues = []
        let standardDevPlus = []
        let standardDevPlusTwo = []
        let standardDevMinus = []
        let standardDevMinusTwo = []
        apiData.regressionData[0].resp_dates.forEach(function (dateVal, index) {
            dateVal = toTimestamp(moment(dateVal).format('MM/DD/YYYY'));
            closePrice.push([dateVal, apiData.regressionData[0].close_price[index]])
            regressionValues.push([dateVal, apiData.regressionData[0].regression_values[index]])
            standardDevPlus.push([dateVal, apiData.regressionData[0].standardDevPlus[index]])
            standardDevPlusTwo.push([dateVal, apiData.regressionData[0].standardDevPlusTwo[index]])
            standardDevMinus.push([dateVal, apiData.regressionData[0].standardDevMinus[index]])
            standardDevMinusTwo.push([dateVal, apiData.regressionData[0].standardDevMinusTwo[index]])
        });
        result = [
            {
                name: apiData.company_name + " " + "Close price",
                type: 'spline',
                data: closePrice
            },
            {
                name: apiData.company_name + " " + "Regression",
                type: 'spline',
                data: regressionValues
            },
            {
                name: apiData.company_name + " " + "Standard Deviation -",
                type: 'spline',
                data: standardDevMinus
            },
            {
                name: apiData.company_name + " " + "2 Standard Deviation +",
                type: 'spline',
                data: standardDevPlusTwo
            },
            {
                name: apiData.company_name + " " + "Standard Deviation +",
                type: 'spline',
                data: standardDevPlus
            },
            {
                name: apiData.company_name + " " + "2 Standard Deviation -",
                type: 'spline',
                data: standardDevMinusTwo
            }
        ]
        let config = configPrice
        config.series = result
        setConfigPrice(config);
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

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setTableContentFetched(false);
        setCircularProgress(true);
        await restService.getLinearRegressionData({ company: companyFilter.company_name, from_year: fromFilter, to_year: toFilter })
            .then((response) => {
                const endingPrice =  response.data.regressionData[0].close_price.slice(-1)[0];
                const startingPrice = response.data.regressionData[0].close_price[0];
                const performance = (((endingPrice - startingPrice)/startingPrice) * 100);
                const years = new Date(response.data.regressionData[0].resp_dates.slice(-1)).getFullYear() - new Date(response.data.regressionData[0].resp_dates[0]).getFullYear();
                let tableContent = response.data;
                tableContent.resp_data[0]["startDate"] = response.data.regressionData[0].resp_dates[0];
                tableContent.resp_data[0]["endDate"] = response.data.regressionData[0].resp_dates.slice(-1);
                tableContent.resp_data[0]["years"] = years;
                tableContent.resp_data[0]["cagr"] = ((((endingPrice/startingPrice)**(1/years))-1) * 100).toFixed(2);
                tableContent.resp_data[0]["performance"] = performance.toFixed(2);
                tableContent.resp_data[0]["startingPrice"] = startingPrice;
                tableContent.resp_data[0]["endingPrice"] = endingPrice;
                setTableContent(tableContent.resp_data);
                StructureChartData(response.data);
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
    }, []);

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
                                setCompanyFilter(newValue)
                            }}
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
                    {/* <Grid item sx={{ marginTop: 0.75 }}>
                        <TextField
                            id="fromFilter"
                            label="From"
                            placeholder='Year'
                            variant="standard"
                            onChange={(event) => { setFromFilter(event.target.value) }}
                            value={fromFilter}
                        /> */}
                        {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DesktopDatePicker
                                label="From"
                                inputFormat="yyyy/MM/DD"
                                value={fromFilter}
                                onChange={(newValue) => { console.log(newValue); setFromFilter(newValue) }}
                                renderInput={(params) => <TextField {...params} variant="standard" />}
                            />
                        </LocalizationProvider> */}
                    {/* </Grid> */}
                    {/* <Grid item sx={{ marginTop: 0.75 }}>
                        <TextField
                            id="toFilter"
                            label="To"
                            placeholder='Year'
                            variant="standard"
                            onChange={(event) => setToFilter(event.target.value)}
                            value={toFilter}
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
                        <Button id="daLinearRegressionSubmit" type="submit" variant="contained" size="medium" onClick={onSubmitHandler} sx={{ mt: 1.5 }} > Submit </Button>
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
                {tableConentFetched && <React.Fragment>
                    {/* <Chart data={chartData} /> */}
                    <ReactHighcharts config={configPrice}></ReactHighcharts>
                    <CustomizedTable tableRows={tableContent} headCells={tableHeaderColumns} />
                </React.Fragment>}
            </Card>
        </React.Fragment>
    );
}

export default DALinearRegression;
