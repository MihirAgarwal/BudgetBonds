import React from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Logo from "./Logo";
import '../App.css'
import Navitem from "./Navitem";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleLeft } from '@fortawesome/free-solid-svg-icons'
import IconButton from '@mui/material/IconButton';
import { Link, useNavigate } from "react-router-dom";

const items = [ {name:"Activities",active:1},
                {name:"Logs", active:0},
                {name:"Announcement",active:0},
                {name:"Settle",active:0},]

const GroupHeader=()=>{
    const navigate = useNavigate();
    return (
        <AppBar
        position="static"
        color="default"
        style={{background:"#0A1929" , color : "white", marginBottom: "0.5rem"}}
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
        >
        
        <Toolbar sx={{ flexWrap: 'wrap' }}>
            <IconButton aria-label="Example" sx={{mr:"2%",color:"white"}} onClick={() => {navigate("/groups")}}>
            <FontAwesomeIcon icon={faCircleLeft} />
            </IconButton>
            <Logo />
            <nav>
            {items.map(({name,active}) => { return(<Navitem name ={name} active = {active} />)})}            
          </nav>

        </Toolbar>
      </AppBar>
    )
}

export default GroupHeader;