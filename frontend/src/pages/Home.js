import React, { useEffect } from "react"
import DayExpense from "../components/DayExpense";
import MonthInput from "../components/MonthInput";
import plus from "../components/images/plus.png";
import { Link,Routes,Route,BrowserRouter as Router } from "react-router-dom";
import Axios from "axios"

const Home = () => {

     useEffect(()=>{
        let response =  Axios.post('http://localhost:2600/api/refresh_token');
        response.then((r)=>console.log(r)).catch((err)=>console.log(err));
     },[])

    return (
        <div style={{width:"80%",marginLeft:"10%"}}>
        <MonthInput></MonthInput>
        <DayExpense></DayExpense>
        <DayExpense></DayExpense>
        <DayExpense></DayExpense>
        <DayExpense></DayExpense>
        <DayExpense></DayExpense>
        <DayExpense></DayExpense>
        <DayExpense></DayExpense>
        <DayExpense></DayExpense>
        

        <Link exact to="/addExpense"><img src={plus} className="addExp"/></Link>   
            
        </div>
    )
}

export default Home;