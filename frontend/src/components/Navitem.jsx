import Link from '@mui/material/Link';
import React from "react";

const Navitem=(props)=>{
    return (
      <Link
      variant="button"
      color="#E5E5E5"
      href={props.name==="Personal" ? "/":props.name}
      sx={{ my: 1, mx: 1.5 }}
    >
      {props.name}
    </Link>
    )
}

export default Navitem;