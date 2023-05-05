import React from "react";
import { Link } from "react-router-dom";
import plus from "../components/images/plus.png";
import Group from "../components/Group";

const Groups=()=>{
    return(
        <div style={{width:"80%",marginLeft:"10%"}}>
        <Group />

        <Link exact to="/addGroup"><img src={plus} className="addExp"/></Link>   
        </div>
    )
}

export default Groups;