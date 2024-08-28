import React, { useState } from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Optional: Function to handle the actual search logic
  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
    // Implement your search logic here or pass this function as a prop
  };

  return (
    <Box sx={{ margin: 2, width: "auto" }}>
      <TextField
        sx={{
          background: "white",
          width: 300,
       
        
        }}
        variant="outlined"
        placeholder="Search or get a Company"
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            handleSearch();
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );}

  export default SearchInput