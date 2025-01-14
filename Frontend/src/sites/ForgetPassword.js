import Footer from "../components/Footer.js";
import { Box, Typography, Stack, Button, TextField, Alert, Snackbar } from "@mui/material";
import * as React from "react";
import { centeredDivStyle, FrameStyle, InputFieldStyle } from "./Register.js";
import { useNavigate } from "react-router-dom";
import FetchBackend, {GetAuthUser, ReturnHomeWhenLoggedIn} from "../helper/BackendHelper.js";
import Appbar from "../components/Appbar.js";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ResponsePopup from "../components/ResponsePopup";
function ForgetPasswordSite() {
    const authUser = GetAuthUser();

    const [statusLabel, setStatusLabel] = React.useState(null);
    const [userEmail, setUserEmail] = React.useState("");

    const { t } = useTranslation("", { keyPrefix: "forgotpassword" });

    const SendResetMail = () => {
        if (userEmail !== null && userEmail.length !== 0) {
            FetchBackend('POST', 'resetPasswordMail', { mail: userEmail })
                .then(response => response.json())
                .then(data => {
                    const status = data.success ? "success" : "error";
                    let message = null;
                    if(data.success){
                        message = t("succ_mail");
                    }
                    else{
                        if(data.reason === "no_existent_user"){
                            message = t("no_existent_user");
                        }
                        else{
                            message = t("error_mail");
                        }
                    }
                    setStatusLabel(<ResponsePopup message={message} reason={status} />);
                })
                .catch((error) => {
                    const message = t("error_mail");
                    setStatusLabel(<ResponsePopup message={message} reason={"error"} />);
                });
        }
    }
    return (
        <Box sx={{ ...FrameStyle }}>
            <Appbar authUser={authUser}/>
            {statusLabel}
            <Stack sx={{ ...centeredDivStyle }}>
                <Typography variant="button" gutterBottom variant="h6">
                    {t("forgot_password")}
                </Typography>
                <Typography variant="button" gutterBottom variant="p">
                    {t("write_mail")}
                </Typography>

                <TextField sx={{ ...InputFieldStyle }} onChange={(e) => setUserEmail(e.target.value)} id="emailTextfield" label="Email" variant="outlined" />

                <Button variant="contained" onClick={() => SendResetMail()}
                    sx={{ ...InputFieldStyle }}>
                    {t("send_mail")}
                </Button>
            </Stack>
            <Box flex={"auto"} />
            <Footer />
        </Box>
    )
}

export default ForgetPasswordSite;
