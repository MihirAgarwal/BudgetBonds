import Activity from "../components/Activity";
import { Link } from "react-router-dom";


const Activities = () => {


  return (
    <div style={{width:"80%",marginLeft:"10%"}}>
    <Link style={{textDecoration: 'none'}} exact to="/activity"><Activity /></Link>
    </div>
  )
}

export default Activities;