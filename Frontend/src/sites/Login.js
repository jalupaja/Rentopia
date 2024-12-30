import {
    Button,
    Stack,
    TextField,
    Link,
    Box,
    Typography,
    InputLabel,
    OutlinedInput, InputAdornment, IconButton, FormControl, Alert
} from "@mui/material";
import Footer from "../components/Footer.js";
import { centeredDivStyle, FrameStyle, InputFieldStyle } from "./Register.js"
import { Visibility, VisibilityOff } from "@mui/icons-material";
import * as React from "react";
import FetchBackend, { JWT_TOKEN, ReturnHomeWhenLoggedIn } from "../helper/BackendHelper.js";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Appbar from "../components/Appbar.js";
import ResponsePopup from "../components/ResponsePopup.js";
import { useTranslation } from "react-i18next";

function LoginSite() {
    const navigation = useNavigate();

    ReturnHomeWhenLoggedIn();


    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };
    const { t } = useTranslation("", { keyPrefix: "login" });

    //login
    const [userEmail, setUserEmail] = React.useState("");
    const [userPassword, setUserPassword] = React.useState("");
    const SubmitLogin = () => {
        let loginData = {
            useremail: userEmail,
            userpassword: userPassword
        };

        FetchBackend('POST', 'login', loginData)
            .then(response => response.json())
            .then(data => {
                if (data.status) {
                    Cookies.set(JWT_TOKEN, data.jwt);
                    navigation("/");
                }
                else {
                    setRegisterStatusLabel(<ResponsePopup message={t("error_password")} reason={"error"} />);
                }

            })
            .catch((error) => {
                setRegisterStatusLabel(<ResponsePopup message={t("error_unknown")} reason={"error"} />);
            });
    };

    const [registerStatusLabel, setRegisterStatusLabel] = React.useState(null);

    return (
        <Box sx={{ ...FrameStyle }}>
            <Appbar showLogin={false} />

            {registerStatusLabel}

            <Stack sx={{ ...centeredDivStyle }}>

                <Typography variant="button" gutterBottom variant="h5">
                    {t("welcome")}
                </Typography>
                <TextField sx={{ ...InputFieldStyle }} id="emailTextfield" label={t("email")} variant="outlined"
                    required value={userEmail} onChange={(event) => setUserEmail(event.target.value)}
                />
                <FormControl sx={{ ...InputFieldStyle }} variant="outlined">
                    <InputLabel required htmlFor="outlined-adornment-password">{t("password")}</InputLabel>
                    <OutlinedInput
                        value={userPassword} onChange={(event) => setUserPassword(event.target.value)}
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : t("password")}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={
                                        showPassword ? t("hide_password") : t("display_password")
                                    }
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    onMouseUp={handleMouseUpPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label={t("password")}
                    />
                </FormControl>
                <Button variant="contained" onClick={() => SubmitLogin()} sx={{ ...InputFieldStyle }}>
                    {t("login")}
                </Button>
                <Link href="./register" marginTop={2}>{t("create_account")}</Link>
                <Link href="/resetPassword" >{t("forgot_password")}</Link>
            </Stack>
            <Box flex={"auto"} />
            <Footer />
        </Box>

    )
}

export default LoginSite;
