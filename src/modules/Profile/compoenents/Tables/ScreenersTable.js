import React, { useState, useEffect } from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ScreenModelService from '../../services/ScreenModelService';


const ScreenTable = () => {
  const restClient = new ScreenModelService();

  const [open, setOpen] = useState(false);
  const [allScreeners, setAllScreeners] = useState([])

  const [selectedScreener, setSelectedScreener] = useState(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [email, setEmail] = useState("")
  const [isIntagram, setIsInstagram] = useState(false)
  const [isTwitter, SetIsTwitter] = useState(false)
  const [isFacebook, SetIsFacebook] = useState(false)
  const [isLinkedIn, setIsLinkedIn] = useState(false)
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurrencePattern, setRecurrencePattern] = useState('');
  const [message, setMessage] = useState('');




  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFormSubmit = async(event) => {
    event.preventDefault();
    // Handle form submission here
    console.log(selectedScreener)
    console.log(name)
    console.log(description)
    console.log(email)
    console.log(isIntagram)
    console.log(isTwitter)
    console.log(isFacebook)
    console.log(isLinkedIn)
    console.log(isRecurring)
    console.log(recurrencePattern)

    const body = {
        "name" : name,
        "description" : description,
        "email" : email,
        "isTwitter" : isTwitter,
        "isEmail" : true,
        "isRecurring" : isRecurring,
        "recurrence_pattern" :  recurrencePattern == 'daily'
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
        "postDescription" : description,
        "screenerId" : selectedScreener
    }

    await restClient.createScreenerTask(body)
        .then((response) => {
          console.log(response.data)
          setMessage(response.data.message)
          // setMsg(response.data.message)

        })
        .catch((err) => {
          console.log(err);
        });
  };
  function convertUTCtoLocal(utcDateString) {
    // Create a new Date object from the UTC date string
    const date = new Date(utcDateString);

    // Get the day, month, and year in the user's local timezone
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based in JavaScript
    const year = date.getFullYear();

    // Format the date as day/month/year
    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
  }

  const handleRecurrencePatternChange = (event) =>
    setRecurrencePattern(event.target.value);
  const handleIsRecurringChange = (event) =>
    setIsRecurring(event.target.checked);

  useEffect(() => {
    const getMyScreeners = async () => {
      await restClient.getMyScreeners()
        .then((response) => {
          console.log(response.data)
          setAllScreeners(response.data.allScreeners)
          // setMessage(response.data.authorization_url)
          // setMsg(response.data.message)
        })
        .catch((err) => {
          console.log(err);
        });

    }
    getMyScreeners()
  }, [])
  return (
    <div>
      <h3>Screens</h3>
      <div style={{ position: 'relative' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickOpen}
          style={{ position: 'absolute', top: '16px', right: '16px' }}
        >
          Add a new task
        </Button>
        <table style={{ borderCollapse: 'collapse', width: '1000px', marginTop: '40px' }}>
          <colgroup>
            <col style={{ width: '33%' }} />
            <col style={{ width: '33%' }} />
            <col style={{ width: '33%' }} />
          </colgroup>
          <thead>
            <tr style={{ backgroundColor: 'blue', color: 'white' }}>
              <th style={{ padding: '8px', textAlign: 'center' }}>Screen name</th>
              <th style={{ padding: '8px', textAlign: 'center' }}>Description</th>
              <th style={{ padding: '8px', textAlign: 'center' }}>Creation date</th>
            </tr>
          </thead>
          <tbody>
            {allScreeners && allScreeners.map((screener, index) => (
              <tr style={{ backgroundColor: index % 2 ? 'lightblue' : 'lightgrey' }}
                onClick={() => window.open(`/dataanalysis/screener/${screener.id}`, '_blank')}>
                <td style={{ padding: '8px 16px', textAlign: 'center' }}>{screener.name}</td>
                <td style={{ padding: '8px 16px', textAlign: 'center' }}>{screener.description}</td>
                <td style={{ padding: '8px 16px', textAlign: 'center' }}>{convertUTCtoLocal(screener.created)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a new task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <form onSubmit={handleFormSubmit}>
              <FormControl fullWidth margin="normal">
                {/* <InputLabel htmlFor="taskName">Name</InputLabel> */}
                <TextField  label="Name"  id="taskName" variant="outlined" onChange={(e)=>setName(e.target.value)} />
              </FormControl>
              <FormControl fullWidth margin="normal">
                {/* <InputLabel htmlFor="taskDescription">Description</InputLabel> */}
                <TextField  label="Description"  id="taskDescription" variant="outlined" onChange={((e)=>setDescription(e.target.value))} />
              </FormControl>
              <FormControl fullWidth margin="normal">
                {/* <InputLabel htmlFor="taskEmail">Email</InputLabel> */}
                <TextField  label="Email"  id="taskEmail" variant="outlined" onChange={(e)=>setEmail(e.target.value)} />
              </FormControl>
              <InputLabel htmlFor="shareIn" style={{ marginTop: '24px' }} >Share in</InputLabel>
              <FormControl fullWidth margin="normal" style={{ marginRight: '24px' }}>
                <FormGroup row>
                  <FormControlLabel
                    control={<Checkbox onChange={(e)=>setIsInstagram(e.target.checked)} />}
                    labelPlacement="start"
                    label={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <InstagramIcon style={{ marginRight: '8px' }} />
                        Instagram
                      </div>
                    }
                  />
                  <FormControlLabel
                    control={<Checkbox onChange={(e)=>SetIsTwitter(e.target.checked)} />}
                    labelPlacement="start"
                    label={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TwitterIcon style={{ marginRight: '8px' }}  />
                        Twitter
                      </div>
                    }
                  />
                  <FormControlLabel
                    control={<Checkbox onChange={(e)=>SetIsFacebook(e.target.checked)} />}
                    labelPlacement="start"
                    label={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <FacebookIcon style={{ marginRight: '8px' }} />
                        Facebook
                      </div>
                    }
                  />
                  <FormControlLabel
                    control={<Checkbox onChange={(e)=>setIsLinkedIn(e.target.checked)} />}
                    labelPlacement="start"
                    label={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <LinkedInIcon style={{ marginRight: '8px' }} />
                        LinkedIn
                      </div>
                    }
                  />
                </FormGroup>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <FormControlLabel
                  control={<Checkbox checked={isRecurring}
                    onChange={handleIsRecurringChange} />}
                  labelPlacement="start"
                  label={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      isRecurring
                    </div>
                  }
                />
              </FormControl>
              {isRecurring && (
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
              )}
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="screeners">Screeners</InputLabel>
                <Select id="screeners" variant="outlined" onChange={(e)=>setSelectedScreener(e.target.value)}>
                  {allScreeners.map((screener, index)=>(
                    <MenuItem value={screener.id}>{screener.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </DialogActions>
            </form>
            {message}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScreenTable;
