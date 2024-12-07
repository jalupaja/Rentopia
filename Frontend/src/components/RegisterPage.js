import Footer  from "./Footer.js";
import * as React from 'react';

import {
    Box,
    Button,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    Link,
    OutlinedInput,
    Stack,
    TextField, Typography, RadioGroup, Radio, FormControlLabel, AppBar
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

    //hide password logic
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    //register logic
    const [userInfo, setUserInfo] = React.useState({
        prename:{
            value:'',
            error:false,
            errorMessage:''
        },
        name:{
            value:'',
            error:false,
            errorMessage:''
        },
        email:{
            value:'',
            error:false,
            errorMessage:''
        },
        password1:{
            value:'',
            error:false,
            errorMessage:''
        },
        password2:{
            value:'',
            error:false,
            errorMessage:''
        },
        company:{
            value:'',
            error:false,
            errorMessage:''
        },
        usage:{
            value:'',
            error:false,
            errorMessage:''
        }
    })
    const postSubmitValidation = (userInfo) => {
        //all necessary values nonempty
        for(let attribute in userInfo){
            if(attribute === "company" && userInfo["usage"].value === "private"){

                continue;
            }

            if(!userInfo[attribute].value){
                console.log(attribute);
                console.log(attribute.value);
                return false;
            }
        }

        //passwords identical
        if(userInfo.password1.value !== userInfo.password2.value){
            setUserInfo({
                ...userInfo,
                ["password2"]:{
                    ...userInfo["password2"],
                    errorMessage: "Passwords are not identical",
                    error : true
                }
            });

            return false;
        }
        return true;
    }
    const handleRegister = (e) => {
        e.preventDefault();

        //validate
        if(postSubmitValidation(userInfo)){
            //post request
            // Perform login logic here with lo

            //todo extract register data from user data with usage reason
            console.log('Login data:', userInfo);
            return;//remove
        };
    };
    const handleChange = (e) => {
        const {name, value} = e.target;

        let isEmpty = false;
        let message = "";
        if(!value || value.length === 0){
            isEmpty = true;
            message = name + " cannot be empty";
        }

        setUserInfo({
            ...userInfo,
            [name]:{
                ...userInfo[name],
                value,
                errorMessage : message,
                error : isEmpty
            }
        });
    };

    return (
        <Box sx = {{ ...FrameStyle}}>
            <Appbar showLogin={false}/>

            <Stack sx = {{...centeredDivStyle}}>
                <Typography variant="button" gutterBottom variant="h6" >
                    How do you want to use Rentopia?
                </Typography>
                <RadioGroup required row aria-labelledby="demo-row-radio-buttons-group-label"
                            onChange={handleChange}
                    name="usage" value={userInfo.usage.value}>
                    <FormControlLabel value="private" control={<Radio />} label="private" required/>
                    <FormControlLabel value="commercial" control={<Radio />} label="commercial" required/>
                </RadioGroup>
                <TextField required sx={{...InputFieldStyle, display: userInfo.usage.value==="commercial"? "inherit":"none" }}
                           id="companyTextField" label="Company Name"
                           variant="outlined" name="company" onChange={handleChange} value={userInfo.company.value}
                           error={userInfo.company.error} helperText={userInfo.company.errorMessage}/>

                <Typography sx={{marginTop:"10px"}} variant="button" gutterBottom variant="h6">
                    Your Account Information
                </Typography>
                <TextField sx={{...InputFieldStyle}} name="prename" label="Prename" variant="outlined" required
                           onChange={handleChange} value={userInfo.prename.value} error = {userInfo.prename.error}
                           helperText={userInfo.prename.error ? userInfo.prename.errorMessage : ""}/>
                <TextField sx={{...InputFieldStyle}} name="name" label="Name" variant="outlined" required
                           onChange={handleChange} value={userInfo.name.value} error = {userInfo.name.error}
                           helperText={userInfo.name.error ? userInfo.name.errorMessage : ""}/>
                <TextField sx={{...InputFieldStyle}} name="email" label="Email" variant="outlined" required
                           onChange={handleChange} value={userInfo.email.value} error = {userInfo.email.error}
                           helperText={userInfo.email.errorMessage}/>
                    <TextField sx={{...InputFieldStyle}}
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{
                            endAdornment:(
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={showPassword ? 'hide the password' : 'display the password'}
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        onMouseUp={handleMouseUpPassword}
                                        edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>)
                        }}

                        label="Password" name="password1" onChange={handleChange} value={userInfo.password1.value}
                        helperText={userInfo.password1.errorMessage} error = {userInfo.password1.error}
                    />
                    <TextField sx={{...InputFieldStyle}}
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{
                            endAdornment:(
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={showPassword ? 'hide the password' : 'display the password'}
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        onMouseUp={handleMouseUpPassword}
                                        edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>)
                        }}
                        label="Password" name="password2" onChange={handleChange} value={userInfo.password2.value}
                        helperText={userInfo.password2.errorMessage} error = {userInfo.password2.error}
                    />

                <Button variant="contained" onClick={(e) => handleRegister(e)} sx={{...InputFieldStyle}}>
                    Create Account
                </Button>
            </Stack>

            <Footer/>
        </Box>
    )
}

export default RegisterPage;