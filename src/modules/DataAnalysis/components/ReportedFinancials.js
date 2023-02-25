import React, { useEffect, useState } from 'react'

import { Backdrop, Box, Button, Card, Chip, CircularProgress, Grid, Tooltip } from '@mui/material';

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
import PageInfoBreadCrumbs from '../../Core/components/Layout/PageInfoBreadCrumbs';
import { useSearchParams } from 'react-router-dom';
import DAReportedFinancialsService from '../services/ReportedFinancialsService';

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
    "reported_income",
    "reported_bsheet",
    "reported_cflow"
]

const DAReportedFinancials = () => {
    let pageLoc = window.location.pathname;
    const [searchParams] = useSearchParams();
    let company = searchParams.get("company", "") ? searchParams.get("company") : "";
    console.log(company);
    const restService = new DAReportedFinancialsService();
    const companiesService = new CompaniesService();
    const [companyFilter, setCompanyFilter] = useState({company_name: company});
    const [tableFilter, setTableFilter] = useState("reported_income");
    const [yearFilter, setYearFilter] = useState("");

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

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        console.log(companyFilter.company_name)
        setTableContentFetched(false);
        setCircularProgress(true);
        await restService.getDAReportedFinancialsData({ company: companyFilter.company_name, table: tableFilter, year: yearFilter })
            .then((response) => {
                setTableContent(response.data.resp_data);
                setTableHeaderColumns({data: response.data.columns});
                setTableContentFetched(true);
                setCircularProgress(false);
            })
            .catch((err) => {
                console.log(err);
                setCircularProgress(false);
            });
    }

    useEffect(() => {
        getCompaniesDropDowns();
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
                                setCompanyFilter(newValue)
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
                                {...params} variant="standard" label="Table" />}
                        />
                    </Grid>
                    <Grid item sx={{ marginTop: 0.75 }}>
                        <TextField
                            id="yearFilter"
                            label="Year"
                            placeholder='Year'
                            helperText="Enter Year Example: 2020"
                            variant="standard"
                            onChange={(event) => setYearFilter(event.target.value)}
                            value={yearFilter}
                        />
                    </Grid>
                    <Grid item sx={{ marginTop: 0.75 }}>
                        <Button id="daReportedFinancialsSubmit" type="submit" variant="contained" size="medium" onClick={onSubmitHandler} sx={{ mt: 1.5 }} > Submit </Button>
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

export default DAReportedFinancials;
