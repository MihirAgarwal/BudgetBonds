import * as React from "react"
import Announcement from "../components/Announcement";
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";

const Announcements = () => {
    const current_user = "Mihir Agarwal";
    const [announcement, setAnnouncement] = React.useState('');
  return (
    <div >
        <Announcement current_user={current_user} />
        <div style={{position:"fixed",left:"10%",bottom:"5%",width:"80%"}}> 
        <TextField fullWidth id="messageBox" label="Announcemet" variant="outlined" color="primary" focused
         sx={{"& .MuiInputBase-input": {color: '#E5E5E5'},}}
         value={announcement}
         onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setAnnouncement(event.target.value);}}>
        </TextField>
        <Button variant="contained" size="small" style={{position:"fixed",right:"11%",bottom:"7%"}} onClick={() => {}}>
                Send
        </Button>
    </div>
    </div>
  ) 
}

export default Announcements