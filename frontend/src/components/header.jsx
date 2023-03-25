import React from "react";
import { Container,Grid} from '@mui/material';
import Logo from "./Logo";

const Header=()=>{
    return (
        <>
            <Container maxWidth="lg" >
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <Logo />
                    </Grid>
                    <Grid item xs={3}>
                    </Grid>
                    <Grid item xs={6}>
                        <h4>hi</h4>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}

export default Header;