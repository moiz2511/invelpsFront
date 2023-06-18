import { TextField, Button, MenuItem, Grid, Select, InputLabel, Checkbox, FormControlLabel } from '@mui/material';
import React, { useEffect, useState } from 'react'
import ScreenModelService from '../services/ScreenModelService';



const ScreenModel = () => {
    const restClient = new ScreenModelService();

    const [stylesDropDownValues, setStylesDropDownValues] = useState([]);
    const [mentorDropDownValues, setMentorDropDownValues] = useState([]);
    const [screenModelDropDownValues, setscreenModelDropDownValues] = useState([]);
    const [stylesFilter, setStylesFilter] = useState("");
    const [mentorFilter, setMentorFilter] = useState("");
    const [screenModelFilter, setScreenModelFilter] = useState();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isRecurring, setIsRecurring] = useState(false);
    const [isTwitter, setIsTwitter] = useState(false);
    const [isEmail, setIsEmail] = useState(false);
    const [isAIDescription, setIsAIDescription] = useState(false);

    const [recurrencePattern, setRecurrencePattern] = useState('');
    const [startTime, setStartTime] = useState('');
    const [message, setMessage] = useState('')


    useEffect(() => {
        getStylesDropDown();
    }, []);

    const setStylesFilterHandler = (event) => {
        setStylesFilter(event.target.value);
        setMentorFilter("")
        setScreenModelFilter("")
        getMentorDropDownByStyle(event.target.value);
    }

    const setMentorFilterHandler = (event) => {
        setMentorFilter(event.target.value);
        setScreenModelFilter("")
        getScreenModelDropDownByMentor(event.target.value);
    }



    const setScreenModelFilterHandler = async (modelVal) => {
        setScreenModelFilter(modelVal);
        const body = { search_strategy: modelVal, page: 1 }
        await restClient.getScreenModelsData(body)
            .then((response) => {
                console.log(response)
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const onSubmitHandler = async (event) => {
        if (event != null) {
            event.preventDefault();
        }
        const body = {
            name,
            description,
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
            style: stylesFilter,
            mentor: mentorFilter,
            model: screenModelFilter,
            isEmail:isEmail,
            isTwitter:isTwitter,
            isAIDescription:isAIDescription
        }
        console.log(body)

        await restClient.createScreenModelTask(body)
            .then((response) => {
                console.log(response)
                setMessage(response.data.message)
            })
            .catch((err) => {
                console.log(err);
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

    const handleNameChange = (event) => setName(event.target.value);
    const handleDescriptionChange = (event) => setDescription(event.target.value);

    const handleIsRecurringChange = (event) =>
        setIsRecurring(event.target.checked);

    const handleIsTwitter = (event) =>
        setIsTwitter(event.target.checked);

    const handleIsEmail = (event) =>
        setIsEmail(event.target.checked);

    const handleIsAIDescription = (event) =>
        setIsAIDescription(event.target.checked);

    const handleRecurrencePatternChange = (event) =>
        setRecurrencePattern(event.target.value);

    const handleStartTimeChange = (event) => setStartTime(event.target.value);

    return (
        <Grid container>
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
                            label={<InputLabel shrink>Start Time (MM-DD-YY)</InputLabel>}
                            type='datetime-local'
                            value={startTime}
                            onChange={handleStartTimeChange}
                            margin='normal'
                            fullWidth
                        />
                    )}
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isTwitter}
                                onChange={handleIsTwitter}
                            />
                        }
                        label='Twitter Upload'
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isEmail}
                                onChange={handleIsEmail}
                            />
                        }
                        label='Email Notification'
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isAIDescription}
                                onChange={handleIsAIDescription}
                            />
                        }
                        label='Ai Description'
                    />
                    <Button id="screenModelButton" onClick={onSubmitHandler} type="submit" variant="contained" size="medium"> Save </Button>
                    <p>{message}</p>
                </Grid>
            </Grid>
        </Grid >
    )
}
export default ScreenModel;
