import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const ControlTable = ({ data }) => {
  console.log(data);
  console.log(data?.data);
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#FF4500' }}>
            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
              Symbol
            </TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
              Company Name
            </TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
              Sector
            </TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
              Industry
            </TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
              Max API Year
            </TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
              Min API Year
            </TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
              Max DB Year
            </TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
              Min DB Year
            </TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
              Available in API
            </TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
              Available in DB
            </TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
              To Collect
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data?.data?.map((item, i) => (
              <TableRow
                key={item.company.symbol}
                sx={{ backgroundColor: i % 2 == 0 ? '#fff' : '#ddd' }}
              >
                <TableCell>{item.company.symbol}</TableCell>
                <TableCell>{item.company.name}</TableCell>
                <TableCell>{item.company.sector}</TableCell>
                <TableCell>{item.company.industry}</TableCell>
                <TableCell>{item.company.max_api_year}</TableCell>
                <TableCell>{item.company.min_api_year}</TableCell>
                <TableCell>{item.company.max_db_year}</TableCell>
                <TableCell>{item.company.min_db_year}</TableCell>

                <TableCell>{item.company.availableInAPI}</TableCell>
                <TableCell>{item.company.availableInDB}</TableCell>
                <TableCell>{item.company.missing_years}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ControlTable;
