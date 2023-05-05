import React from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';

const Group = () => {

    function importAll(r) {
        let images = {};
        r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
        return images;
      }

      const images = importAll(require.context('./images/GroupLogos', false, /\.(png|jpe?g|svg)$/));

      const img_json = {1:"V",2: "I",3:"B",4:"G",5:"Y",6:"O",7:"R"};
      const color = img_json[Math.ceil(Math.random()*7)];
      const image = images[`${color}.png`];
      const amount = 100;
      const grp_name = "Group Name";
    // console.log(img);

    return (
    <Card className='groupCard'>
        <Grid container spacing={0.5} justifyContent="space-evenly">
            <Grid
                item
                key="GroupLogo"
                textAlign="center"
                md={1}
                marginTop="1rem"
            >
                <img src={image} alt="Group Logo" style={{width:"5.5rem"}}/>
            </Grid> 
            <Grid
                    item
                    key="groupLogo"
                    md={11}
            >
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
                    
                    <Typography variant="h6" fontFamily={"Domine"}>
                      {grp_name}
                    </Typography>
                  </Box>
                  
                </CardContent>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'baseline'
                    }}
                  >
                    <Typography align="left" variant="p" color={amount >= 0 ? "green" : "red"}>
                    {amount >= 0 ? "You are owed ₹" : "You Owe ₹" }{amount}.
                    </Typography>
                  </Box>
                  
                </CardContent>
                </Grid>
                </Grid>
              </Card>
    )
}

export default Group;