import React, { useEffect, useState } from 'react';
import * as axios from 'axios';

import {
  Backdrop,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Select,
  MenuItem,
  Tooltip,
  Modal,
  Checkbox,
  FormControlLabel,
  InputLabel,
  Paper,
  TextareaAutosize,
} from '@mui/material';

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

import Constants from './../../../Constants.json';
import MyTable from './TaskTable';

const LISTBOX_PADDING = 8; // px

function renderRow(props) {
  const { data, index, style } = props;
  const dataSet = data[index];
  const inlineStyle = {
    ...style,
    top: style.top + LISTBOX_PADDING,
    fontSize: 12,
    width: '100%',
  };
  // console.log(data)

  return (
    <Typography component='li' {...dataSet[0]} style={inlineStyle}>
      {dataSet[1]?.company_name || 'Select All'}
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
const ListboxComponent = React.forwardRef(function ListboxComponent(
  props,
  ref
) {
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
          width='100%'
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType='ul'
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

const eventsX = [
  {
    id: 1,
    name: 'Event 1',
    description: 'This is the first event',
    isSuccess: true,
    lastOccurrence: new Date('2023-04-05T10:30:00'),
    logs: [
      'Event started',
      'Event completed successfully',
      'Event took 5 seconds to complete',
    ],
  },
  {
    id: 2,
    name: 'Event 2',
    description: 'This is the second event',
    isSuccess: false,
    lastOccurrence: new Date('2023-04-04T08:15:00'),
    logs: [
      'Event started',
      'Error occurred: unable to connect to server',
      'Event failed after 3 retries',
    ],
  },
  {
    id: 3,
    name: 'Event 3',
    description: 'This is the third event',
    isSuccess: true,
    lastOccurrence: new Date('2023-04-03T14:45:00'),
    logs: [
      'Event started',
      'Event completed successfully',
      'Event took 10 seconds to complete',
    ],
  },
  {
    id: 4,
    name: 'Event 4',
    description: 'This is the forth event',
    isSuccess: false,
    lastOccurrence: new Date('2023-04-03T14:45:00'),
    logs: [
      'Event started',
      'Successfully fetched Profile for AB Science',
      'Failed to fetch Profile for Abo SA',
      'Successfully fetched Profile for ABL Diagnostics',
      'Successfully fetched Profile for AB Sapnor',
      'Successfully fetched Profile for AB Methonor',
      'Event failed after 1:10 seconds',
    ],
  },
  {
    id: 3,
    name: 'Event 3',
    description: 'This is the third event',
    isSuccess: true,
    lastOccurrence: new Date('2023-04-03T14:45:00'),
    logs: [
      'Event started',
      'Event completed successfully',
      'Event took 10 seconds to complete',
    ],
  },
  {
    id: 3,
    name: 'Event 3',
    description: 'This is the third event',
    isSuccess: true,
    lastOccurrence: new Date('2023-04-03T14:45:00'),
    logs: [
      'Event started',
      'Event completed successfully',
      'Event took 10 seconds to complete',
    ],
  },
  {
    id: 3,
    name: 'Event 3',
    description: 'This is the third event',
    isSuccess: true,
    lastOccurrence: new Date('2023-04-03T14:45:00'),
    logs: [
      'Event started',
      'Event completed successfully',
      'Event took 10 seconds to complete',
    ],
  },
  {
    id: 3,
    name: 'Event 3',
    description: 'This is the third event',
    isSuccess: true,
    lastOccurrence: new Date('2023-04-03T14:45:00'),
    logs: [
      'Event started',
      'Event completed successfully',
      'Event took 10 seconds to complete',
    ],
  },
];
const Container = ({ name, description, lastOccurrence, isSuccess }) => (
  <Grid item xs={12} md={4}>
    <Paper
      sx={{ p: 2, border: isSuccess ? '1px solid green' : '1px solid red' }}
    >
      <h3>{name}</h3>
      <p>{description}</p>
      <p>Last Occurrence: {lastOccurrence}</p>
    </Paper>
  </Grid>
);
const DataAcquisitionAPi = () => {
  let pageLoc = window.location.pathname;
  const restService = new DataAcquisitionService();
  const [exchangeFilter, setExchangeFilter] = useState({ exchange: 'All' });
  const [sectorFilter, setSectorFilter] = useState({ sector: 'All' });
  const [industryFilter, setIndustryFilter] = useState({ industry: 'All' });

  const [exchnageNameDropValues, setExchnageNameDropValues] = useState([
    { exchangeShortName: '' },
  ]);

  const [selectedExchange, setSelectedExchange] = useState({
    exchangeShortName: '',
  });

  const [companiesFilter, setCompaniesFilter] = useState([]);
  const [typeFilter, setTypeFilter] = useState({ type: 'All' });
  const [nYearsFilter, setNYearsFilter] = useState('1');
  const [showCircularProgress, setCircularProgress] = useState(false);

  const [companiesDropDownValues, setCompaniesDropDownValues] = useState([]);
  const [typeDropDownValues, setTypeDropDownValues] = useState([
    { type: 'All' },
  ]);
  const [nYearsDropDownValues, setNYearsDropDownValues] = useState([
    { limit: '1' },
  ]);
  const [industryDropDownValues, setIndustryDropDownValues] = useState([
    { industry: 'All' },
  ]);
  const [sectorDropDownValues, setSectorDropDownValues] = useState([
    { sector: 'All' },
  ]);
  const [exchangeDropDownValues, setExchangeDropDownValues] = useState([
    { exchange: 'All' },
  ]);

  const [open, setOpen] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const [name, setName] = useState('');
  const [checked, setChecked] = useState(false);
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState('');
  const [startTime, setStartTime] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [eventOpen, setEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventOpen = () => setEventOpen(true);
  const handleEventClose = () => setEventOpen(false);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    handleEventOpen();
  };

  const modalStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    maxWidth: '80%',
    margin: 'auto',
    backgroundColor: 'White',
    padding: '5px',
    height: '80vh',
  };

  const handleNameChange = (event) => setName(event.target.value);
  const handleDescriptionChange = (event) => setDescription(event.target.value);
  const handleEmailChange = (event) => setEmail(event.target.value);
  const handleIsRecurringChange = (event) =>
    setIsRecurring(event.target.checked);
  const handleRecurrencePatternChange = (event) =>
    setRecurrencePattern(event.target.value);
  const handleStartTimeChange = (event) => setStartTime(event.target.value);

  const getDataAcquisitionTypes = async () => {
    await restService
      .getDataAcquisitionTypes()
      .then((response) => {
        setTypeDropDownValues(
          [{ type: 'All' }].concat(response.data.dataTypes)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getExchangesDropDown = async () => {
    await restService
      .getExchangeValues()
      .then((response) => {
        setExchangeDropDownValues(
          [{ exchange: 'All' }].concat(response.data.exchanges)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getSectorsDropDownByExchange = async (exchange) => {
    await restService
      .GetSectorsByExchnage({ exchange })
      .then((response) => {
        setSectorDropDownValues(
          [{ sector: 'All' }].concat(response.data.sectors)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getIndustriesDropDownBySector = async (sector) => {
    await restService
      .getIndustryByExchangeAndSector({
        exchange: exchangeFilter.exchange,
        sector,
      })
      .then((response) => {
        setIndustryDropDownValues(
          [{ industry: 'All' }].concat(response.data.industries)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCompaniesDropDownByIndustry = async (industry) => {
    await restService
      .getCompaniesByIndustryExchangeAndSector({
        exchange: exchangeFilter.exchange,
        sector: sectorFilter.sector,
        industry,
      })
      .then((response) => {
        setCompaniesDropDownValues(response.data.companies);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getYearLimitsDropDown = async () => {
    await restService
      .getDataAcquisitionYearLimits()
      .then((response) => {
        setNYearsDropDownValues(response.data.yearLimits);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getUniqueExchanges = async () => {
    await restService
      .getUniqueExchanges()
      .then((response) => {
        setExchnageNameDropValues(response.data.exchanges);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    console.log('recurrencePattern', recurrencePattern);
    console.log(companiesDropDownValues);
    setIsDisable(true);
    axios
      .post(`${Constants.BACKEND_SERVER_BASE_URL}/automation/register`, {
        name,
        description,
        email: email,
        is_recurring: isRecurring ? 'on' : 'off',
        recurrence_pattern:
          recurrencePattern == 'daily'
            ? 'D'
            : recurrencePattern == 'weekly'
            ? 'W'
            : recurrencePattern == 'monthly'
            ? 'M'
            : recurrencePattern == 'quarterly'
            ? 'Q'
            : recurrencePattern == 'half-yearly'
            ? 'HY'
            : recurrencePattern == 'yearly'
            ? 'Y'
            : 'No',
        company_factors: checked
          ? companiesDropDownValues.map((item) => item.symbol)
          : companiesFilter.map((item) => item.symbol),
        type_factors: typeFilter.type,
        years: nYearsFilter,
        exchange: selectedExchange.exchangeShortName,
      })
      .then((response) => {
        console.log(response);
        alert('Event registered successfully.');
        setIsDisable(false);
        setHandler(handler == true ? false : true);
      })
      .catch((error) => {
        alert('An error occurred.');
        setIsDisable(false);
        console.error('Error in useEFFect events', error);
      });
  };
  const [events, setEvents] = useState([]);
  const [handler, setHandler] = useState(false);

  useEffect(() => {
    axios
      .get(`${Constants.BACKEND_SERVER_BASE_URL}/automation/getEvents`)
      .then((response) => {
        console.log(response);
        setEvents(response?.data.events);
      })
      .catch((error) => {
        console.error('Error in useEFFect events', error);
      });
  }, [handler]);
  // useEffect(() => {
  //     getDataAcquisitionTypes();
  //     getCompaniesDropDownByIndustry("All");
  //     getYearLimitsDropDown();
  // }, []);
  useEffect(() => {
    getExchangesDropDown();
    getDataAcquisitionTypes();
    getSectorsDropDownByExchange('All');
    getIndustriesDropDownBySector('All');
    getCompaniesDropDownByIndustry('All');
    getYearLimitsDropDown();
    getUniqueExchanges();
  }, []);

  const extractLogs = (selectedEvent) => {
    const value = selectedEvent.factors
      ?.map((f) => f.logs?.split(',').join('\n'))
      ?.join('\n');
    const myLogs = selectedEvent.logs.split(',');
    const firstLog = myLogs.shift();
    const remainingLogs = myLogs.join('\n');
    return `${myLogs.length > 0 && firstLog}\n${value}\n${
      myLogs.length > 0 && remainingLogs
    } `;
  };
  const handleSelectAll = (event, values) => {
    if (event.target.checked) {
      setCompaniesFilter(options.filter((option) => option !== 'Select All'));
    } else {
      setCompaniesFilter([]);
    }
  };

  const options = [{ company_name: 'Select All' }, ...companiesDropDownValues];

  const handleCheckChange = (event) => {
    setChecked(event.target.checked);
  };
  return (
    <>
      <Box>
        <PageInfoBreadCrumbs data={pageLoc} />
        <Grid
          container
          spacing={1}
          component='form'
          sx={{
            '& .MuiTextField-root': { minWidth: '20ch' },
            justifyContent: 'end',
            padding: '1rem',
          }}
          noValidate
          autoComplete='off'
        >
          <Grid item sx={{ marginTop: 1.2, marginRight: '10%' }}>
            <Button variant='contained' onClick={handleOpen}>
              ADD A NEW TASK
            </Button>
          </Grid>
        </Grid>
        <Box
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {console.log(events)}
          {/* {events?.map((event,i)=>{
                        console.log(event)
                        return(
                            <div style={{
                                justifyContent: "center",
                                alignItems: "center",
                                display: "flex", flexDirection: "column",
                                width:"100%"
                            }} onClick={()=>
                                handleEventClick(event)
                            }>
                                <Container key={i}  name={event.name} description={event.description} isSuccess={true} lastOccurrence={event.last_occurrence?.toString()} >

                                </Container>
                            </div>
                        )
                    })} */}
          <MyTable
            data={events}
            handleEventClick={handleEventClick}
            handler={handler}
            setHandler={setHandler}
          />
        </Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='modal-title'
          aria-describedby='modal-description'
        >
          <Box sx={modalStyle}>
            <div>
              <h2 id='modal-title'>Automation Task</h2>
              <p id='modal-description'>Create New Automation Task</p>

              <TextField
                id='name'
                label='Name'
                value={name}
                onChange={handleNameChange}
                margin='normal'
                fullWidth
              />
              <TextField
                id='description'
                label='Description'
                value={description}
                onChange={handleDescriptionChange}
                margin='normal'
                fullWidth
              />
              <TextField
                id='email'
                label='Email'
                type='email'
                value={email}
                onChange={handleEmailChange}
                margin='normal'
                fullWidth
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isRecurring}
                    onChange={handleIsRecurringChange}
                  />
                }
                label='Is Recurring'
              />
              {isRecurring ? (
                // <TextField
                //     id="recurrence-pattern"
                //     label="Recurrence Pattern"
                //     value={recurrencePattern}
                //     onChange={handleRecurrencePatternChange}
                //     margin="normal"
                //     fullWidth
                // />
                <div>
                  <InputLabel id='recurrence-pattern-label'>
                    Recurrence Pattern
                  </InputLabel>
                  <Select
                    labelId='recurrence-pattern-label'
                    id='recurrence-pattern'
                    value={recurrencePattern}
                    onChange={handleRecurrencePatternChange}
                    fullWidth
                  >
                    <MenuItem value='daily'>Daily</MenuItem>
                    <MenuItem value='weekly'>Weekly</MenuItem>
                    <MenuItem value='monthly'>Monthly</MenuItem>
                    <MenuItem value='quarterly'>Quarterly</MenuItem>
                    <MenuItem value='half-yearly'>Half Yearly</MenuItem>
                    <MenuItem value='yearly'>Yearly</MenuItem>
                  </Select>
                </div>
              ) : (
                <TextField
                  id='start-time'
                  // label="Start Time"
                  label={<InputLabel shrink>Start Time (MM-DD-YY)</InputLabel>}
                  type='datetime-local'
                  value={startTime}
                  onChange={handleStartTimeChange}
                  margin='normal'
                  fullWidth
                />
              )}

              <Grid
                container
                spacing={1}
                component='form'
                sx={{
                  '& .MuiTextField-root': { minWidth: '20ch' },
                }}
                noValidate
                autoComplete='off'
              >
                <Grid item sx={{ marginTop: 0.75 }}>
                  <Autocomplete
                    size='small'
                    disablePortal
                    id='exchangeFilter'
                    getOptionLabel={(option) => option.exchange}
                    isOptionEqualToValue={(option, value) =>
                      option.exchange === value.exchange
                    }
                    options={exchangeDropDownValues}
                    onChange={(event, newValue) => {
                      setExchangeFilter(newValue);
                      getSectorsDropDownByExchange(newValue.exchange);
                    }}
                    value={exchangeFilter}
                    sx={{ minWidth: 240, mt: 0.4 }}
                    renderInput={(params) => (
                      <TextField
                        SelectProps={{
                          autoWidth: true,
                          displayEmpty: true,
                          defaultOpen: true,
                        }}
                        {...params}
                        variant='standard'
                        label='Exchange'
                      />
                    )}
                  />
                </Grid>

                <Grid item sx={{ marginTop: 0.75 }}>
                  <Autocomplete
                    size='small'
                    disablePortal
                    id='sectorFilter'
                    getOptionLabel={(option) => option.sector}
                    isOptionEqualToValue={(option, value) =>
                      option.sector === value.sector
                    }
                    options={sectorDropDownValues}
                    onChange={(event, newValue) => {
                      setSectorFilter(newValue);
                      getIndustriesDropDownBySector(newValue.sector);
                    }}
                    value={sectorFilter}
                    sx={{ minWidth: 240, mt: 0.4 }}
                    renderInput={(params) => (
                      <TextField
                        SelectProps={{
                          autoWidth: true,
                          displayEmpty: true,
                          defaultOpen: true,
                        }}
                        {...params}
                        variant='standard'
                        label='Sector'
                      />
                    )}
                  />
                </Grid>

                <Grid item sx={{ marginTop: 0.75 }}>
                  <Autocomplete
                    size='small'
                    disablePortal
                    id='industryFilter'
                    getOptionLabel={(option) => option.industry}
                    isOptionEqualToValue={(option, value) =>
                      option.industry === value.industry
                    }
                    options={industryDropDownValues}
                    onChange={(event, newValue) => {
                      setIndustryFilter(newValue);
                      getCompaniesDropDownByIndustry(newValue.industry);
                    }}
                    value={industryFilter}
                    sx={{ minWidth: 240, mt: 0.4 }}
                    renderInput={(params) => (
                      <TextField
                        SelectProps={{
                          autoWidth: true,
                          displayEmpty: true,
                          defaultOpen: true,
                        }}
                        {...params}
                        variant='standard'
                        label='Industry'
                      />
                    )}
                  />
                </Grid>
                <Grid item sx={{ marginTop: 1.2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={handleCheckChange}
                      />
                    }
                    label='All Companies'
                  />
                </Grid>
                <Grid item sx={{ marginTop: 1.2 }}>
                  <Autocomplete
                    limitTags={1}
                    multiple
                    size='small'
                    disablePortal
                    id='companiesFilter'
                    sx={{ width: 240 }}
                    disableListWrap
                    disableCloseOnSelect
                    getOptionLabel={(option) => option.company_name}
                    isOptionEqualToValue={(option, value) =>
                      option.company_name === value.company_name
                    }
                    PopperComponent={StyledPopper}
                    ListboxComponent={ListboxComponent}
                    options={companiesDropDownValues}
                    onChange={(event, newValue) => {
                      setCompaniesFilter(newValue);
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Tooltip key={index} title={option.company_name}>
                          <Chip
                            size='small'
                            sx={{ width: '65%' }}
                            variant='contained'
                            label={option.company_name}
                            {...getTagProps({ index })}
                          />
                        </Tooltip>
                      ))
                    }
                    value={companiesFilter}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label='Companies'
                        variant='standard'
                      />
                    )}
                    renderOption={(props, option) => [props, option]}
                  />
                </Grid>
                <Grid item sx={{ marginTop: 0.75 }}>
                  <Autocomplete
                    size='small'
                    disablePortal
                    id='type'
                    options={typeDropDownValues}
                    getOptionLabel={(option) => option.type}
                    isOptionEqualToValue={(option, value) =>
                      option.type === value.type
                    }
                    onChange={(event, newValue) => {
                      setTypeFilter(newValue);
                    }}
                    value={typeFilter}
                    sx={{ minWidth: 240, mt: 0.4 }}
                    renderInput={(params) => (
                      <TextField
                        SelectProps={{
                          autoWidth: true,
                          displayEmpty: true,
                          defaultOpen: true,
                        }}
                        {...params}
                        variant='standard'
                        label='Type'
                      />
                    )}
                  />
                </Grid>
                <Grid item sx={{ marginTop: 0.75 }}>
                  <TextField
                    select
                    id='numYears'
                    label='Number Of Years'
                    variant='standard'
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

                {/* <Grid item sx={{ marginTop: 0.75 }}>
                  <TextField
                    select
                    id='Exchange Name'
                    label='Exchange Name'
                    variant='standard'
                    onChange={(event) =>
                      setSelectedExchange(event.target.value)
                    }
                    value={nYearsFilter}
                  >
                    {exchnageNameDropValues.map((item) => (
                      <MenuItem key={item} value={item.exchangeShortName}>
                        {item.exchangeShortName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid> */}

                <Grid item sx={{ marginTop: 0.75 }}>
                  <Autocomplete
                    size='small'
                    disablePortal
                    id='exchangeNameFilter'
                    getOptionLabel={(option) => option.exchangeShortName}
                    isOptionEqualToValue={(option, value) =>
                      option.exchangeShortName === value.exchangeShortName
                    }
                    options={exchnageNameDropValues}
                    onChange={(event, newValue) => {
                      setSelectedExchange(newValue);
                    }}
                    value={selectedExchange}
                    sx={{ minWidth: 240, mt: 0.4 }}
                    renderInput={(params) => (
                      <TextField
                        SelectProps={{
                          autoWidth: true,
                          displayEmpty: true,
                          defaultOpen: true,
                        }}
                        {...params}
                        variant='standard'
                        label='Exchnage short Name'
                      />
                    )}
                  />
                </Grid>

                {showCircularProgress && (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Backdrop
                      sx={{
                        color: '#fff',
                        position: 'absolute',
                        zIndex: (theme) => theme.zIndex.drawer - 1,
                        opacity: 0.5,
                      }}
                      open={showCircularProgress}
                    >
                      <CircularProgress />
                    </Backdrop>
                  </Box>
                )}
              </Grid>
              <Grid item sx={{ marginTop: 0.75 }}>
                <Button
                  id='dataAcquisitionSubmit'
                  type='submit'
                  variant='contained'
                  disabled={isDisable}
                  size='medium'
                  onClick={onSubmitHandler}
                  sx={{ mt: 1.5 }}
                >
                  {' '}
                  Submit{' '}
                </Button>
              </Grid>
              {/* <Button variant="contained" onClick={handleClose}>
                                Close Modal
                            </Button> */}
            </div>
          </Box>
        </Modal>
        <Modal
          open={eventOpen}
          onClose={handleEventClose}
          aria-labelledby='modal-title'
          aria-describedby='modal-description'
        >
          {selectedEvent && (
            <Box sx={modalStyle}>
              <div style={{ width: '100%' }}>
                <h2 id='modal-title'>{selectedEvent.name}</h2>
                <Typography variant='h6'>Description:</Typography>
                <Typography>{selectedEvent.description}</Typography>
                <Typography variant='h6'>Last Occurrence:</Typography>
                <Typography>
                  {selectedEvent.last_occurrence?.toLocaleString()}
                </Typography>
                <Typography variant='h6'>Logs:</Typography>
                {/* <Paper sx={{ p: 2 }}>
                                    {selectedEvent.logs.map((log, index) => (
                                        <Typography key={index}>{log}</Typography>
                                    ))}
                                </Paper> */}
                <Paper
                  style={{
                    height: '400px', // set a fixed height for the container
                    overflow: 'scroll', // make the container scrollable
                  }}
                >
                  <TextareaAutosize
                    // value={selectedEvent.factors?.map((f) => f.logs?.split(',').join("\n"))?.join('\n')}
                    value={extractLogs(selectedEvent)}
                    rows={10}
                    style={{
                      width: '100%',
                      overflow: 'hidden',
                      backgroundColor: 'black',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem',
                      fontFamily: 'monospace',
                      fontSize: '1rem',
                    }}
                  />
                </Paper>
              </div>
            </Box>
          )}
        </Modal>
      </Box>

      <Box sx={{ marginLeft: 1 }}></Box>
    </>
  );
};

export default DataAcquisitionAPi;
