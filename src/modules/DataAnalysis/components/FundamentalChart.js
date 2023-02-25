import React, { useEffect, useState } from 'react'
import Chart from '../../UIUtils/Charts/ChartComponent';
import ColorConstants from '../../Core/constants/ColorConstants.json'
import { Button, Grid, TextField, MenuItem, Card, Box, CircularProgress, Backdrop, Tooltip, Chip } from '@mui/material';

// import CustomizedTable from '../../UIUtils/Table/TableContentComponent';
import FundamentalChartService from '../services/FundamentalChartService';
import { useSearchParams } from 'react-router-dom';

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
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AnalysisModelService from '../../Context/services/AnalysisModelService';
import PageInfoBreadCrumbs from '../../Core/components/Layout/PageInfoBreadCrumbs';

const compareFilters = [
  'industryAvg',
  'industryMedian',
  'sectorAvg',
  'sectorMedian'
];

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

const DeStructureAnalysisApiData = async (apiData) => {

  let data = {
    labels: apiData.date_range,
    yUnit: apiData.yUnit,
    datasets: []
  }
  let dataLists = []
  for (let [dataIndex, companyData] of apiData.return_list.entries()) {
    let subList = []
    let obj = {}
    obj.label = companyData.company_name + "::" + companyData.metric
    obj.borderColor = ColorConstants.CHART_COLORS[dataIndex]
    obj.backgroundColor = ColorConstants.CHART_COLORS[dataIndex]
    data.datasets.push(obj)
    for (let [index, key] of apiData.date_range.entries()) {
      subList.push(typeof (companyData[key]) === "string" ? companyData[key].replace("M", "") : companyData[key]);
    }
    dataLists.push(subList);
  }
  for (let [index, object] of data.datasets.entries()) {
    object.data = dataLists[index]
  }
  console.log(data);
  return data;
}


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
    if (ref.current !== null) {
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

const FormatTableContent = (data, unit, dateRange) => {
  let response = []
  for (let record of data) {
    let mean = 1;
    let cagr = 1;
    for (let year of dateRange) {
      if (unit === "percent") {
        mean = mean * (1 + (record[year] / 100));
        cagr = mean
      } else {
        mean = mean * record[year]
      }
    }
    if (unit === "percent") {
      mean = ((mean ** (1 / dateRange.length)) / 100);
      if(cagr < 0) {
        cagr =  ((0-cagr) ** (1 / dateRange.length)) -1;
      } else {
        cagr = ((cagr) ** (1 / dateRange.length)) -1;
      }
    } else {
      mean = ((mean ** (1 / dateRange.length)) / 100);
      cagr = ((parseFloat(record[dateRange.slice(-1)]) / parseFloat(record[dateRange[0]])) ** (1 / dateRange.length)) - 1
    }
    record['mean'] = parseFloat(mean*100).toFixed(2);
    record['cagr'] = parseFloat(cagr*100).toFixed(2);
    response.push(record);
  }
  return response;
}

const DAFundamentalChart = () => {
  let pageLoc = window.location.pathname;
  const [searchParams] = useSearchParams();
  const restClient = new FundamentalChartService();
  const restClientAnalysisModel = new AnalysisModelService();

  let company = searchParams.get("company", "") ? searchParams.get("company") : "";
  let tool = searchParams.get("tool") ? searchParams.get("tool") : "";
  // let measure = searchParams.get("measure") ? searchParams.get("measure") : "";
  // let category = searchParams.get("category") ? searchParams.get("category") : "";
  let metrics = searchParams.get("metrics") ? searchParams.get("metrics") : "";
  let from = searchParams.get("from") ? searchParams.get("from") : "";
  let to = searchParams.get("to") ? searchParams.get("to") : "";
  let ranges = searchParams.get("range") ? searchParams.get("range") : "";
  ranges = ranges.split(",")
  ranges = ranges.map((range) => range.trim())
  metrics = metrics.split(",")
  if (metrics !== null && metrics.length > 0 && metrics[0] !== "") {
    metrics = metrics.map((metric) => { return { metric: metric.trim() } })
  } else {
    metrics = []
  }
  useEffect(() => {
    getCompaniesDropDown();
    if (tool !== null && tool !== "") {
      getMetricsDropDown(tool);
    }
    if (metrics !== null && metrics.length > 0 && metrics.length === 1) {
      getRangesDropDown(metrics[0]['metric']);
    }
    getToolsDropDownOptions();
  }, []
  );
  const [headCellsData, setHeadCellsData] = useState({});
  const [companiesDropDownValues, setCompaniesDropDownValues] = useState([{ company_name: company }]);
  const [companyFilter, setCompanyFilter] = useState({ company_name: company });
  const [toolFilter, setToolFilter] = useState(tool);
  const [toolsDropDownValues, setToolsDropDownValues] = useState([]);
  // const [measureFilter, setMeasureFilter] = useState(measure);
  // const [measureDropDownValues, setMeasureDropDownValues] = useState([]);
  // const [categoryFilter, setCategoryFilter] = useState(category);
  // const [categoryDropDownValues, setCategoryDropDownValues] = useState([]);
  const [metricsFilter, setMetricsFilter] = useState(metrics);
  const [metricsDropDownValues, setMetricsDropDownValues] = useState([]);
  const [fromFilter, setFromFilter] = useState(from);
  const [toFilter, setToFilter] = useState(to);
  const [rangesFilter, setRangesFilter] = useState(ranges);
  const [rangesDropDownValues, setRangesDropDownValues] = useState([]);
  const [chartInputData, setChartInputData] = useState({});
  const [onSubmitResponseReceived, setOnSubmitResponseReceived] = useState(false);
  const [chartTableContent, setChartTableContent] = useState([])
  const [chartApiResponse, setChartApiResponse] = useState("");
  const [showCircularProgress, setCircularProgress] = useState(false);
  const [enableSubmitButton, setEnableSubmitButton] = useState(true);
  const [compareFilter, setCompareFilter] = React.useState([]);

  const setToolFilterHandler = (event) => {
    setToolFilter(event.target.value);
    getMetricsDropDown(event.target.value);
  }

  // const setMetricsFilterHandler = (event) => {
  //   const {
  //     target: { value },
  //   } = event;
  //   setMetricsFilter(
  //     // On autofill we get a stringified value.
  //     typeof value === 'string' ? value.split(',') : value,
  //   );
  //   getRangesDropDown(typeof value === 'string' ? value.split(',')[0] : value);
  // }

  const setFromFilterHandler = (event) => {
    setFromFilter(event.target.value)
  }
  const setToFilterHandler = (event) => {
    setToFilter(event.target.value)
  }

  const setRangesFilterHandler = (event) => {
    const {
      target: { value },
    } = event;
    setRangesFilter(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  }

  async function getMetricsDropDown(tool) {
    await restClient.getMetricsByTool({ tool })
      .then((response) => {
        setMetricsDropDownValues(response.data.resp_data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function getRangesDropDown(metric) {
    await restClient.getRangesByMetric(metric)
      .then((response) => {
        setRangesDropDownValues(response.data);
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
  async function getToolsDropDownOptions() {
    await restClientAnalysisModel.getAllTools()
      .then((response) => {
        // console.log(response)
        // let companies = response.data.companies_data.map((item) => { return { "value": item.company_name, "label": item.company_name } })
        // console.log(companies);
        setToolsDropDownValues(response.data.resp_data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    setCircularProgress(true);
    setEnableSubmitButton(false);
    let body = {
      "companies": [companyFilter.company_name],
      "types": toolFilter,
      "from": fromFilter,
      "to": toFilter,
      "metrics": metricsFilter.map((item) => { return item.metric }),
      "rangemetrics": rangesFilter,
      "filters": compareFilter
    }
    await restClient.submitData(body)
      .then(async (response) => {
        const data = await DeStructureAnalysisApiData(response.data);
        const localHeadCells = await buildTableHeadCells(response.data);
        setChartApiResponse(response.data);
        const tableRecords = FormatTableContent(response.data.return_list, response.data.yUnit, response.data.date_range)
        setChartTableContent(tableRecords);
        setHeadCellsData(localHeadCells);
        setChartInputData(data);
        setOnSubmitResponseReceived(true);
        setCircularProgress(false);
        setEnableSubmitButton(true);
        // setResultItemsCount(response.data.page_data * rowsPerPage)
      })
      .catch((err) => {
        console.log(err);
        setCircularProgress(false);
        setEnableSubmitButton(true);
      });

  }

  // useEffect(() => {
  //   console.log("USE EFFECT TRIGGERED");
  //   buildTableHeadCells();
  // }, []);

  const buildTableHeadCells = async (apiData) => {
    let localHeadCells = {
      data: [
        {
          id: 'company_name',
          label: 'Company',
          isValueLink: false,
        },
        {
          id: 'symbol',
          label: 'Symbol',
          isValueLink: false,
        },
        {
          id: 'metric',
          label: 'Metric(' + apiData.yUnit + ')',
          isValueLink: false,
        }
      ]
    };
    for (let [index, year] of apiData.date_range.entries()) {
      localHeadCells.data.push({
        id: year,
        label: year,
        isValueLink: false
      })
    }
    localHeadCells.data.push({
      id: "mean",
      label: "Mean",
      isValueLink: false
    })
    localHeadCells.data.push({
      id: "cagr",
      label: "CAGR",
      isValueLink: false
    })
    localHeadCells.data.push({
      id: "sd",
      label: "SD",
      isValueLink: false
    })
    localHeadCells.data.push({
      id: "rsd",
      label: "RSD",
      isValueLink: false
    })
    localHeadCells.data.push({
      id: "n_years",
      label: "NbrOfYears",
      isValueLink: false
    })
    localHeadCells.data.push({
      id: "range",
      label: "Range",
      isValueLink: false
    })
    localHeadCells.data.push({
      id: "comment",
      label: "Mean vs Range",
      isValueLink: false
    })
    return localHeadCells;
  }

  // const emptyRows =
  //   page > 0 ? Math.max(0, (1 + page) * rowsPerPage - resultItemsCount) : 0;
  return (
    <React.Fragment>
      <Grid container>
        <PageInfoBreadCrumbs data={pageLoc} />
        <Box sx={{ marginLeft: 1 }}>
          <Grid container
            spacing={1}
            component="form"
            sx={{
              '& .MuiTextField-root': { minWidth: '20ch' },
            }}
            noValidate
            autoComplete="off">
            <Grid item sx={{ marginTop: 1 }}>
              {/* <div style={{ width: '240px', fontSize: '12px', fontWeight: 'bold' }}>
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
              <TextField
                select
                id="toolsFilter"
                label="Tools"
                variant="standard"
                onChange={setToolFilterHandler}
                value={toolFilter}
              >
                <MenuItem value="">
                  <em>Select Tool</em>
                </MenuItem>
                {toolsDropDownValues.map((item) => (
                  <MenuItem key={item.tool} value={item.tool}>
                    {item.tool}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item sx={{ marginTop: 0.75 }}>
              {/* <TextField
                select
                multiple
                SelectProps={{ multiple: true }}
                id="metricsFilter"
                label="Metrics"
                variant="standard"
                onChange={setMetricsFilterHandler}
                value={metricsFilter}
              >
                <MenuItem key="default-value" value="">
                  -- SELECT Metrics --
                </MenuItem>
                {metricsDropDownValues.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField> */}
              <Autocomplete
                limitTags={1}
                multiple
                size="small"
                // autoSelect={true}
                disablePortal={true}
                // selectOnFocus={true}
                id="metricsFilter"
                getOptionLabel={(option) => option.metric}
                isOptionEqualToValue={(option, value) => option.metric === value.metric}
                options={metricsDropDownValues}
                onChange={(event, newValue) => {
                  setMetricsFilter(newValue);
                  if (newValue.length === 1) {
                    getRangesDropDown(newValue[0]['metric']);
                  }
                }}
                // onChange={setMetricsFilter}
                value={metricsFilter}
                sx={{ minWidth: 240, mt: 0.4 }}
                renderInput={(params) => <TextField SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }} {...params} variant="standard" label="Metrics" />}
              />
            </Grid>
            <Grid item sx={{ marginTop: 0.75 }}>
              <TextField
                // select
                id="fromFilter"
                label="From"
                variant="standard"
                onChange={setFromFilterHandler}
                value={fromFilter}
              />
            </Grid>
            <Grid item sx={{ marginTop: 0.75 }}>
              <TextField
                // select
                id="toFilter"
                label="To"
                variant="standard"
                onChange={setToFilterHandler}
                value={toFilter}
              />
            </Grid>
            {metricsFilter.length < 2 && <Grid item sx={{ marginTop: 0.75 }}>
              <TextField
                select
                id="rangesFilter"
                label="Ranges"
                variant="standard"
                onChange={setRangesFilterHandler}
                value={rangesFilter}
              >
                <MenuItem key="default-value" value="">
                  <em>Select Ranges</em>
                </MenuItem>
                {rangesDropDownValues.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>}
            <Grid item sx={{ marginTop: 0.75 }}>
              <Autocomplete
                limitTags={1}
                multiple
                size="small"
                // autoSelect={true}
                disablePortal={true}
                // selectOnFocus={true}
                id="compareFilter"
                getOptionLabel={(option) => option}
                isOptionEqualToValue={(option, value) => option === value}
                options={compareFilters}
                onChange={(event, newValue) => {
                  setCompareFilter(newValue);
                }}
                // onChange={setMetricsFilter}
                value={compareFilter}
                sx={{ minWidth: 240, mt: 0.4 }}
                renderInput={(params) => <TextField SelectProps={{ autoWidth: true, displayEmpty: true, defaultOpen: true }} {...params} variant="standard" label="Comparators" />}
              />
            </Grid>
            <Grid item sx={{ marginTop: 0.75 }}>
              <Button disabled={!enableSubmitButton} id="profilePageButton" type="submit" variant="contained" onClick={onSubmit} size="medium" sx={{ mt: 1.5 }} > Submit </Button>
            </Grid>
          </Grid>
        </Box>
        {/* <Grid item sx={{ mt: 1.5 }} >
          <Button id="profilePageButton" type="submit" variant="contained" size="medium"> Submit </Button>
        </Grid> */}
      </Grid>

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
        {onSubmitResponseReceived && <React.Fragment><Chart yAxisUnit={chartInputData.yUnit} data={chartInputData} plotLineValue={chartTableContent[0].range} />
          <Box sx={{ width: '100%' }}>
            {/* <Paper sx={{ width: '100%', mb: 2 }}> */}
            <TableContainer>
              <Table
                sx={{ minWidth: '98%', maxWidth: '99%', mt: 1 }}
                aria-labelledby="tableTitle"
                size='medium'
              >
                <TableHead>
                  <TableRow>
                    {headCellsData.data.map((headCell) => (
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
                  {chartTableContent
                    // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      let mean = row.mean
                      if (chartInputData.yUnit === "percent") {
                        mean = String(mean) + "%";
                      } else if (chartInputData.yUnit === "millions") {
                        mean = parseFloat(mean).toLocaleString();
                      }
                      return (
                        <StyledTableRow
                          hover
                          tabIndex={-1}
                          key={index}
                          sx={{ ml: 3 }}
                        >
                          <StyledTableCell>
                            {row.company_name}
                          </StyledTableCell>
                          <StyledTableCell>
                            {row.symbol}
                          </StyledTableCell>
                          <StyledTableCell>
                            {row.metric}
                          </StyledTableCell>
                          {
                            chartApiResponse.date_range.map((field, index) => {
                              let value = row[field]
                              if (chartInputData.yUnit === "percent") {
                                value = String(value) + "%";
                              } else if (chartInputData.yUnit === "millions") {
                                value = parseFloat(value).toLocaleString();
                              }
                              return (
                                <StyledTableCell key={index}>
                                  {value}
                                </StyledTableCell>
                              );
                            })
                          }
                          <StyledTableCell>
                            {mean}
                          </StyledTableCell>
                          <StyledTableCell>
                            {row.cagr + "%"}
                          </StyledTableCell>
                          <StyledTableCell>
                            {row.sd}
                          </StyledTableCell>
                          <StyledTableCell>
                            {row.rsd}
                          </StyledTableCell>
                          <StyledTableCell>
                            {row.n_years}
                          </StyledTableCell>
                          <StyledTableCell>
                            {chartInputData.yUnit === "percent" ? row.range + "%" : row.range}
                          </StyledTableCell>
                          <StyledTableCell>
                            {row.comment === "Above" ? <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}><span style={{ color: row.condition ? "#00B050" : "#FF0000", fontSize: 10, fontWeight: "bold" }}>{row.comment}</span><ArrowUpwardIcon sx={{ color: row.condition ? "#00B050" : "#FF0000" }} /></div> :
                              row.comment === "Below" ? <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}><span style={{ color: row.condition ? "#00B050" : "#FF0000", fontSize: 10, fontWeight: "bold" }}>{row.comment}</span><ArrowDownwardIcon sx={{ color: row.condition ? "#00B050" : "#FF0000" }} /></div> :
                                <span style={{ color: "#00B050", fontWeight: "bold" }}>{row.comment}</span>}
                          </StyledTableCell>
                        </StyledTableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </React.Fragment>
        }
      </Card>
    </React.Fragment>
  );
}

export default DAFundamentalChart;