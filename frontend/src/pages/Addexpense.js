import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Input from '@mui/joy/Input';
import Select from '@mui/joy/Select';
import { Grid } from '@mui/material';
import Option from '@mui/joy/Option';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack'
import { Link } from 'react-router-dom';


const Addexpense = () => {
    var date = new Date();
    var current_date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+ date.getDate()+"T"+date.getHours()+":"+date.getMinutes();
    const [dateTime, setDateTime] = React.useState(dayjs(current_date));
    const [category, setCategory] = React.useState("Category");
    const [amount,setAmount] = React.useState(0);
    const [expenseName,setExpenseName] = React.useState("");
    return (
        <div style = {{marginTop:"5rem",marginLeft:"40%"}}>
        <div className='DateSelector'>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker', 'DatePicker']}>
      <DateTimePicker
          label="Set Date"
          value={dateTime}
          onChange={(newDateTime) => setDateTime(newDateTime)}
          sx={{
            "& input": {
                color: '#E5E5E5',
            },
            "& .MuiFormLabel-root": {
                color: '#E5E5E5'
            },
            "& .MuiIconButton-root": {
              color: '#E5E5E5'
          },
            "& .MuiFormLabel-root.Mui-focused": {
                color: '#E5E5E5'
            },
            mb : 2
        }}
        />
        </DemoContainer>
    </LocalizationProvider>
    </div>
    <div className='ExpenseName'>
    <Input
      placeholder="Expense Name"
      sx={{ width: 250 ,
        mb : 2}}
      value={expenseName}
      onChange={(e)=>{setExpenseName(e.target.value)}}
    />
    </div>
    <div className='ExpenseCategory'>
    <Grid container spacing={2} justifyContent="left">
        <Grid
            item
            key="expDate"
            md={2.15}
        >
          <Select
            placeholder = "Category"
            variant="plain"
            value = {category}
            onChange={(_, value) => setCategory(value)}
            sx={{ width: '100%', '&:hover': { bgcolor: '' },mb: 2 }}
          >
            <Option value="Income" sx={{bgcolor:'lightgreen'}}>Income</Option>
            <Option value="Food">Food</Option>
            <Option value="Apparel">Apparel</Option>
            <Option value="Household">Household</Option>
            <Option value="Education">Education</Option>
            <Option value="Transportation">Transportation</Option>
            <Option value="Other">Other</Option>
          </Select>
          </Grid>
          </Grid>
    </div>

    <div className='InputAmount'>
    <Input
      placeholder="Amount"
      startDecorator={'Amount : ₹'}
      sx={{ width: 250 ,
        mb : 2}}
      value={amount}
      onChange={(e)=>{setAmount(e.target.value)}}
    />
    </div>

    <div className='AddExpenseButtons'>
    <Stack direction="row" spacing={2}>
      <Button variant="contained" color="success">
        Add Expense
      </Button>
      <Link exact to="/"><Button variant="outlined" color="error">
        Cancel
      </Button></Link>  
      
    </Stack>
    </div>
    </div>
    )
}

export default Addexpense;