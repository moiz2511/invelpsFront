import { TextField, Button, MenuItem, Grid, Card, Backdrop, CircularProgress, Box, ButtonGroup, Tooltip, IconButton, TableContainer, Table, TableHead, TableRow, Tab, Tabs, Autocomplete } from '@mui/material';
import React, { useEffect, useState } from 'react'
import ColorConstants from '../../Core/constants/ColorConstants.json'
import CustomizedTable from '../../UIUtils/Table/TableContentComponent';
import PageInfoBreadCrumbs from '../../Core/components/Layout/PageInfoBreadCrumbs';
import ScreenerService from '../services/ScreenerService';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import { styled } from '@mui/material/styles';
import AddMetricFilterDialog from './ScreenerDailog';
import SaveScreener from './SaveScreener';
import TabToolTip from './TabsToolTip';
import { useParams } from 'react-router-dom';


const headCells = {
    data: [
        {
            id: 'category',
            label: 'Category',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: 'metric',
            label: 'Metric',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: 'description',
            label: 'Description',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: 'operator',
            label: 'Operator',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: 'value',
            label: 'Value',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: 'action',
            label: 'Action',
            isValueLink: false,
            isDropDown: false,
        }
    ]
};

const companyTableHeadCells = {
    data: [
        {
            id: 'company_name',
            label: 'Company',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: 'exchange',
            label: 'Exchange',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: 'sector',
            label: 'Sector',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: 'industry',
            label: 'Industry',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: 'country',
            label: 'Country',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: 'price',
            label: 'Price',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: 'mktCap',
            label: 'Market Cap',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: 'pe',
            label: 'PE(TTM)',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: 'yearChange',
            label: '1 Yr % Change',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: "analysis",
            label: "Analysis",
            isValueLink: false,
            isDropDown: true,
            dropDownValues: [
                {
                    id: "",
                    label: "Select Page"
                },
                {
                    id: "profile",
                    label: "Profile"
                },
                {
                    id: "financials",
                    label: "Financials"
                },
                {
                    id: "keymetricsttm",
                    label: "KeyMetrics TTM"
                },
                {
                    id: "marketData",
                    label: "Market Data"
                },
                {
                    id: "deepanalysis",
                    label: "Deep Analysis"
                }
            ]
        }
    ]
};



