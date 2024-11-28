import Footer from "./Footer.js";
import NavBar from "./NavBar.js";
import {Box, Typography, Stack, Button, TextField, Alert} from "@mui/material";
import * as React from "react";
import {centeredDivStyle, InputFieldStyle} from "./RegisterPage.js";
import {useNavigate} from "react-router-dom";
import FetchBackend from "../helper/BackendHelper.js";
function ForgetPasswordPage({sendResetEmailSuccess = null}){//todo pass parameter when sending email
    let resetFeedback = null;
    if(sendResetEmailSuccess){
        resetFeedback = <Alert>Send mail succeeded. Please look at your mail.</Alert>;
    }
    else if(sendResetEmailSuccess === false){
        resetFeedback = <Alert severity="error">Sending Mail was not successful. Please try again.</Alert>;
    }

    const navigate = useNavigate();
    const SendResetMail = () => {
        //todo post request backend
        FetchBackend()
        //todo success and error
    }
    return (
        <Box>
            <NavBar/>
            {resetFeedback}
            <Stack sx = {{...centeredDivStyle}}>
                <Typography variant="button" gutterBottom variant="h6">
                    Forget your password?
                </Typography>
                <Typography variant="button" gutterBottom variant="p">
                    Type in your email for resetting your password:
                </Typography>

                <TextField sx={{...InputFieldStyle}} id="emailTextfield" label="Email" variant="outlined" />

                <Button variant="contained" onClick={() => SendResetMail()} sx={{...InputFieldStyle}}>
                    Send Email
                </Button>
            </Stack>
            <Footer/>
        </Box>
    )
}

export default ForgetPasswordPage;