import { Select, MenuItem } from '@mui/material';

const DateDropdown = () => {
    const years = [];
    for (let year = 1950; year <= new Date().getFullYear(); year++) {
        years.push(year);
    }

    return (
        <Select variant="standard"
            label="to" value={years[0]}>
            {years.map((year) => (
                <MenuItem key={year} value={year}  >
                    {year}
                </MenuItem>
            ))}
        </Select>
    );
};

export default DateDropdown;