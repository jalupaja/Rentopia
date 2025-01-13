import {centeredDivStyle, FrameStyle, InputFieldStyle} from "./Register";
import Appbar from "../components/Appbar";
import {Box, Button, Divider, Link, Stack, TextField, Typography} from "@mui/material";
import Footer from "../components/Footer";
import * as React from "react";
import FetchBackend, {JWT_TOKEN, LOGIN_TOKEN, ReturnHomeWhenLoggedIn} from "../helper/BackendHelper";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import ResponsePopup from "../components/ResponsePopup";
import {useEffect} from "react";

function ConfirmAccountSite(){
    ReturnHomeWhenLoggedIn();
    const navigation = useNavigate();
    useEffect(() => {
        const loginToken = Cookies.get(LOGIN_TOKEN);
        if(!loginToken){
            navigation("/login");
        }
    }, []);

    const { t } = useTranslation("", { keyPrefix: "confirmAccount" });

    const [statusLabel, setStatusLabel] = React.useState(null);
    const [authCode, setAuthCode] = React.useState(null);

    const sendMailAgain = (e) => {
        if(!Cookies.get(LOGIN_TOKEN)){
            navigation("/login");
        }
        const requestData = {
          "token" : Cookies.get(LOGIN_TOKEN)
        };
        FetchBackend("POST", "login/confirm/email", requestData)
            .then(response => response.json())
            .then(data => {
                if(data.success){
                    Cookies.set(LOGIN_TOKEN, data.token);
                }
                else{
                    if(data.reason && data.reason === "no_token"){
                        navigation("/login");
                    }
                    else{
                        setStatusLabel(<ResponsePopup message={t("general_error")} reason="error"/>)
                    }
                }
            })
            .catch(e => setStatusLabel(<ResponsePopup message={t("general_error")} reason="error"/>));
    };
    const handleInput = (e) => {
        const onlyNums = e.target.value.replace(/[^0-9]/g, '');
        setAuthCode(onlyNums);
    }
    const confirm = () => {
        if(authCode && authCode.length > 0 ) {


            const requestData = {
                token: Cookies.get(LOGIN_TOKEN),
                authCode: authCode
            };

            FetchBackend("POST", "login/confirm", requestData)
                .then(response => response.json())
                .then(data => {
                    if (data.status) {
                        Cookies.remove(LOGIN_TOKEN);
                        Cookies.set(JWT_TOKEN, data.jwt);
                        navigation("/");
                    } else {
                        let message = t("general_error");
                        switch (data.message) {
                            case "token_expired" :
                                message = t("token_expired");
                            case "token_invalid" :
                                message = t("token_invalid");
                            case "no_token" : navigation("/login");
                        }
                        setStatusLabel(<ResponsePopup message={message} reason="error"/>)
                    }
                })
                .catch((e) => setStatusLabel(<ResponsePopup message={t("general_error")} reason="error"/>))
        }
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
                           onChange={handleInput}
                           value={authCode}
                           id="emailTextfield"
                           label="XXXXXX"
                           variant="outlined"
                           slotProps={{ htmlInput: { maxLength: 6 } }}
                />

                <Button variant="contained" onClick={() => confirm()}
                        sx={{ ...InputFieldStyle }}>
                    {t("verify")}
                </Button>
                <Stack >
                    <Link onClick={sendMailAgain}>{t("send again")}</Link>
                </Stack>
            </Stack>

            <Box flex={"auto"} />
            <Footer />
        </Box>
    );
}

export default ConfirmAccountSite;