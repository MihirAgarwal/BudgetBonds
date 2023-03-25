import { Container } from "@mui/system";
import React from "react";
import logo from "./images/logo.png"
<style>
  @import url('https://fonts.googleapis.com/css2?family=Domine:wght@700&display=swap');
</style>

const Logo=()=>{
    return (
        <>
            <Container maxWidth="lg">
                <img src={logo} alt="" width={"50px"} height={"50px"} />
                <span>
                    BudgetBonds
                </span>             
            </Container>
        </>
    )
}

export default Logo;