import { TextField, Button, MenuItem, Grid, Card, Box, Backdrop, CircularProgress, Tooltip, Chip, CardContent } from '@mui/material';
import React, { useEffect, useState } from 'react'
import CustomizedTable from '../../UIUtils/Table/TableContentComponent';
import CompaniesService from '../services/CompaniesService';
import { useSearchParams } from 'react-router-dom';
import PageInfoBreadCrumbs from '../../Core/components/Layout/PageInfoBreadCrumbs';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import Popper from '@mui/material/Popper';
import { useTheme, styled } from '@mui/material/styles';
import { VariableSizeList } from 'react-window';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import AnalysisModelService from '../../Context/services/AnalysisModelService';
import ProfileDetails from './ProfileDetails';
import ErrorCard from '../../Core/components/common/ErrorCard';

const inistitutionalHolderTableColumns = {
    data: [
        {
            id: 'symbol',
            label: 'Symbol',
        },
        {
            id: 'holder',
            label: 'Holder',
        },
        {
            id: 'shares',
            label: 'Shares',
        },
        {
            id: 'dateReported',
            label: 'DateReported',
        },
        {
            id: 'change',
            label: 'Change',
        },
    ]
};

const mutualFundHolderTableColumns = {
    data: [
        {
            id: 'symbol',
            label: 'Symbol',
        },
        {
            id: 'holder',
            label: 'Holder',
        },
        {
            id: 'shares',
            label: 'Shares',
        },
        {
            id: 'dateReported',
            label: 'DateReported',
        },
        {
            id: 'change',
            label: 'Change',
        },
        {
            id: 'weightPercent',
            label: 'WeightPercent',
        },
    ]
};

const stockPeersTableColumns = {
    data: [
        {
            id: 'symbol',
            label: 'Symbol',
        },
        {
            id: 'peersList',
            label: 'PeersList',
        }
    ]
};

const insiderTradingTableColumns = {
    data: [
        {
            id: 'transactionDate',
            label: 'Transaction Date',
        },
        {
            id: 'transactionType',
            label: 'Type',
        },
        {
            id: 'securitiesTransacted',
            label: 'Volume',
        },
        {
            id: 'price',
            label: 'Price',
        },
        {
            id: 'value',
            label: 'Value',
        },
        {
            id: 'reportingName',
            label: 'Name',
        },
        {
            id: 'typeOfOwner',
            label: 'Title',
        },
        {
            id: 'securitiesOwned',
            label: 'Shares owned',
        }
    ]
};

const keyExecutivesTableColumns = {
    data: [
        {
            id: 'name',
            label: 'Name',
        },
        {
            id: 'title',
            label: 'Title',
        },
        {
            id: 'pay',
            label: 'Pay',
        },
        {
            id: 'titleSince',
            label: 'TitleSince',
        },
        {
            id: 'yearBorn',
            label: 'YearBorn',
        }

    ]
}

// const tableNameDropDownValues = [
//     { "option": "institutional-holder" },
//     { "option": "mutual-fund-holder" },
//     { "option": "stock_peers" },
//     { "option": "profile" },
//     { "option": "key-executives" }
// ]


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

