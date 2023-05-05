import React from "react"
import DayExpense from "../components/DayExpense";
import MonthInput from "../components/MonthInput";
import plus from "../components/images/plus.png";
import { Link,Routes,Route,BrowserRouter as Router } from "react-router-dom";

const Home = () => {
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