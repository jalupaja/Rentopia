import Appbar from "../components/Appbar.js";
import * as React from "react";
import {Box, Typography} from "@mui/material";
import Footer from "../components/Footer.js";
import FetchBackend, {GetAuthUser, JWTTokenExists} from "../helper/BackendHelper.js";
import {useEffect, useState} from "react";

function HelpCenterSite(){
    let authUser = GetAuthUser();

    let username = null;
    if(authUser !== null){
        username = authUser.name;
    }
    return (<Box>
        <Appbar authUser={authUser}/>
            <Box sx={{flexGrow: 1}}/>
            <Typography variant="button" gutterBottom variant="h6">
                Hello {username}
            </Typography>
        <Footer/>
    </Box>
    );
}

export default HelpCenterSite;