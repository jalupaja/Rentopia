import Footer  from "./Footer.js";
import * as React from 'react';

import {
    Box,
    Button,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    TextField, Typography, RadioGroup, Radio, FormControlLabel
} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import Appbar from "./Appbar.js";
import {ReturnHomeWhenLoggedIn} from "../helper/BackendHelper.js";

export const centeredDivStyle = {
    alignItems : 'center',
    justifyContent : 'center',
    width : "max-content",
    height: "auto",
    border : 2.5,
    borderRadius: '16px',
    margin : "auto",
    marginTop : '20px',
    marginBottom: '20px',
    padding : "40px"
}

export const FrameStyle = {
    width : "100%",
    height : "100%",
    flexDirection : "column",
    alignItems : 'center',
    display : "flex"
}

export const InputFieldStyle = {
    width : "100%",
    marginTop : "10px",
    marginBottom : "5px"
}

function RegisterPage(){
    ReturnHomeWhenLoggedIn();
    
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const [usageReason, setUsageReason] = React.useState("none");
    const onUsageChanged = (event, value) => {
        if(value === "commercial"){
            setUsageReason("inherit");
        }
        else{
            setUsageReason("none");
        }

    }

    return (
        <Box sx = {{ ...FrameStyle}}>
            <Appbar showLogin={false}/>

            <Stack sx = {{...centeredDivStyle}}>
                <Typography variant="button" gutterBottom variant="h6">
                    How do you want to use Rentopia?
                </Typography>
                <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group" onChange={onUsageChanged}>
                    <FormControlLabel value="private" control={<Radio />} label="private" />
                    <FormControlLabel value="commercial" control={<Radio />} label="commercial" />
                </RadioGroup>
                <TextField sx={{...InputFieldStyle, display:usageReason}} id="companyTextField" label="Company Name" variant="outlined" />

                <Typography sx={{marginTop:"10px"}} variant="button" gutterBottom variant="h6">
                    Your Account Information
                </Typography>
                <TextField sx={{...InputFieldStyle}} id="emailTextfield" label="Prename" variant="outlined" />
                <TextField sx={{...InputFieldStyle}} id="emailTextfield" label="Name" variant="outlined" />
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
                    Create Account
                </Button>
            </Stack>

            <Footer/>
        </Box>
    )
}

export default RegisterPage;