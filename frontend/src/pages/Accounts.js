import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from "@mui/material/Chip";
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { Link } from 'react-router-dom';

const Accounts = () => {

    const user_name = "Mihir Agarwal";
    const email = "mihira48@gmail.com"

  return (
    <Card className='Log' sx={{width:"90%",marginLeft:"5%",marginTop:"1rem"}}>
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
                        key="activity_name"x
                        md={2}
                        textAlign="center"
                >
                    <IconButton aria-label="Example" sx={{height:"100%"}}>
                    <FontAwesomeIcon icon={faUser} size="2xl" style={{color: "#0d43a0",}} />
                    </IconButton>
                </Grid>
                <Grid
                        item
                        key="activity_name"x
                        md={8}
                >
                <Typography align="left" variant="h6" >
                {user_name} 
                </Typography>
                <Typography align="left" variant="h6" >
                {email} 
                </Typography>
                </Grid>
                <Link exact to="/">
                <Grid
                        item
                        key="activity_name"x
                        md={2}
                        textAlign="center"
                >
                    <Button variant="contained" color="error">
                        Logout
                    </Button>
                </Grid>
                </Link>
                </Grid>
            </Box>
        
        </CardContent>
    </Card>
    )
}

export default Accounts