import { Box, TextField } from '@mui/material';
import React from 'react'
import DataVisualizationItem from './DataVisualizationItem';

const data = [{
    "company": "Hermes International SCA",
    "category": "All",
    "measure": "All",
    "metric": "cashFlowToDebtRatio",
    "model": "Buffett_Clark",
    "model_from": "Current Y -10",
    "model_to": "Current Y -1",
    "question": "Is the company recording more and more money from its sales ?",
    "range": "Norm",
    "tool": "ratios",
}, {
    "company": "Hermes International SCA",
    "category": "All",
    "measure": "All",
    "metric": "cashFlowCoverageRatios",
    "model": "Buffett_Clark",
    "model_from": "Current Y -10",
    "model_to": "Current Y -1",
    "question": "Is the company recording more and more money from its sales ?",
    "range": "Norm",
    "tool": "ratios",
},
{
    "company": "Hermes International SCA",
    "tool": "financials",
    "measure": "Income statement",
    "category": "Income",
    "model_from": "Current Y -10",
    "model_to": "Current Y -1",
    "question": "Is the company recording more and more money from its sales ?",
    "metric": "revenue",
    "model": "Buffett_Clark",
    "range": "Norm"
}]

const DataVisualization = (props) => {
    return (
        <React.Fragment>
            <Box sx={{ minWidth: '100%' }}>
            <TextField
                label={"Company"}
                variant="filled"
                value={data[0].company}
                sx={{ ml: 2 }} />

            </Box>
            {data.map((item, index) => {
                return (
                    <DataVisualizationItem key={index} content={item} company={item.company} />
                );
            })}
        </React.Fragment>
    );
}

export default DataVisualization;