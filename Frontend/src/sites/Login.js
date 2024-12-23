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
                    setRegisterStatusLabel(<ResponsePopup message={"Wrong email or password!"} reason={"error"} />);
                }

            })
            .catch((error) => {
                setRegisterStatusLabel(<ResponsePopup message={"An error occurred. Please try again."} reason={"error"} />);
            });
    };

    const [registerStatusLabel, setRegisterStatusLabel] = React.useState(null);

    return (
        <Box sx={{ ...FrameStyle }}>
            <Appbar showLogin={false} />

            {registerStatusLabel}

            <Stack sx={{ ...centeredDivStyle }}>

                <Typography variant="button" gutterBottom variant="h5">
                    Welcome to Rentopia
                </Typography>
                <TextField sx={{ ...InputFieldStyle }} id="emailTextfield" label="Email" variant="outlined"
                    required value={userEmail} onChange={(event) => setUserEmail(event.target.value)}
                />
                <FormControl sx={{ ...InputFieldStyle }} variant="outlined">
                    <InputLabel required htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        value={userPassword} onChange={(event) => setUserPassword(event.target.value)}
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={
                                        showPassword ? 'hide the password' : 'display the password'
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
                        label="Password"
                    />
                </FormControl>
                <Button variant="contained" onClick={() => SubmitLogin()} sx={{ ...InputFieldStyle }}>
                    Login
                </Button>
                <Link href="./register" marginTop={2}>Create Account</Link>
                <Link href="/resetPassword" >Forget your password?</Link>
            </Stack>
            <Box flex={"auto"} />
            <Footer />
        </Box>

    )
}

export default LoginSite;
