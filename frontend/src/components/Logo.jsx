import Typography from '@mui/material/Typography';
import logo from "./images/logo.png"
import { Link } from 'react-router-dom';
import React from "react";

const Logo=()=>{
    return (
        <>
        <Link style={{textDecoration: 'none'}} exact to="/home" >
        <img src={logo} alt="" width={"50px"} height={"50px"} style = {{marginRight:"5px "}}/>
        </Link>
          <Typography fontFamily={"Domine"} variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }} >
          <Link style={{textDecoration: 'none', color:"white"}} exact to="/home" >
            Budget Bonds
            </Link>
          </Typography>
          
        </>
    )
}

export default Logo;