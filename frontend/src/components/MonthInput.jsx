import React, { useState } from 'react';
import Divider from '@mui/joy/Divider';
import Input from '@mui/joy/Input';
import Select from '@mui/joy/Select';
import { Grid } from '@mui/material';
import Option from '@mui/joy/Option';


const MonthInput = () => {

    const [month,setMonth] = useState("April");
    const [year,setYear] = useState(2023);
    
    return (
        <Grid container spacing={2} justifyContent="left">
                <Grid
                    item
                    key="expDate"
                    md={1.2}
                >
          <Select
            variant="plain"
            value = {month}
            onChange={(_, value) => setMonth(value)}
            sx={{ width: '100%', '&:hover': { bgcolor: '' },mb: 1 }}
          >
            <Option value="January">Jan</Option>
            <Option value="February">Feb</Option>
            <Option value="March">March</Option>
            <Option value="April">April</Option>
            <Option value="May">May</Option>
            <Option value="June">June</Option>
            <Option value="July">July</Option>
            <Option value="August">August</Option>
            <Option value="September">Sept</Option>
            <Option value="October">Oct</Option>
            <Option value="November">Nov</Option>
            <Option value="December">Dec</Option>
          </Select>
          </Grid>
          <Grid
                    item
                    key="expDate"
                    md={1.2}
                >
          <Select
            variant="plain"
            value = {year}
            onChange={(_, value) => setYear(value)}
            sx={{ width: '100%', '&:hover': { bgcolor: '' },mb: 1 }}
          >
            <Option value={2023}>2023</Option>
            <Option value={2022}>2022</Option>
            <Option value={2021}>2021</Option>
          </Select>
          </Grid>
          </Grid>
    );
}

export default MonthInput;