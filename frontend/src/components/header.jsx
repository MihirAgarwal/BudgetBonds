import React from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Logo from "./Logo";
import '../App.css'
import Navitem from "./Navitem";

const items = [ {name:"Personal",active:1},
                {name:"Groups", active:0},
                {name:"Reports",active:0},
                {name:"Accounts",active:0}]

const Header=()=>{
    return (
        <AppBar
        position="static"
        color="default"
        style={{background:"#0A1929" , color : "white", marginBottom: "0.5rem"}}
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
        >
        
        <Toolbar sx={{ flexWrap: 'wrap' }}>
            <Logo />
            <nav>
            {items.map(({name,active}) => { return(<Navitem name ={name} active = {active} />)})}            
          </nav>

        </Toolbar>
      </AppBar>
    )
}

export default Header;