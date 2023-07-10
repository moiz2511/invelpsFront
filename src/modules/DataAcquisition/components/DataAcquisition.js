import React, { useEffect, useState } from 'react'

import { Backdrop, Box, Button, Chip, CircularProgress, Grid, MenuItem, Tooltip } from '@mui/material';

import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import useMediaQuery from '@mui/material/useMediaQuery';
import Popper from '@mui/material/Popper';
import { useTheme, styled } from '@mui/material/styles';
import { VariableSizeList } from 'react-window';
import Typography from '@mui/material/Typography';
import DataAcquisitionService from '../services/DataAcquisitionService';
import PageInfoBreadCrumbs from '../../Core/components/Layout/PageInfoBreadCrumbs';

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

    // if (dataSet.hasOwnProperty('group')) {
    //     return (
    //         <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
    //             {dataSet.group}
    //         </ListSubheader>
    //     );
    // }

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
        // if (child.hasOwnProperty('group')) {
        //     return 48;
        // }

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

const DataAcquisitionAPi = () => {
    let pageLoc = window.location.pathname;
    const restService = new DataAcquisitionService();
    const [exchangeFilter, setExchangeFilter] = useState({ exchange: "All" });
    const [sectorFilter, setSectorFilter] = useState({ sector: "All" });
    const [industryFilter, setIndustryFilter] = useState({ industry: "All" });
    const [companiesFilter, setCompaniesFilter] = useState([]);
    const [typeFilter, setTypeFilter] = useState({ type: "All" });
    const [nYearsFilter, setNYearsFilter] = useState("1");
    const [showCircularProgress, setCircularProgress] = useState(false);

    const [exchangeDropDownValues, setExchangeDropDownValues] = useState([{ exchange: "All" }]);
    const [sectorDropDownValues, setSectorDropDownValues] = useState([{ sector: "All" }]);
    const [industryDropDownValues, setIndustryDropDownValues] = useState([{ industry: "All" }]);
    const [companiesDropDownValues, setCompaniesDropDownValues] = useState([]);
    const [typeDropDownValues, setTypeDropDownValues] = useState([{ type: "All" }]);
    const [nYearsDropDownValues, setNYearsDropDownValues] = useState([{ limit: "1" }]);

    const getDataAcquisitionTypes = async () => {
        await restService.getDataAcquisitionTypes()
            .then((response) => {
                setTypeDropDownValues([{ type: "All" }].concat(response.data.dataTypes));
            })
            .catch((err) => {
                console.log(err);
            });

    }

    const getExchangesDropDown = async () => {
        await restService.getExchangeValues()
            .then((response) => {
                setExchangeDropDownValues([{ exchange: "All" }].concat(response.data.exchanges));
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const getSectorsDropDownByExchange = async (exchange) => {
        await restService.GetSectorsByExchnage({ exchange })
            .then((response) => {
                setSectorDropDownValues([{ sector: "All" }].concat(response.data.sectors));
            })
            .catch((err) => {
                console.log(err);
            });

    }

    const getIndustriesDropDownBySector = async (sector) => {
        await restService.getIndustryByExchangeAndSector({ exchange: exchangeFilter.exchange, sector })
            .then((response) => {
                setIndustryDropDownValues([{ industry: "All" }].concat(response.data.industries));
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const getCompaniesDropDownByIndustry = async (industry) => {
        await restService.getCompaniesByIndustryExchangeAndSector({ exchange: exchangeFilter.exchange, sector: sectorFilter.sector, industry })
            .then((response) => {
                setCompaniesDropDownValues(response.data.companies);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const getYearLimitsDropDown = async () => {
        await restService.getDataAcquisitionYearLimits()
            .then((response) => {
                setNYearsDropDownValues(response.data.yearLimits);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setCircularProgress(true);
        console.log({ companies: companiesFilter.map((item) => item.symbol), type: typeFilter.type, years: nYearsFilter })
        await restService.dataAcquisitionApi({ companies: companiesFilter.map((item) => item.symbol), type: typeFilter.type, years: nYearsFilter })
            .then((response) => {
                setCircularProgress(false);
                alert("Data Acquisition Successfull");
            })
            .catch((err) => {
                setCircularProgress(false);
                alert("Data Acquisition Failed", err);
                console.log(err);
            });
    }

    useEffect(() => {
        getExchangesDropDown();
        getDataAcquisitionTypes();
        getSectorsDropDownByExchange("All");
        getIndustriesDropDownBySector("All");
        getCompaniesDropDownByIndustry("All");
        getYearLimitsDropDown();
    }, []);

    return (
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

                <Grid item sx={{ marginTop: 0.75 }}>
                    <Autocomplete
                        size="small"
                        disablePortal
                        id="exchangeFilter"
                        getOptionLabel={(option) => option.exchange}
                        isOptionEqualToValue={(option, value) => option.exchange === value.exchange}
                        options={exchangeDropDownValues}
                        onChange={(event, newValue) => {
                            setExchangeFilter(newValue);
                            getSectorsDropDownByExchange(newValue.exchange);
                        }}
                        value={exchangeFilter}
                        sx={{ minWidth: 240, mt: 0.4 }}
                        renderInput={(params) => <TextField
                            SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }}
                            {...params} variant="standard" label="Exchange" />}
                    />
                </Grid>

                <Grid item sx={{ marginTop: 0.75 }}>
                    <Autocomplete
                        size="small"
                        disablePortal
                        id="sectorFilter"
                        getOptionLabel={(option) => option.sector}
                        isOptionEqualToValue={(option, value) => option.sector === value.sector}
                        options={sectorDropDownValues}
                        onChange={(event, newValue) => {
                            setSectorFilter(newValue);
                            getIndustriesDropDownBySector(newValue.sector);
                        }}
                        value={sectorFilter}
                        sx={{ minWidth: 240, mt: 0.4 }}
                        renderInput={(params) => <TextField
                            SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }}
                            {...params} variant="standard" label="Sector" />}
                    />
                </Grid>

                <Grid item sx={{ marginTop: 0.75 }}>
                    <Autocomplete
                        size="small"
                        disablePortal
                        id="industryFilter"
                        getOptionLabel={(option) => option.industry}
                        isOptionEqualToValue={(option, value) => option.industry === value.industry}
                        options={industryDropDownValues}
                        onChange={(event, newValue) => {
                            setIndustryFilter(newValue);
                            getCompaniesDropDownByIndustry(newValue.industry);
                        }}
                        value={industryFilter}
                        sx={{ minWidth: 240, mt: 0.4 }}
                        renderInput={(params) => <TextField
                            SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }}
                            {...params} variant="standard" label="Industry" />}
                    />
                </Grid>
                <Grid item sx={{ marginTop: 1.2 }}>
                    <Autocomplete
                        limitTags={1}
                        multiple
                        size="small"
                        disablePortal
                        id="companiesFilter"
                        sx={{ width: 240 }}
                        disableListWrap
                        disableCloseOnSelect
                        getOptionLabel={(option) => option.company_name}
                        isOptionEqualToValue={(option, value) => option.company_name === value.company_name}
                        PopperComponent={StyledPopper}
                        ListboxComponent={ListboxComponent}
                        options={companiesDropDownValues}
                        onChange={(event, newValue) => {
                            setCompaniesFilter(newValue)
                        }}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Tooltip key={index} title={option.company_name}>
                                    <Chip size='small' sx={{ width: "65%" }} variant="contained" label={option.company_name} {...getTagProps({ index })} />
                                </Tooltip>
                            ))
                        }
                        value={companiesFilter}
                        renderInput={(params) => <TextField
                            {...params} label="Companies" variant='standard' />}
                        renderOption={(props, option) => [props, option]}
                    />
                </Grid>
                <Grid item sx={{ marginTop: 0.75 }}>
                    <Autocomplete
                        size="small"
                        disablePortal
                        id="type"
                        options={typeDropDownValues}
                        getOptionLabel={(option) => option.type}
                        isOptionEqualToValue={(option, value) => option.type === value.type}
                        onChange={(event, newValue) => {
                            setTypeFilter(newValue);
                        }}
                        value={typeFilter}
                        sx={{ minWidth: 240, mt: 0.4 }}
                        renderInput={(params) => <TextField
                            SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }}
                            {...params} variant="standard" label="Type" />}
                    />
                </Grid>
                <Grid item sx={{ marginTop: 0.75 }}>
                    <TextField
                        select
                        id="numYears"
                        label="Number Of Years"
                        variant="standard"
                        onChange={(event) => setNYearsFilter(event.target.value)}
                        value={nYearsFilter}
                    >
                        {nYearsDropDownValues.map((item) => (
                            <MenuItem key={item.limit} value={item.limit}>
                                {item.limit}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item sx={{ marginTop: 0.75 }}>
                    <Button id="dataAcquisitionSubmit" type="submit" variant="contained" size="medium" onClick={onSubmitHandler} sx={{ mt: 1.5 }} > Submit </Button>
                </Grid>
                {showCircularProgress && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Backdrop
                        sx={{ color: '#fff', position: 'absolute', zIndex: (theme) => theme.zIndex.drawer - 1, opacity: 0.5 }}
                        open={showCircularProgress}
                    >
                        <CircularProgress />
                    </Backdrop>
                </Box>}
            </Grid>
        </Box>
    );
}

export default DataAcquisitionAPi;
