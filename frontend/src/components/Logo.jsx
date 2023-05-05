import Typography from '@mui/material/Typography';
import logo from "./images/logo.png"
import React from "react";

const Logo=()=>{
    return (
        <>
        <img src={logo} alt="" width={"50px"} height={"50px"} style = {{marginRight:"5px "}}/>
          <Typography fontFamily={"Domine"} variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }} >
            Budget Bonds
          </Typography>
        </>
    )
}

export default Logo;