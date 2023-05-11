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

const Log = () => {
    const log = "Mihir Agarwal added expense Lunch."
    const date_time = "04-05-2023 22:05:30"
  return (
    <Card className='Log'>
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
                            md={2}
                            textAlign={"center"}
                    >
                    <Chip label={date_time} variant="outlined" size="small"/>
                    </Grid>
                    <Grid
                            item
                            key="activity_name"
                            md={10}
                    >
                    <Typography align="left" variant="p" >
                    {log} 
                    </Typography>
                    </Grid>
                    </Grid>
                  </Box>
                  
                </CardContent>
    </Card>
  )
}

export default Log