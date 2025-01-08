import {centeredDivStyle, FrameStyle, InputFieldStyle} from "./Register";
import Appbar from "../components/Appbar";
import {Box, Button, Divider, Link, Stack, TextField, Typography} from "@mui/material";
import Footer from "../components/Footer";
import * as React from "react";
import {ReturnHomeWhenLoggedIn} from "../helper/BackendHelper";
import {useTranslation} from "react-i18next";

function ConfirmAccountSite(){
    ReturnHomeWhenLoggedIn();

    const { t } = useTranslation("", { keyPrefix: "confirmAccount" });

    const [statusLabel, setStatusLabel] = React.useState(null);
    const [authCode, setAuthCode] = React.useState(null);

    return (
        <Box sx={{ ...FrameStyle }}>
            <Appbar showLogin={false}/>
            {statusLabel}
            <Stack sx={{ ...centeredDivStyle }}>
                <Typography variant="button" gutterBottom variant="h6">
                    {t("Two-factor authentication")}
                </Typography>
                <Typography variant="button" gutterBottom variant="p">
                    {t("Your received just an emailType in your authentication code from your email")}
                </Typography>

                <TextField sx={{ ...InputFieldStyle }}
                           onChange={(e) => setAuthCode(e.target.value)}
                           id="emailTextfield"
                           label="XXXXXX"
                           variant="outlined"
                           slotProps={{ htmlInput: { maxLength: 6 } }}
                />

                <Button variant="contained" onClick={() => SendResetMail()}
                        sx={{ ...InputFieldStyle }}>
                    {t("verify")}
                </Button>
                <Divider >{t("problems ?")}</Divider>
                <Stack >
                    {//todo align left
                    }
                    <Link href="./" >{t("send again")}</Link>
                    <Link href="/resetPassword" >{t("forgot_password")}</Link>
                </Stack>
            </Stack>

            <Box flex={"auto"} />
            <Footer />
        </Box>
    );
}

export default ConfirmAccountSite;