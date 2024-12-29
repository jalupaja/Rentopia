import {Box, Button, FormControl, Grid2, InputLabel, List, ListItemButton, MenuItem, Select} from "@mui/material";
import {FrameStyle} from "./Register";
import Appbar from "../components/Appbar";
import * as React from "react";
import {GetAuthUser, ReturnHomeWhenLoggedOut} from "../helper/BackendHelper";
import Footer from "../components/Footer";

function ChatSite(){
    ReturnHomeWhenLoggedOut();

    const authUser = GetAuthUser();

    return(
        <Box sx = {{ ...FrameStyle}}>
            <Appbar authUser={authUser}/>
            <Grid2 container sx={{width : "100%", height : "auto"}}>
                <Grid2 size={3} sx={{padding : "1%"}}>
                    Addbutton
                    <List>
                        <ListItemButton>test 2
                        </ListItemButton>                        <ListItemButton>test 1
                        </ListItemButton>

                    </List>

                </Grid2>
                <Grid2 size={9}>
                    <Grid2>
                        statuslabel
                    </Grid2>
                    <Grid2>
                        chat
                    </Grid2>
                </Grid2>
            </Grid2>
            <Box sx={{flex : "auto"}}/>
            <Footer/>
        </Box>
    );
}

export default ChatSite;