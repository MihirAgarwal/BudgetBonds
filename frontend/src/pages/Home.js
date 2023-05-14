import React, { createContext, useEffect } from "react"
import DayExpense from "../components/DayExpense";
import MonthInput from "../components/MonthInput";
import plus from "../components/images/plus.png";
import { Link,Routes,Route,BrowserRouter as Router, useNavigate } from "react-router-dom";
import Axios from "axios"
import { useQuery } from "@tanstack/react-query";

export const expenseContext=createContext();

const Home = () => {

    let finalData=[];

    const dataProcess = (data)=>{
        let index=0;
        console.log(data);
        while(index<data.length){
            const date=data[index].date;
            let arr=[];
            let j=index;
            while(j<data.length && data[j].date===date){
                arr.push(data[j]);
                j++;
            }
            finalData.push(arr);
            index=j;
        }

        console.log(finalData);
    }

    let pgNo=0;
    const navigate = useNavigate();
    // var current_date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+ date.getDate()+"T"+date.getHours()+":"+date.getMinutes();
    const {}=useQuery(["expenseList"],()=>{
        Axios.get(`http://localhost:2600/api/personal_expense/?pageNo=${pgNo}`,{withCredentials: true})
        .then((res)=>{
            let data=res.data.message;
            dataProcess(data);

        }).catch(res => {
            if(res.response.data.status===401){
                Axios.post('http://localhost:2600/api/refresh_token',{},{withCredentials:true})
                .then((res)=>{
                    console.log(res.data);
                }).catch(res => {
                    console.log(res);
                    alert(res.response.data.message);
                    navigate("/");
                })
    }
            console.log(res);
        })
    })

    //  useEffect(()=>{
    //     let response =  Axios.get('http://localhost:2600/api/');
        
    //  },[])

    return (
        <div style={{width:"80%",marginLeft:"10%"}}>
        <expenseContext.Provider value={{finalData}}>
            <MonthInput></MonthInput>
            {
                finalData.forEach((data,key)=>{
                    return (<DayExpense key={key}/>);
                })
            }
            {/* <DayExpense /> */}
            {/* <DayExpense></DayExpense>
            <DayExpense></DayExpense>
            <DayExpense></DayExpense>
            <DayExpense></DayExpense>
            <DayExpense></DayExpense>
            <DayExpense></DayExpense>
            <DayExpense></DayExpense>
            <DayExpense></DayExpense> */}
        

            <Link exact to="/addExpense" ><img src={plus} className="addExp"/></Link>   
        </expenseContext.Provider>    
        </div>
    )
}

export default Home;