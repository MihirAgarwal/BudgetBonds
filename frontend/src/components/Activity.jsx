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

const Activity = () => {
    const amount = 100;
    const activity_name = "Activity Name";
    const date = "04-05-2023";
    const category = "Food";
  return (
    <Card className='activityCard'>
                <CardContent
                sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'light'
                        ? theme.palette.grey[200]
                        : theme.palette.grey[700],
                  }}
                >   
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'baseline'
                    }}
                  >
                    <Grid container spacing={0.5} justifyContent="space-evenly">
                    <Grid
                            item
                            key="activity_name"
                            md={10}
                    >
                    
                    <Typography variant="h6" fontFamily={"Domine"}>
                      {activity_name}
                    </Typography>
                    </Grid>
                    <Grid
                            item
                            key="date_time"
                            md={2}
                            textAlign="right"
                    >
                    <Chip label={date} variant="outlined" size="medium"/>
                    </Grid>
                    </Grid>
                  </Box>
                  
                </CardContent>
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
                            key="activity_name"
                            md={10}
                    >
                    <Typography align="left" variant="p" color={amount >= 0 ? "green" : "red"}>
                    {amount >= 0 ? "You are owed ₹" : "You Owe ₹" }{amount}.
                    </Typography>
                    </Grid>
                    <Grid
                            item
                            key="date_time"
                            md={2}
                            textAlign="right"
                    >
                    <Chip label={category} color="primary" variant="outlined" size="small"/>
                    </Grid>
                    </Grid>
                  </Box>
                  
                </CardContent>
              </Card>
  )
}

export default Activity