import { TextField, Button, MenuItem, Grid, Card, Backdrop, CircularProgress, Box } from '@mui/material';
import React, { useEffect, useState } from 'react'
import ScreenModelService from '../services/ScreenModelService';
import CustomizedTable from '../../UIUtils/Table/TableContentComponent';
import PageInfoBreadCrumbs from '../../Core/components/Layout/PageInfoBreadCrumbs';
import { useSearchParams } from 'react-router-dom';

const headCells = {
    data: [
        {
            id: 'strategy',
            label: 'Strategy',
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
            id: 'operator',
            label: 'Operator',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: 'range',
            label: 'Range',
            isValueLink: false,
            isDropDown: false,
        },
        {
            id: 'period',
            label: 'Period (year)',
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

const ScreenModel = () => {
    let pageLoc = window.location.pathname;
    const [searchParams] = useSearchParams();
    const restClient = new ScreenModelService();
    let styleValue = searchParams.get("style") ? searchParams.get("style") : "";
    let mentorValue = searchParams.get("mentor") ? searchParams.get("mentor") : "";
    let screenModel = searchParams.get("model", "") ? searchParams.get("model") : "";
    const [stylesDropDownValues, setStylesDropDownValues] = useState([]);
    const [mentorDropDownValues, setMentorDropDownValues] = useState([]);
    const [screenModelDropDownValues, setscreenModelDropDownValues] = useState([]);
    const [stylesFilter, setStylesFilter] = useState(styleValue);
    const [mentorFilter, setMentorFilter] = useState(mentorValue);
    const [screenModelFilter, setScreenModelFilter] = useState(screenModel);
    const [tableContent, setTableContent] = useState([]);
    const [displayScreenTable, setDisplayScreenTable] = useState(false);
    const [companiesTableData, setCompaniesTableData] = useState([]);
    const [compainesCount, setCompaniesCount] = useState(0);
    const [showCircularProgress, setCircularProgress] = useState(false);
    const [enableScreenButton, setEnableScreenButton] = useState(false);
    const [showCompaniesDataProgress, setShowCompaniesDataProgress] = useState(false);

    useEffect(() => {
        let screenButton = 0
        getStylesDropDown();
        if (styleValue != null && styleValue !== "" && styleValue.toLowerCase() !== "all") {
            getMentorDropDownByStyle(styleValue);
            screenButton ++;
        }
        if (mentorValue != null && mentorValue !== "" && mentorValue.toLowerCase() !== "all") {
            getScreenModelDropDownByMentor(mentorValue);
            screenButton ++;
        }
        if (screenModel != null && screenModel !== "" && screenModel.toLowerCase() !== "all") {
            setEnableScreenButton(screenButton == 2);
            setScreenModelFilterHandler(screenModel);
        }
    }, []);

    const setStylesFilterHandler = (event) => {
        setStylesFilter(event.target.value);
        setMentorFilter("")
        setScreenModelFilter("")
        getMentorDropDownByStyle(event.target.value);
        setDisplayScreenTable(false);
        setCompaniesTableData([]);
        setCompaniesCount(0);
    }

    const setMentorFilterHandler = (event) => {
        setMentorFilter(event.target.value);
        setScreenModelFilter("")
        getScreenModelDropDownByMentor(event.target.value);
        setDisplayScreenTable(false);
        setCompaniesTableData([]);
        setCompaniesCount(0);
    }
    const getLivePricesAndMarketCap = async (companies) => {
        // let data = JSON.parse(companies);
        console.log(companies);
        let respData = []
        let data = companies.map(company => company.symbol);
        console.log(data.join(","));
        await restClient.getCompaniesQuote(data.join(","))
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
                        } else {
                            company.price = 0
                            company.mktCap = 0.0
                            company.pe = 0.0
                        }
                    });
                    console.log(companies);
                    setCompaniesTableData(companies);
                }
                // updatedCompaniesData.push(item)
            })
            .catch((err) => {
                console.log(err);
            });

        // console.log(companies.companies_data.symbol);
    };
    // const getLivePricesAndMarketCap = async (companies) => {
    //     const reqData = companies.map(async (item) => {
    //         let price = "";
    //         let mktCap = "";
    //         await restClient.getCompanyStockPrice(item.symbol)
    //             .then((response) => {
    //                 console.log(response)
    //                 if (response.data.length > 0) {
    //                     price = response.data[0].price
    //                 } else {
    //                     price = 0
    //                 }
    //                 // updatedCompaniesData.push(item)
    //             })
    //             .catch((err) => {
    //                 console.log(err);
    //             });
    //         await restClient.getCompanyMktCap(item.symbol)
    //             .then((response) => {
    //                 console.log(response)
    //                 if (response.data.length > 0) {
    //                     mktCap = response.data[0].marketCap
    //                 } else {
    //                     mktCap = 0.0
    //                 }
    //                 // updatedCompaniesData.push(item)
    //             })
    //             .catch((err) => {
    //                 console.log(err);
    //             });
    //         item.price = price
    //         item.marketCap = mktCap
    //     })
    //     return Promise.all(reqData).then(() => {
    //         console.log(companies)
    //         setCompaniesTableData(companies);
    //         console.log(companies)
    //     });
    // }

    const setScreenModelFilterHandler = async (modelVal) => {
        setScreenModelFilter(modelVal);
        setDisplayScreenTable(false);
        setCompaniesTableData([]);
        setCompaniesCount(0);
        setCircularProgress(true);
        const body = { search_strategy: modelVal, page: 1 }
        await restClient.getScreenModelsData(body)
            .then((response) => {
                console.log(response)
                setTableContent(response.data.get_data);
                setCircularProgress(false);
                setEnableScreenButton(true)
            })
            .catch((err) => {
                console.log(err);
                setCircularProgress(false);
            });
    }

    const onSubmitHandler = async (event) => {
        if (event != null) {
            event.preventDefault();
        }
        setEnableScreenButton(false);
        setShowCompaniesDataProgress(true);
        setDisplayScreenTable(true)       
        const body = { filters: tableContent, page: 1 }
        await restClient.getCompaniesByScreenModels(body)
            .then((response) => {
                console.log(response)
                getLivePricesAndMarketCap(response.data.companies_data);
                setCompaniesCount(response.data.companies_data.length);
                setShowCompaniesDataProgress(false);
            })
            .catch((err) => {
                console.log(err);
                setShowCompaniesDataProgress(false);
            });
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

    async function getScreenModelDropDownByMentor(mentor) {
        const body = { "mentor": mentor }
        await restClient.getScreenModelByModel(body)
            .then((response) => {
                console.log(response)
                setscreenModelDropDownValues(response.data.strategyNameFilter);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <Grid container>
            <PageInfoBreadCrumbs data={pageLoc} />
            <Grid container
                spacing={1}
                component="form"
                sx={{
                    '& .MuiTextField-root': { ml: 1, minWidth: '20ch' },
                }}
                noValidate
                autoComplete="off">

                <Grid item>
                    <TextField
                        select
                        id="styleFilter"
                        label="Style"
                        variant="standard"
                        onChange={setStylesFilterHandler}
                        value={stylesFilter}
                    >
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
                        {mentorDropDownValues.map((option, index) => (
                            <MenuItem key={index} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        id="screenModel"
                        label="Screen Model"
                        variant="standard"
                        onChange={(event) => setScreenModelFilterHandler(event.target.value)}
                        value={screenModelFilter}
                    >
                        {screenModelDropDownValues.map((option, index) => (
                            <MenuItem key={index} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item sx={{ mt: 1.5 }}>
                    <Button disabled={!enableScreenButton} id="screenModelButton" type="submit" onClick={onSubmitHandler} variant="contained" size="medium"> Screen </Button>
                </Grid>
            </Grid>
            <Card sx={{ width: '100%', m: 1, position: 'relative' }}>
                <CustomizedTable headCells={headCells} tableRows={tableContent} />
                {showCircularProgress && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Backdrop
                        sx={{ color: '#fff', position: 'absolute', zIndex: (theme) => theme.zIndex.drawer - 1, opacity: 0.5 }}
                        open={showCircularProgress}
                    >
                        <CircularProgress />
                    </Backdrop>
                </Box>}
            </Card>
            {
                displayScreenTable && <Card sx={{ width: '100%', m: 1, position: 'relative' }}>
                    <label htmlFor="compainesCount"><strong>Companies: </strong></label>
                    <output name="compainesCount" id="compainesCount">{compainesCount}</output>
                    <CustomizedTable headCells={companyTableHeadCells} tableRows={companiesTableData} data={{ style: stylesFilter, mentor: mentorFilter, screenModel: screenModelFilter }} />
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
        </Grid >
    )
}
export default ScreenModel;
