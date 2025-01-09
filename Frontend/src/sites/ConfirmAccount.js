import {centeredDivStyle, FrameStyle, InputFieldStyle} from "./Register";
import Appbar from "../components/Appbar";
import {Box, Button, Divider, Link, Stack, TextField, Typography} from "@mui/material";
import Footer from "../components/Footer";
import * as React from "react";
import FetchBackend, {JWT_TOKEN, LOGIN_TOKEN, ReturnHomeWhenLoggedIn} from "../helper/BackendHelper";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";

function ConfirmAccountSite(){
    ReturnHomeWhenLoggedIn();

    const navigation = useNavigate();
    const loginToken = Cookies.get(LOGIN_TOKEN);
    if(!loginToken){
        console.log(loginToken);
        navigation("/login");
    }

    const { t } = useTranslation("", { keyPrefix: "confirmAccount" });

    const [statusLabel, setStatusLabel] = React.useState(null);
    const [authCode, setAuthCode] = React.useState(null);

    const confirm = () => {
        const requestData = {
            token : Cookies.get(LOGIN_TOKEN),
            authCode : authCode
        };

        FetchBackend("POST", "login/confirm", requestData)
            .then(response => response.json())
            .then(data => {
                if(data.status){
                    Cookies.set(JWT_TOKEN, data.jwt);
                    navigation("/");
                }else{
                    console.log(data);
                }
            })
            .catch((e) => {

            })
    };
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

                <Button variant="contained" onClick={() => confirm()}
                        sx={{ ...InputFieldStyle }}>
                    {t("verify")}
                </Button>
                <Divider >{t("problems ?")}</Divider>
                <Stack >
                    {//todo align left
                    }
                    <Link href="./" >{t("send again")}</Link>
                </Stack>
            </Stack>

            <Box flex={"auto"} />
            <Footer />
        </Box>
    );
}

export default ConfirmAccountSite;