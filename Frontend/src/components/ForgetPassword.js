import Footer from "./Footer.js";
import {Box, Typography, Stack, Button, TextField, Alert, Snackbar } from "@mui/material";
import * as React from "react";
import {centeredDivStyle, FrameStyle, InputFieldStyle} from "./RegisterPage.js";
import {useNavigate} from "react-router-dom";
import FetchBackend, {ReturnHomeWhenLoggedIn} from "../helper/BackendHelper.js";
import Appbar from "./Appbar.js";
import {useState} from "react";
function ForgetPasswordPage(){
    ReturnHomeWhenLoggedIn();

    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);

    const [userEmail, setUserEmail] = React.useState("");
    const SendResetMail = () => {
        if(userEmail !== null && userEmail.length !== 0){
            console.log(userEmail);
            FetchBackend('POST','resetPasswordMail', {mail : userEmail})
                .then(response => response.json())
                .then(success => {
                    if(success){
                        setOpenSuccess(true);
                    }
                })
                .catch((error) => setOpenError(true))
        }
    }
    return (
        <Box sx = {{ ...FrameStyle}}>
            <Appbar/>
            <Snackbar open={openError}>
                <Alert severity="error">Sending Mail was not successful. Please try again.</Alert>
            </Snackbar>
            <Snackbar open={openSuccess}>
                <Alert>Send mail succeeded. Please look at your mail.</Alert>
            </Snackbar>
            <Stack sx = {{...centeredDivStyle}}>
                <Typography variant="button" gutterBottom variant="h6">
                    Forget your password?
                </Typography>
                <Typography variant="button" gutterBottom variant="p">
                    Type in your email for resetting your password:
                </Typography>

                <TextField sx={{...InputFieldStyle}} onChange={(e) => setUserEmail(e.target.value)} id="emailTextfield" label="Email" variant="outlined" />

                <Button variant="contained" onClick={() => SendResetMail()}
                         sx={{...InputFieldStyle}}>
                    Send Email
                </Button>
            </Stack>
            <Box flex={"auto"}/>
            <Footer/>
        </Box>
    )
}

export default ForgetPasswordPage;