const CompanyProfile = () => {
    let pageLoc = window.location.pathname;
    // const params = useParams();
    const [searchParams] = useSearchParams();
    let company = searchParams.get("company", "") ? searchParams.get("company") : "";
    let exchange = searchParams.get("exchange", "") ? searchParams.get("exchange") : "";
    // let table = searchParams.get("table") ? searchParams.get("table") : "";
    const restClient = new CompaniesService();
    const restClientAnalysisModel = new AnalysisModelService();
    const [companiesDropDownValues, setCompaniesDropDownValues] = useState([{ company_name: company }]);
    const [companyFilter, setCompanyFilter] = useState({ company_name: company });
    // const [tableNameFilter, setTableNameFilter] = useState(table);
    const [responseData, setResponseData] = useState({});
    const [enableSubmit, setEnableSubmit] = useState(false);
    const [showCircularProgress, setCircularProgress] = useState(false);
    const [exchangeFilter, setExchangeFilter] = useState(exchange);
    const [exchangeDropDownValues, setExchangeDropDownValues] = useState([]);
    const [showExchangeProp, setShowExchangeProp] = useState(false);
    const [onNoResults, setOnNoResults] = useState(false);

    useEffect(() => {
        getCompaniesDropDown();
        if (company != null && company !== "") {
            getExchangesByCompanyName(company);
        }
    }, []);

    const submitRequest = async () => {
        await restClient.getProfileDataByCompanyAndTableName(companyFilter.company_name, exchangeFilter)
            .then((response) => {
                if (response.data.resp_data.profile.length <= 0) {
                    setOnNoResults(true);
                }
                setResponseData(response.data.resp_data);
                setCircularProgress(false);
            })
            .catch((err) => {
                console.log(err);
                setCircularProgress(false);
                setOnNoResults(true);
            });
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setOnNoResults(false);
        setCircularProgress(true);
        setResponseData({});
        setTimeout(() => { submitRequest(); }, 2000);
    }

    async function getCompaniesDropDown() {
        await restClient.getAllCompanies()
            .then((response) => {
                setCompaniesDropDownValues(response.data.companies_data);
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
                    setEnableSubmit(true);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <Grid container>
            <PageInfoBreadCrumbs data={pageLoc} />
            <Grid container>
                <Box sx={{ marginLeft: 1 }}>
                    <Grid container
                        spacing={1}
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { minWidth: '25ch' },
                        }}
                        noValidate
                        autoComplete="off">
                        <Grid item sx={{ marginTop: 0.5 }}>
                            {/* <div style={{ width: '240px', fontSize: '12px', fontWeight: 'bold' }}>
                                <label style={{ fontSize: '11px', fontWeight: 'normal' }} htmlFor='companiesFilter'>Company</label>
                                <Select
                                    closeMenuOnSelect={true}
                                    placeholder='Select Company'
                                    id="companiesFilter"
                                    components={{ MenuList }}
                                    options={companiesDropDownValues}
                                    value={companyFilter}
                                    onChange={setCompanyFilterHandler}
                                />
                            </div> */}
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
                                    setEnableSubmit(false);
                                    setOnNoResults(false);
                                    // setSubmitClicked(false);
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
                        <Grid item>
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
                        {/* <Grid item>
                            <TextField
                                select
                                id="tableNameFilter"
                                label="Table"
                                variant="standard"
                                onChange={setTableNameFilterHandler}
                                value={tableNameFilter}
                            >
                                <MenuItem key="default-value" value="">
                                    -- SELECT TABLE --
                                </MenuItem>
                                {tableNameDropDownValues.map((item) => (
                                    <MenuItem key={item.option} value={item.option}>
                                        {item.option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid> */}
                        <Grid item>
                            <Button disabled={!enableSubmit} id="profilePageButton" type="submit" variant="contained" onClick={onSubmitHandler} size="medium" sx={{ mt: 1.5 }} > Submit </Button>
                        </Grid>
                    </Grid>
                </Box>
                {responseData?.profile && responseData.profile.length > 0 && <ProfileDetails companyDetails={responseData.profile[0]} />}
                {responseData?.keyExecutives && responseData?.profile.length > 0 && <Card elevation={3} sx={{ width: '100%', m: 1, position: 'relative' }}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Key executives
                        </Typography>
                        <CustomizedTable headCells={keyExecutivesTableColumns} tableRows={responseData.keyExecutives} />
                    </CardContent>
                </Card>
                }
                {responseData?.insiderTrading && responseData?.profile.length > 0 && <Card elevation={3} sx={{ width: '100%', m: 1, position: 'relative' }}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Stock Insider
                        </Typography>
                        <CustomizedTable headCells={insiderTradingTableColumns} tableRows={responseData.insiderTrading} />
                    </CardContent>

                </Card>
                }
            </Grid>
            {showCircularProgress && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Backdrop
                    sx={{ color: '#fff', position: 'absolute', zIndex: (theme) => theme.zIndex.drawer - 1, opacity: 0.5 }}
                    open={showCircularProgress}
                >
                    <CircularProgress />
                </Backdrop>
            </Box>}
            {onNoResults &&
                <ErrorCard textToDisplay={`${companyFilter.company_name} Company Profile Not Found`} />
            }
        </Grid>
    )
}

export default CompanyProfile;
