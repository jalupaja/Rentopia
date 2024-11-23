import {
    Button,
    Stack,
    TextField,
    Link,
    styled,
    Box,
    InputBase,
    Toolbar,
    Typography,
    InputLabel,
    OutlinedInput, InputAdornment, IconButton, FormControl
} from "@mui/material";
import Footer from "./Footer.js";
import NavBar from "./NavBar.js";
import {centeredDivStyle, FrameStyle, InputFieldStyle} from "./RegisterPage.js"
import {Visibility, VisibilityOff} from "@mui/icons-material";
import * as React from "react";



function LoginComponent(){
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    return (
        <Box sx = {{ ...FrameStyle}}>
            <NavBar showLogin={false}/>

            <Stack sx = {{...centeredDivStyle}}>
                <Typography variant="button" gutterBottom variant="h5">
                    Welcome to Rentopia
                </Typography>
                <TextField sx={{...InputFieldStyle}} id="emailTextfield" label="Email" variant="outlined" />
                <FormControl sx={{ ...InputFieldStyle }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
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
                <Button variant="contained" href="./" sx={{...InputFieldStyle}}>
                    Login
                </Button>
                <Link href="./register" marginTop={2}>Create Account</Link>
                <Link href="/resetPassword" >Forget your password?</Link>
            </Stack>

            <Footer/>
        </Box>

    )
}

export default LoginComponent;