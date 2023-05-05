import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';

const DayExpense = () => {
    return (
    <Card className='dayexpCard'>
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
                    <Grid container spacing={4} justifyContent="space-evenly">
                    <Grid
                    item
                    key="expDate"
                    md={8}
                >
                    <Typography variant="h6" fontFamily={"Domine"} color="text.primary">
                      Date
                    </Typography>
                </Grid>
                <Grid
                    item
                    key="expIncome"
                    md={2}
                >
                    <Typography variant="h6" fontFamily={"Domine"} color="#449E48">
                      100
                    </Typography>
                </Grid>
                <Grid
                    item
                    key="expExpense"
                    md={2}
                >
                    <Typography variant="h6" fontFamily={"Domine"} color="#ff0000">
                      0
                    </Typography>
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
                    <Grid container spacing={4} justifyContent="space-evenly">
                    <Grid
                    item
                    key="expCategory"
                    md={2}
                >
                    <Typography align="right" variant="p" color="text.primary">
                      Category
                    </Typography>
                </Grid>
                <Grid
                    item
                    key="expName"
                    md={6}
                >
                    <Typography align="left" variant="p" color="text.primary">
                      Expense Name
                    </Typography>
                </Grid>
                <Grid
                    item
                    key="expIncome"
                    md={2}
                >
                    <Typography align="right" variant="p" color="#449E48">
                      100
                    </Typography>
                </Grid>
                <Grid
                    item
                    key="expExpense"
                    md={2}
                >
                    <Typography align="right" variant="p" color="#ff0000">
                      0
                    </Typography>
                </Grid>
                    
                </Grid>
                
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'baseline'
                    }}
                  >
                    <Grid container spacing={4} justifyContent="space-evenly">
                    <Grid
                    item
                    key="expCategory"
                    md={2}
                >
                    <Typography align="right" variant="p" color="text.primary">
                      Category
                    </Typography>
                </Grid>
                <Grid
                    item
                    key="expName"
                    md={6}
                >
                    <Typography align="left" variant="p" color="text.primary">
                      Expense Name
                    </Typography>
                </Grid>
                <Grid
                    item
                    key="expIncome"
                    md={2}
                >
                    <Typography align="right" variant="p" color="#449E48">
                      100
                    </Typography>
                </Grid>
                <Grid
                    item
                    key="expExpense"
                    md={2}
                >
                    <Typography align="right" variant="p" color="#ff0000">
                      0
                    </Typography>
                </Grid>
                    
                </Grid>
                
                  </Box>
                </CardContent>
              </Card>
    )
}

export default DayExpense;