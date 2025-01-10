import Footer from "../components/Footer.js";
import { Box, Typography, Stack, Button, TextField, Alert, Snackbar } from "@mui/material";
import * as React from "react";
import { centeredDivStyle, FrameStyle, InputFieldStyle } from "./Register.js";
import { useNavigate } from "react-router-dom";
import FetchBackend, { ReturnHomeWhenLoggedIn } from "../helper/BackendHelper.js";
import Appbar from "../components/Appbar.js";
import { useState } from "react";
import { useTranslation } from "react-i18next";
function ForgetPasswordSite() {
    ReturnHomeWhenLoggedIn();

    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);

    const [userEmail, setUserEmail] = React.useState("");
    const { t } = useTranslation("", { keyPrefix: "forgotpassword" });
    const SendResetMail = () => {
        if (userEmail !== null && userEmail.length !== 0) {
            console.log(userEmail);
            FetchBackend('POST', 'resetPasswordMail', { mail: userEmail })
                .then(response => response.json())
                .then(success => {
                    if (success) {
                        setOpenSuccess(true);
                    }
                })
                .catch((error) => setOpenError(true))
        }
    }
    return (
        <Box sx={{ ...FrameStyle }}>
            <Appbar />
            <Snackbar open={openError}>
                <Alert severity="error">{t("error_mail")}</Alert>
            </Snackbar>
            <Snackbar open={openSuccess}>
                <Alert>{t("succ_mail")}</Alert>
            </Snackbar>
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