const performanceTableHeadCells = {
    data: [
        {
            id: 'company_name',
            label: 'Company',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: 'exchange',
            label: 'Exchange',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: 'sector',
            label: 'Sector',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: 'industry',
            label: 'Industry',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: 'country',
            label: 'Country',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: '1D',
            label: '1D',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: '5D',
            label: '5D',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: '1M',
            label: '1M',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: '3M',
            label: '3M',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: '6M',
            label: '6M',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: 'ytd',
            label: 'ytd',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: '1Y',
            label: '1Y',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: '3Y',
            label: '3Y',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: '5Y',
            label: '5Y',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: '10Y',
            label: '10Y',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: 'max',
            label: 'max',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: 'price',
            label: 'Price',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: 'mktCap',
            label: 'Market Cap',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: 'pe',
            label: 'PE(TTM)',
            isValueLink: false,
            isDropDown: false,
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

const DAScreener = () => {
    let pageLoc = window.location.pathname;
    const [counter, setCounter] = useState(0);
    const restClient = new ScreenerService();
    const [countryDropDownValues, setCountryDropDownValues] = useState([{ country: "" }]);
    const [exchangeDropDownValues, setExchangeDropDownValues] = useState([{ exchange: "" }]);
    const [cityDropDownValues, setCityDropDownValues] = useState([{ city: "" }]);
    const [sectorDropDownValues, setSectorDropDownValues] = useState([{ sector: "" }]);
    const [industryDropDownValues, setIndustryDropDownValues] = useState([{ industry: "" }]);
    const [periodDropDownValues, setPeriodDropDownValues] = useState(["1", "3", "5", "10"]);

    const [countryFilter, setCountryFilter] = useState([]);
    const [exchangeFilter, setExchangeFilter] = useState();
    const [cityFilter, setCityFilter] = useState();
    const [sectorFilter, setSectorFilter] = useState();
    const [industryFilter, setIndustryFilter] = useState();
    const [periodFilter, setPeriodFilter] = useState("1");

    const [tableContent, setTableContent] = useState([]);
    const [displayScreenTable, setDisplayScreenTable] = useState(false);
    const [companiesTableData, setCompaniesTableData] = useState([]);

    const [profibilityTableData, setProfibilityTableData] = useState([]);
    const [effciencyTableData, setEffciencyTableData] = useState([]);
    const [liquidityTableData, setLiquidityTableData] = useState([]);
    const [solvencyTableData, setSolvencyTableData] = useState([]);
    const [valuationTableData, setValuationTableData] = useState([]);
    const [returnTableData, setReturnTableData] = useState([]);
    const [allTableData, setAllTableData] = useState([]);


    const [performanceTableData, setPerformanceTableData] = useState([]);
    const [compainesCount, setCompaniesCount] = useState(0);
    const [showCircularProgress, setCircularProgress] = useState(false);
    const [enableScreenButton, setEnableScreenButton] = useState(false);
    const [showCompaniesDataProgress, setShowCompaniesDataProgress] = useState(false);

    const [eventType, setEventType] = useState("add");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDialogOpen2, setIsDialogOpen2] = useState(false);

    const [clickedRowData, setclickedRowData] = useState("");
    const [value, setValue] = useState('1');
    const [efficiencyTableHeadCells, setEfficiencyTableHeadCells] = useState({
        data: [{
            id: 'company_name',
            label: 'Company',
            isValueLink: false,
            isDropDown: false,
        },
            {
                id: 'exchange',
                label: 'Exchange',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'sector',
                label: 'Sector',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'industry',
                label: 'Industry',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'country',
                label: 'Country',
                isValueLink: false,
                isDropDown: false,
            }]
    });
    const [profibiliyTableHeadCells, setProfibiliyTableHeadCells] = useState({
        data: [{
            id: 'company_name',
            label: 'Company',
            isValueLink: false,
            isDropDown: false,
        },
            {
                id: 'exchange',
                label: 'Exchange',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'sector',
                label: 'Sector',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'industry',
                label: 'Industry',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'country',
                label: 'Country',
                isValueLink: false,
                isDropDown: false,
            }]
    });
    const [liquidityTableHeadCells, setLiquidityTableHeadCells] = useState({
        data: [{
            id: 'company_name',
            label: 'Company',
            isValueLink: false,
            isDropDown: false,
        },
            {
                id: 'exchange',
                label: 'Exchange',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'sector',
                label: 'Sector',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'industry',
                label: 'Industry',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'country',
                label: 'Country',
                isValueLink: false,
                isDropDown: false,
            }]
    });
    const [solvencyTableHeadCells, setSolvencyTableHeadCells] = useState({
        data: [{
            id: 'company_name',
            label: 'Company',
            isValueLink: false,
            isDropDown: false,
        },
            {
                id: 'exchange',
                label: 'Exchange',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'sector',
                label: 'Sector',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'industry',
                label: 'Industry',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'country',
                label: 'Country',
                isValueLink: false,
                isDropDown: false,
            }]
    });
    const [valuationTableHeadCells, setValuationTableHeadCells] = useState({
        data: [{
            id: 'company_name',
            label: 'Company',
            isValueLink: false,
            isDropDown: false,
        },
            {
                id: 'exchange',
                label: 'Exchange',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'sector',
                label: 'Sector',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'industry',
                label: 'Industry',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'country',
                label: 'Country',
                isValueLink: false,
                isDropDown: false,
            }]
    });

    const [returnTableHeadCells, setReturnTableHeadCells] = useState({
        data: [{
            id: 'company_name',
            label: 'Company',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: 'exchange',
            label: 'Exchange',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: 'sector',
            label: 'Sector',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: 'industry',
            label: 'Industry',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: 'country',
            label: 'Country',
            isValueLink: false,
            isDropDown: false,
        }]
    });

    const [allTableHeadCells, setAllTableHeadCells] = useState({
        data: [{
            id: 'company_name',
            label: 'Company',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: 'exchange',
            label: 'Exchange',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: 'sector',
            label: 'Sector',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: 'industry',
            label: 'Industry',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: 'country',
            label: 'Country',
            isValueLink: false,
            isDropDown: false,
        }]
    });


    useEffect(() => {
        getExchangeDropDownsValues();
    }, []);
    const setCountryFilterHandler = (countries) => {
        console.log("Set Country filter handler")
        setCountryFilter(countries);
        console.log(" SET CON VAL DONE")
        setExchangeFilter("")
        setCityFilter("")
        setSectorFilter("")
        setIndustryFilter("")
        console.log("Getting exchnage dropdowns")
        getExchangeDropDowns(countries.map((data) => data.country).join(","));
        getCompaniesByCountry(countries);
    };
    async function getCompaniesByCountry(country) {
        setShowCompaniesDataProgress(true);
        setCircularProgress(true);
        const body = { country: country.map((data => data.country)) }
        await restClient.getCompanies(body)
            .then((response) => {
                console.log(response)
                getLivePricesAndMarketCap(response.data.resp_data)
                setCompaniesCount(response.data.resp_data.length);
                setShowCompaniesDataProgress(false);
                setCircularProgress(false);
            })
            .catch((err) => {
                console.log(err);
                setShowCompaniesDataProgress(false);
                setCircularProgress(false);
            });
    }

    const setExchangeFilterHandler = (exchanges) => {
        console.log("Set Exchange Values", exchanges)
        setExchangeFilter(exchanges)
        console.log(" SET EXC VAL DONE")
        setCityFilter("")
        setSectorFilter("")
        setIndustryFilter("")
        console.log("Getting City Options")
        // getCityDropDowns(countryFilter.map((data) => data.country).join(","), exchanges.map((data) => data.exchange).join(","));
        getCompaniesByExchange(exchanges)
        getSectorDropDowns(exchanges.map((data) => data.exchange).join(","));

    };
    async function getCompaniesByExchange(exchange) {
        setShowCompaniesDataProgress(true);
        setCircularProgress(true);
        const body = { exchange: exchange.map((data => data.exchange)) }
        await restClient.getCompanies(body)
            .then((response) => {
                console.log(response)
                getLivePricesAndMarketCap(response.data.resp_data)
                setCompaniesCount(response.data.resp_data.length);
                setShowCompaniesDataProgress(false);
                setCircularProgress(false);
            })
            .catch((err) => {
                console.log(err);
                setShowCompaniesDataProgress(false);
                setCircularProgress(false);
            });
    }
    const setCityFilterHandler = (cities) => {
        setCityFilter(cities)
        setSectorFilter("")
        setIndustryFilter("")
        getSectorDropDowns(exchangeFilter.map((data) => data.exchange).join(","), cities.map((data) => data.city).join(","));
    };
    const setSectorFilterHandler = (sectors) => {
        setSectorFilter(sectors)
        setIndustryFilter("")
        getCompaniesByExchangeAndSector(sectors)
        getIndustryDropDowns(exchangeFilter.map((data) => data.exchange).join(","), sectors.map((data) => data.sector).join(","));
    };
    async function getCompaniesByExchangeAndSector(sector) {
        setShowCompaniesDataProgress(true);
        setCircularProgress(true);
        const body = { exchange: exchangeFilter.map((data => data.exchange)), sector: sector.map((data => data.sector)) }
        await restClient.getCompanies(body)
            .then((response) => {
                console.log(response)
                getLivePricesAndMarketCap(response.data.resp_data)
                setCompaniesCount(response.data.resp_data.length);
                setShowCompaniesDataProgress(false);
                setCircularProgress(false);
            })
            .catch((err) => {
                console.log(err);
                setShowCompaniesDataProgress(false);
                setCircularProgress(false);
            });
    }
    const setIndustryFilterHandler = (industries) => {
        setIndustryFilter(industries)
        getCompanies(industries);
    };

    const getLivePricesAndMarketCap = async (companies) => {
        // let data = JSON.parse(companies);
        console.log(companies);
        let respData = []
        let data = companies.map((company) => company.symbol);
        await restClient.getCompaniesData(data.join(","), periodFilter)
            .then((response) => {
                console.log(response)
                let respData = response.data
                if (respData.length > 0) {
                    companies.map((company) => {
                        let filteredData = respData.filter((ApiCompany) => ApiCompany.symbol === company.symbol);
                        console.log(filteredData);
                        if (filteredData.length > 0) {
                            company.price = filteredData[0].price
                            company.mktCap = filteredData[0].marketCap
                            company.pe = filteredData[0].pe
                            company.yearChange = filteredData[0].yearChange
                            company['1D'] = filteredData[0]['1D'].toFixed(2) +'%'
                            company['5D'] = filteredData[0]['5D'].toFixed(2) + '%'
                            company['1M'] = filteredData[0]['1M'].toFixed(2) + '%'
                            company['3M'] = filteredData[0]['3M'].toFixed(2) + '%'
                            company['6M'] = filteredData[0]['6M'].toFixed(2) + '%'
                            company['ytd'] = filteredData[0]['ytd'].toFixed(2) + '%'
                            company['1Y'] = filteredData[0]['1Y'].toFixed(2) + '%'
                            company['3Y'] = filteredData[0]['3Y'].toFixed(2) + '%'
                            company['5Y'] = filteredData[0]['5Y'].toFixed(2) + '%'
                            company['10Y'] = filteredData[0]['10Y'].toFixed(2) + '%'
                            company['max'] = filteredData[0]['max'].toFixed(2) + '%'
                        } else {
                            company.price = 0
                            company.mktCap = 0.0
                            company.pe = 0.0
                            company.yearChange = 0
                            company['1D'] = '0%'
                            company['5D'] = '0%'
                            company['1M'] = '0%'
                            company['3M'] = '0%'
                            company['6M'] = '0%'
                            company['ytd'] = '0%'
                            company['1Y'] = '0%'
                            company['3Y'] = '0%'
                            company['5Y'] = '0%'
                            company['10Y'] = '0%'
                            company['max'] = '0%'
                        }
                    });
                    console.log(companies);
                    setCompaniesTableData(companies);
                    setDisplayScreenTable(true);
                }
                // updatedCompaniesData.push(item)
            })
            .catch((err) => {
                console.log(err);
            });

        // console.log(companies.companies_data.symbol);
    };

    const onSubmitHandler = async (event) => {
        if (event != null) {
            event.preventDefault();
        }
        console.log(tableContent)
        var newEfficiency = [
            {
                id: 'company_name',
                label: 'Company',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'exchange',
                label: 'Exchange',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'sector',
                label: 'Sector',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'industry',
                label: 'Industry',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'country',
                label: 'Country',
                isValueLink: false,
                isDropDown: false,
            }
            ]
        var newProfability = [
            {
                id: 'company_name',
                label: 'Company',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'exchange',
                label: 'Exchange',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'sector',
                label: 'Sector',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'industry',
                label: 'Industry',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'country',
                label: 'Country',
                isValueLink: false,
                isDropDown: false,
            },]
        var newLiquidity = [
            {
                id: 'company_name',
                label: 'Company',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'exchange',
                label: 'Exchange',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'sector',
                label: 'Sector',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'industry',
                label: 'Industry',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'country',
                label: 'Country',
                isValueLink: false,
                isDropDown: false,
            },]
        var newSolvency = [
            {
                id: 'company_name',
                label: 'Company',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'exchange',
                label: 'Exchange',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'sector',
                label: 'Sector',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'industry',
                label: 'Industry',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'country',
                label: 'Country',
                isValueLink: false,
                isDropDown: false,
            },]
        var newValuation = [
            {
                id: 'company_name',
                label: 'Company',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'exchange',
                label: 'Exchange',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'sector',
                label: 'Sector',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'industry',
                label: 'Industry',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'country',
                label: 'Country',
                isValueLink: false,
                isDropDown: false,
            },]
        var newReturn = [
            {
                id: 'company_name',
                label: 'Company',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'exchange',
                label: 'Exchange',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'sector',
                label: 'Sector',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'industry',
                label: 'Industry',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'country',
                label: 'Country',
                isValueLink: false,
                isDropDown: false,
            },]
        var newAll = [
            {
                id: 'company_name',
                label: 'Company',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'exchange',
                label: 'Exchange',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'sector',
                label: 'Sector',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'industry',
                label: 'Industry',
                isValueLink: false,
                isDropDown: false,
            },
            {
                id: 'country',
                label: 'Country',
                isValueLink: false,
                isDropDown: false,
            },]
        tableContent.forEach((element) => {
            console.log(element.category)
            var elementName=''
            if(periodFilter!='1'){
                elementName = 'Avg ' + element.metric +' ( '+periodFilter+'yr )'
            }
            else{
                elementName = element.metric + ' Yr-1'
            }
            if (element.category =='Efficiency'){

                newEfficiency.push({
                    id: element.metric,
                    label: elementName,
                    isValueLink: false,
                    isDropDown: false,
                })
            }
            if (element.category == 'Profitability') {

                newProfability.push({
                    id: element.metric,
                    label: elementName,
                    isValueLink: false,
                    isDropDown: false,
                })
            }
            if (element.category == 'Valuation') {

                newValuation.push({
                    id: element.metric,
                    label: elementName,
                    isValueLink: false,
                    isDropDown: false,
                })
            }
            if (element.category == 'Liquidity') {

                newLiquidity.push({
                    id: element.metric,
                    label: elementName,
                    isValueLink: false,
                    isDropDown: false,
                })
            }
            if (element.category == 'Solvency') {

                newSolvency.push({
                    id: element.metric,
                    label: elementName,
                    isValueLink: false,
                    isDropDown: false,
                })
            }

            if (element.category == 'Return') {
                newReturn.push({
                    id: element.metric,
                    label: elementName,
                    isValueLink: false,
                    isDropDown: false,
                })
            }
            newAll.push({
                id: element.metric,
                label: elementName,
                isValueLink: false,
                isDropDown: false,
            })
            
        });

        setAllTableHeadCells((prevState) => {


            return { ...prevState, data: newAll };
        });

        setEfficiencyTableHeadCells((prevState) => {
           

            return { ...prevState, data: newEfficiency };
        });
        setProfibiliyTableHeadCells((prevState) => {


            return { ...prevState, data: newProfability };
        });
        setLiquidityTableHeadCells((prevState) => {


            return { ...prevState, data: newLiquidity };
        });
        setSolvencyTableHeadCells((prevState) => {


            return { ...prevState, data: newSolvency };
        });
        setValuationTableHeadCells((prevState) => {


            return { ...prevState, data: newValuation };
        });

        setReturnTableHeadCells((prevState) => {


            return { ...prevState, data: newReturn };
        });


        // const [profibiliyTableHeadCells, setProfibiliyTableHeadCells] = useState({
        //     data: []
        // });
        // const [liquidityTableHeadCells, setLiquidityTableHeadCells] = useState({
        //     data: []
        // });
        // const [solvencyTableHeadCells, setSolvencyTableHeadCells] = useState({
        //     data: []
        // });
        // const [valuationTableHeadCells, setValuationTableHeadCells] = useState({
        //     data: []
        // });
        setEnableScreenButton(false);
        setShowCompaniesDataProgress(true);
        setDisplayScreenTable(true)
        const body = { filters: tableContent, companies: companiesTableData.map((data) => data.company_name), page: 1, period: periodFilter }
        await restClient.getCompaniesDataWithMetricFilters(body)
            .then((response) => {
                console.log(response)
                var resp = JSON.parse(response.data.companies_data[0])
                var allResp = response.data.companies_all_data
                console.log(resp)
                console.log(allResp)
                // getLivePricesAndMarketCap(response.data.companies_data);
                // setCompaniesCount(response.data.companies_data.length);
                setAllTableData(allResp)
                if ("Efficiency" in resp) {
                    setEffciencyTableData(resp.Efficiency)
                }
                if ("Profitability" in resp) {
                    setProfibilityTableData(resp.Profitability)
                }
                if ("Liquidity" in resp) {
                    setLiquidityTableData(resp.Liquidity)
                }
                if ("Solvency" in resp) {
                    setSolvencyTableData(resp.Solvency)
                }
                if ("Valuation" in resp) {
                    setValuationTableData(resp.Valuation)
                }
                if ("Return" in resp) {
                    setReturnTableData(resp.Return)
                }
                setShowCompaniesDataProgress(false);
            })
            .catch((err) => {
                console.log(err);
                setShowCompaniesDataProgress(false);
            });
    }

    async function getCompanies(industry) {
        setShowCompaniesDataProgress(true);
        setCircularProgress(true);
        const body = { country: countryFilter.map((data => data.country)), exchange: exchangeFilter.map((data => data.exchange)), sector: sectorFilter.map((data => data.sector)), industry: industry.map((data) => data.industry) }
        await restClient.getCompanies(body)
            .then((response) => {
                console.log(response)
                getLivePricesAndMarketCap(response.data.resp_data)
                setCompaniesCount(response.data.resp_data.length);
                setShowCompaniesDataProgress(false);
                setCircularProgress(false);
            })
            .catch((err) => {
                console.log(err);
                setShowCompaniesDataProgress(false);
                setCircularProgress(false);
            });
    }

    async function getCountryDropDowns() {
        await restClient.getAllCountries()
            .then((response) => {
                console.log(response)
                setCountryDropDownValues(response.data.resp_data);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    async function getExchangeDropDownsValues() {
        await restClient.getAllExchanges()
            .then((response) => {
                console.log(response)
                setExchangeDropDownValues(response.data.resp_data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async function getExchangeDropDowns(country) {
        await restClient.getExchangesByCountry(country)
            .then((response) => {
                console.log(response.data.resp_data)
                setExchangeDropDownValues(response.data.resp_data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async function getCityDropDowns(country, exchange) {
        await restClient.getCityByCountryAndExchange(country, exchange)
            .then((response) => {
                console.log(response)
                setCityDropDownValues(response.data.resp_data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async function getSectorDropDowns(exchange) {
        await restClient.getSectorByExchange(exchange)
            .then((response) => {
                console.log(response)
                setSectorDropDownValues(response.data.sectors);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async function getIndustryDropDowns(exchange, sector) {
        await restClient.getIndustryByExchangeSector(exchange, sector)
            .then((response) => {
                console.log(response)
                setIndustryDropDownValues(response.data.industries);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    const handleOnAddRowClick = () => {
        setCounter((prevState) => prevState + 1);
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

    const handleChange = (event, newValue) => {
        if (newValue !== undefined) {
            setValue(newValue);
        }
        if (newValue == 1 || newValue == 8){
            setCompaniesCount(companiesTableData.length)
        }
        if (newValue == 2) {
            setCompaniesCount(profibilityTableData.length)
        }
        if (newValue == 3) {
            setCompaniesCount(effciencyTableData.length)
        }
        if (newValue == 4) {
            setCompaniesCount(liquidityTableData.length)
        }
        if (newValue == 5) {
            setCompaniesCount(solvencyTableData.length)
        }
        if (newValue == 6) {
            setCompaniesCount(valuationTableData.length)
        }
        if (newValue == 7) {
            setCompaniesCount(returnTableData.length)
        }
        if (newValue == 9) {
            setCompaniesCount(allTableData.length)
        }
    };
    const getPerformanceDataHandler = () => {

        async function getIndustryDropDowns(exchange, sector) {
            const companies = companiesTableData.map((company) => company.symbol).join(",")
            await restClient.getIndustryByExchangeSector(companies)
                .then((response) => {
                    console.log(response)
                    setIndustryDropDownValues(response.data.industries);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }
    const categoryInMetricCheck = (category)=>{
        return tableContent.some(obj => obj.category === category);
    }

    const saveScreener = () => {
        console.log('metrics=> ',tableContent)
        console.log('exchange=> ',exchangeFilter)
        console.log('sector=> ',sectorFilter)
        console.log('industry=> ',industryFilter)
        console.log('period=> ',periodFilter)
        setIsDialogOpen2(true)
    }
    const { id } = useParams();

    useEffect(()=>{
        console.log(id)
        const getScreenerById = async(_id) => {
            const body = {
                "id" : _id
            }
            await restClient.getScreener(body)
            .then((response) => {
                console.log(response)
                // setMessage(response.data.authorization_url)
                setTableContent(response.data.screener.metricFilter)
                setExchangeFilter(response.data.screener.exchangeFilter)
                setSectorFilter(response.data.screener.sectorFilter)
                setIndustryFilter(response.data.screener.industryFilter)
                setPeriodFilter(response.data.screener.periodFilter)
                getCompanies(response.data.screener.industryFilter)
                const event = new Event('submit')
                onSubmitHandler(event)
            })
            .catch((err) => {
                console.log(err);
            });
        }
        if (id){
            getScreenerById(id)
        }
    },[])
    return (
        <Grid container>
            <PageInfoBreadCrumbs data={pageLoc} />
            <Grid container
                spacing={1}
                component="form"
                sx={{
                    '& .MuiTextField-root': { ml: 1, minWidth: '20ch' },
                }}>
                <Grid item>
                    {/* <TextField
                        select
                        fullWidth
                        id="countryFilter"
                        label="Country"
                        variant="standard"
                        onChange={setCountryFilterHandler}
                        value={countryFilter}
                    >
                        {countryDropDownValues.map((option, index) => (
                            <MenuItem key={index} value={option.country}>
                                {option.country}
                            </MenuItem>
                        ))}
                    </TextField> */}

                    {/* <Autocomplete
                        limitTags={3}
                        multiple
                        size="small"
                        disablePortal={true}
                        id="countryFilter"
                        getOptionLabel={(option) => option.country}
                        isOptionEqualToValue={(option, value) => option.country === value.country}
                        options={countryDropDownValues}
                        onChange={(event, newValue) => {
                            setCountryFilterHandler(newValue);
                        }}
                        value={countryFilter}
                        sx={{ minWidth: 240, mt: 0.4 }}
                        renderInput={(params) => <TextField SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }} {...params} variant="standard" label="Country" />}
                    /> */}

                </Grid>
                <Grid item>
                    {/* <TextField
                        select
                        fullWidth
                        id="exchangeFilter"
                        label="Exchange"
                        variant="standard"
                        onChange={setExchangeFilterHandler}
                        value={exchangeFilter}
                    >
                        {exchangeDropDownValues.map((option, index) => (
                            <MenuItem key={index} value={option.exchange}>
                                {option.exchange}
                            </MenuItem>
                        ))}
                    </TextField> */}
                    <Autocomplete
                        limitTags={3}
                        multiple
                        size="small"
                        disablePortal={true}
                        id="exchangeFilter"
                        getOptionLabel={(option) => option.exchange}
                        isOptionEqualToValue={(option, value) => option.exchange === value.exchange}
                        options={exchangeDropDownValues}
                        onChange={(event, newValue) => {
                            setExchangeFilterHandler(newValue);
                        }}
                        value={exchangeFilter}
                        sx={{ minWidth: 240, mt: 0.4 }}
                        renderInput={(params) => <TextField SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }} {...params} variant="standard" label="Exchange" />}
                    />
                </Grid>
                <Grid item>
                    {/* <TextField
                        fullWidth
                        select
                        id="cityFilter"
                        label="City"
                        variant="standard"
                        onChange={setCityFilterHandler}
                        value={cityFilter}
                    >
                        {cityDropDownValues.map((option, index) => (
                            <MenuItem key={index} value={option.city}>
                                {option.city}
                            </MenuItem>
                        ))}
                    </TextField> */}
                    {/* <Autocomplete
                        limitTags={3}
                        multiple
                        size="small"
                        disablePortal={true}
                        id="cityFilter"
                        getOptionLabel={(option) => option.city}
                        isOptionEqualToValue={(option, value) => option.city === value.city}
                        options={cityDropDownValues}
                        onChange={(event, newValue) => {
                            setCityFilterHandler(newValue);
                        }}
                        value={cityFilter}
                        sx={{ minWidth: 240, mt: 0.4 }}
                        renderInput={(params) => <TextField SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }} {...params} variant="standard" label="City" />}
                    /> */}
                </Grid>
                <Grid item>
                    {/* <TextField
                        select
                        fullWidth
                        id="sectorFilter"
                        label="Sector"
                        variant="standard"
                        onChange={setSectorFilterHandler}
                        value={sectorFilter}
                    >
                        {sectorDropDownValues.map((option, index) => (
                            <MenuItem key={index} value={option.sector}>
                                {option.sector}
                            </MenuItem>
                        ))}
                    </TextField> */}
                    <Autocomplete
                        limitTags={3}
                        multiple
                        size="small"
                        disablePortal={true}
                        id="sectorFilter"
                        getOptionLabel={(option) => option.sector}
                        isOptionEqualToValue={(option, value) => option.sector === value.sector}
                        options={sectorDropDownValues}
                        onChange={(event, newValue) => {
                            setSectorFilterHandler(newValue);
                        }}
                        value={sectorFilter}
                        sx={{ minWidth: 240, mt: 0.4 }}
                        renderInput={(params) => <TextField SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }} {...params} variant="standard" label="Sector" />}
                    />
                </Grid>
                <Grid item>
                    {/* <TextField
                        select
                        fullWidth
                        id="industryFilter"
                        label="Industry"
                        variant="standard"
                        onChange={setIndustryFilterHandler}
                        value={industryFilter}
                    >
                        {industryDropDownValues.map((option, index) => (
                            <MenuItem key={index} value={option.industry}>
                                {option.industry}
                            </MenuItem>
                        ))}
                    </TextField> */}
                    <Autocomplete
                        limitTags={3}
                        multiple
                        size="small"
                        disablePortal={true}
                        id="industryFilter"
                        getOptionLabel={(option) => option.industry}
                        isOptionEqualToValue={(option, value) => option.industry === value.industry}
                        options={industryDropDownValues}
                        onChange={(event, newValue) => {
                            setIndustryFilterHandler(newValue);
                        }}
                        value={industryFilter}
                        sx={{ minWidth: 240, mt: 0.4 }}
                        renderInput={(params) => <TextField SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }} {...params} variant="standard" label="Industry" />}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        select
                        fullWidth
                        id="periodFilter"
                        label="Period(Year)"
                        variant="standard"
                        onChange={(event) => setPeriodFilter(event.target.value)}
                        value={periodFilter}
                    >
                        {periodDropDownValues.map((option, index) => (
                            <MenuItem key={index} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
            </Grid>
            <Card sx={{ width: '100%', m: 1, position: 'relative' }}>
                <Box sx={{ width: '100%' }}>
                    <Box spacing={1} sx={{ textAlign: 'end', mt: 0.5 }}>
                        <Button id="save" variant="outlined" size="medium" startIcon={<AddIcon />} sx={{marginLeft: 1}} onClick={saveScreener}> Save </Button>
                        <Button id="tweet" variant="outlined" size="medium" startIcon={<AddIcon />} sx={{marginLeft: 1, marginRight : 1}} > Tweet </Button>
                        <Button id="addMetricFilters" onClick={handleOnAddRowClick} variant="outlined" size="medium" startIcon={<AddIcon />}> New Metric Filter </Button>
                        <Button sx={{marginLeft: 1}} id="screenModelButton" type="submit" onClick={onSubmitHandler} variant="contained" size="medium"> Screen </Button>
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
                                        >
                                            {headCell.label}
                                        </StyledTableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableContent.map((row, index) => {
                                    return (
                                        <StyledTableRow
                                            hover
                                            tabIndex={-1}
                                            key={index}
                                            sx={{ ml: 3 }}
                                        >
                                            <StyledTableCell>
                                                {row.category}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {row.metric}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {row.description}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {row.operator}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {row.value}
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
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                {showCircularProgress && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Backdrop
                        sx={{ color: '#fff', position: 'absolute', zIndex: (theme) => theme.zIndex.drawer - 1, opacity: 0.5 }}
                        open={showCircularProgress}
                    >
                        <CircularProgress />
                    </Backdrop>
                </Box>}


                {isDialogOpen && <AddMetricFilterDialog
                    isDialogOpened={isDialogOpen}
                    handleCloseDialog={() => setIsDialogOpen(false)}
                    data={clickedRowData}
                    type={eventType}
                    setTableContent={setTableContent}
                    counter={counter}
                />
                }
                {isDialogOpen2 && <SaveScreener
                    isDialogOpened={isDialogOpen2}
                    handleCloseDialog={() => setIsDialogOpen2(false)}
                    metricFilter={tableContent}
                    exchangeFilter={exchangeFilter}
                    sectorFilter={sectorFilter}
                    industryFilter={industryFilter}
                    periodFilter={periodFilter}

                />
                }
            </Card>
            <Card sx={{ width: '100%', marginTop: 2, m: 1, position: 'relative' }}>
                <TabContext value={value}>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ marginLeft: 4, marginTop: 12 }}>
                            <label htmlFor="compainesCount"><strong>Companies: </strong></label>
                            <output name="compainesCount" id="compainesCount">{compainesCount}</output>
                        </div>
                        <Tabs
                            variant="scrollable"
                            scrollButtons
                            allowScrollButtonsMobile
                            onChange={handleChange} aria-label="screener-tabs"
                            value={value}
                            TabIndicatorProps={{
                                style: {
                                    backgroundColor: "blue", height: 3,
                                    borderRadius: "5px" } // Change this to your desired color
                            }}
                        >
                           
                            <Tab label="Overview" value="1" title="displays the result of macro criteria"/>
                           
                            
                            {categoryInMetricCheck('Profitability')?
                                <Tab label="Profitability" value="2" title="displays the companies matching the macro criterias and Profitability criterias"  />
                            :null}
                            {categoryInMetricCheck('Efficiency') ?
                                <Tab label="Efficiency" value="3" title="displays the companies matching the macro criterias and Efficiency criterias" />
                                : null}
                            {categoryInMetricCheck('Liquidity') ?
                                <Tab label="Liquidity" value="4" title="displays the companies matching the macro criterias and Liquidity criterias" />
                                : null}
                            {categoryInMetricCheck('Solvency') ?
                                <Tab label="Solvency" value="5" title="displays the companies matching the macro criterias and Solvency criterias" />
                                : null}
                            {categoryInMetricCheck('Valuation') ?
                                <Tab label="Valuation" value="6" title="displays the companies matching the macro criterias and Valuation criterias" />
                                : null}
                            {categoryInMetricCheck('Return') ?
                                <Tab label="Return" value="7" title="displays the companies matching the macro criterias and Return criterias" />
                                : null}
                            <Tab label="Performance" value="8" title="displays the companies matching the macro criterias and Performance criterias" />
                            <Tab label="All Criterias" value="9" title="displays the companies matching all the criterias" />

                        </Tabs>
                    </div>
                    <TabPanel sx={{ width: '100%', padding: 0 }} value="1">
                        {
                            displayScreenTable &&
                            <Card sx={{ width: '100%', position: 'relative' }}>
                                <CustomizedTable headCells={companyTableHeadCells} tableRows={companiesTableData} />
                                {showCompaniesDataProgress && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Backdrop
                                        sx={{ color: '#fff', position: 'absolute', zIndex: (theme) => theme.zIndex.drawer - 1, opacity: 0.5 }}
                                        open={showCompaniesDataProgress}
                                    >
                                        <CircularProgress />
                                    </Backdrop>
                                </Box>}
                            </Card>
                        }
                    </TabPanel>
                    {categoryInMetricCheck('Profitability') ?
                        <TabPanel sx={{ width: '100%', padding: 0 }}  value="2">
                            {
                                profibilityTableData &&
                                <Card sx={{ width: '100%', position: 'relative' }}>
                                    <CustomizedTable headCells={profibiliyTableHeadCells} tableRows={profibilityTableData} />
                                    {showCompaniesDataProgress && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <Backdrop
                                            sx={{ color: '#fff', position: 'absolute', zIndex: (theme) => theme.zIndex.drawer - 1, opacity: 0.5 }}
                                            open={showCompaniesDataProgress}
                                        >
                                            <CircularProgress />
                                        </Backdrop>
                                    </Box>}
                                </Card>
                            }
                        </TabPanel>
                        : null}

                    {categoryInMetricCheck('Efficiency') ?
                        <TabPanel sx={{ width: '100%', padding: 0 }}  value="3">
                            {
                                effciencyTableData &&
                                <Card sx={{ width: '100%', position: 'relative' }}>
                                    <CustomizedTable headCells={efficiencyTableHeadCells} tableRows={effciencyTableData} />
                                    {showCompaniesDataProgress && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <Backdrop
                                            sx={{ color: '#fff', position: 'absolute', zIndex: (theme) => theme.zIndex.drawer - 1, opacity: 0.5 }}
                                            open={showCompaniesDataProgress}
                                        >
                                            <CircularProgress />
                                        </Backdrop>
                                    </Box>}
                                </Card>
                            }
                        </TabPanel>
                        : null}
                    
                    {categoryInMetricCheck('Liquidity') ?
                        <TabPanel sx={{ width: '100%', padding: 0 }} value="4">
                            {
                                liquidityTableData &&
                                <Card sx={{ width: '100%', position: 'relative' }}>
                                    <CustomizedTable headCells={liquidityTableHeadCells} tableRows={liquidityTableData} />
                                    {showCompaniesDataProgress && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <Backdrop
                                            sx={{ color: '#fff', position: 'absolute', zIndex: (theme) => theme.zIndex.drawer - 1, opacity: 0.5 }}
                                            open={showCompaniesDataProgress}
                                        >
                                            <CircularProgress />
                                        </Backdrop>
                                    </Box>}
                                </Card>
                            }
                        </TabPanel>
                        : null}
                    
                    {categoryInMetricCheck('Solvency') ?
                        <TabPanel sx={{ width: '100%', padding: 0 }} value="5">
                            {
                                solvencyTableData &&
                                <Card sx={{ width: '100%', position: 'relative' }}>
                                    <CustomizedTable headCells={solvencyTableHeadCells} tableRows={solvencyTableData} />
                                    {showCompaniesDataProgress && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <Backdrop
                                            sx={{ color: '#fff', position: 'absolute', zIndex: (theme) => theme.zIndex.drawer - 1, opacity: 0.5 }}
                                            open={showCompaniesDataProgress}
                                        >
                                            <CircularProgress />
                                        </Backdrop>
                                    </Box>}
                                </Card>
                            }
                        </TabPanel>
                        : null}
                    
                    {categoryInMetricCheck('Valuation') ?
                        <TabPanel sx={{ width: '100%', padding: 0 }} value="6">
                            {
                                valuationTableData &&
                                <Card sx={{ width: '100%', position: 'relative' }}>
                                    <CustomizedTable headCells={valuationTableHeadCells} tableRows={valuationTableData} />
                                    {showCompaniesDataProgress && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <Backdrop
                                            sx={{ color: '#fff', position: 'absolute', zIndex: (theme) => theme.zIndex.drawer - 1, opacity: 0.5 }}
                                            open={showCompaniesDataProgress}
                                        >
                                            <CircularProgress />
                                        </Backdrop>
                                    </Box>}
                                </Card>
                            }
                        </TabPanel>
                        : null}
                    {categoryInMetricCheck('Return') ?
                        <TabPanel sx={{ width: '100%', padding: 0 }} value="7">
                            {
                                returnTableData &&
                                <Card sx={{ width: '100%', position: 'relative' }}>
                                    <CustomizedTable headCells={returnTableHeadCells} tableRows={returnTableData} />
                                    {showCompaniesDataProgress && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <Backdrop
                                            sx={{ color: '#fff', position: 'absolute', zIndex: (theme) => theme.zIndex.drawer - 1, opacity: 0.5 }}
                                            open={showCompaniesDataProgress}
                                        >
                                            <CircularProgress />
                                        </Backdrop>
                                    </Box>}
                                </Card>
                            }
                        </TabPanel>
                        : null}
                    
                    <TabPanel sx={{ width: '100%', padding: 0 }} value="8">
                        {
                            displayScreenTable &&
                            <Card sx={{ width: '100%', position: 'relative' }}>
                                <CustomizedTable headCells={performanceTableHeadCells} tableRows={companiesTableData} />
                                {showCompaniesDataProgress && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Backdrop
                                        sx={{ color: '#fff', position: 'absolute', zIndex: (theme) => theme.zIndex.drawer - 1, opacity: 0.5 }}
                                        open={showCompaniesDataProgress}
                                    >
                                        <CircularProgress />
                                    </Backdrop>
                                </Box>}
                            </Card>
                        }
                    </TabPanel>
                    <TabPanel sx={{ width: '100%', padding: 0 }} value="9">
                        {
                            displayScreenTable &&
                            <Card sx={{ width: '100%', position: 'relative' }}> 
                                <CustomizedTable headCells={allTableHeadCells} tableRows={allTableData} />
                                {showCompaniesDataProgress && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Backdrop
                                        sx={{ color: '#fff', position: 'absolute', zIndex: (theme) => theme.zIndex.drawer - 1, opacity: 0.5 }}
                                        open={showCompaniesDataProgress}
                                    >
                                        <CircularProgress />
                                    </Backdrop>
                                </Box>}
                            </Card>
                        }
                    </TabPanel>
                </TabContext>
            </Card>
        </Grid >
    )
}
export default DAScreener;
