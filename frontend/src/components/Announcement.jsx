import React from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from "@mui/material/Chip";
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';

const Announcement = (props) => {
    const message = "Mihir Agarwal added expense Lunch."
    const sender = "Mihir Agarwal"
    const date_time = "04-05-2023 22:05:30"

  return (
    <Card className='Announcement' sx={(props.current_user === sender) ? {backgroundColor:"#B0E0E6",marginLeft:"15%",width:"80%"} : {marginLeft:"5%",width:"80%"}}>
    <CardContent>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'baseline'
        }}
      >
        <Grid container spacing={0.5} justifyContent="space-evenly">
        <Grid
                item
                key="sender"
                md={1.5}
                textAlign={"left"}
        >
        <Chip label={sender} variant="outlined" size="small"/>
        </Grid>
        <Grid
                item
                key="Announcement"
                md={9}
        >
        <Typography align="left" variant="p" >
        {message} 
        </Typography>
        </Grid>
        <Grid
                item
                key="dateTime"
                md={1.5}
                textAlign={"right"}
        >
        <Chip label={date_time} variant="outlined" size="small"/>
        </Grid>
        </Grid>
      </Box>
      
    </CardContent>
</Card>
  )
}

export default Announcement