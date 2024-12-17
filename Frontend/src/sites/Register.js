import Footer from "../components/Footer.js";
import ResponsePopup from "../components/ResponsePopup.js";
import * as React from 'react';

import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    Stack,
    TextField, Typography, RadioGroup, Radio, FormControlLabel, Grid2
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Appbar from "../components/Appbar.js";
import FetchBackend, { JWT_TOKEN, ReturnHomeWhenLoggedIn } from "../helper/BackendHelper.js";

export const centeredDivStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    width: "max-content",
    height: "auto",
    border: 2.5,
    borderRadius: '16px',
    margin: "auto",
    marginTop: '20px',
    marginBottom: '20px',
    padding: "5%"
}

export const FrameStyle = {
    width: "100%",
    height: "100%",
    flexDirection: "column",
    alignItems: 'center',
    display: "flex"
}

export const InputFieldStyle = {
    width: "100%",
    marginTop: "10px",
    marginBottom: "5px"
}

const GridCellStyle = {
    width: "100%"
}

function RegisterSite() {
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

    const defaultUserInfo = {
        name: {
            value: '',
            error: false,
            errorMessage: " "
        },
        email: {
            value: '',
            error: false,
            errorMessage: ' '
        },
        password1: {
            value: '',
            error: false,
            errorMessage: ' '
        },
        password2: {
            value: '',
            error: false,
            errorMessage: ' '
        },
        company: {
            value: '',
            error: false,
            errorMessage: ' '
        },
        usage: {
            value: '',
            error: false,
            errorMessage: ' '
        },
        street: {
            value: '',
            error: false,
            errorMessage: ' '
        },
        postalCode: {
            value: '',
            error: false,
            errorMessage: ' '
        },
        city: {
            value: '',
            error: false,
            errorMessage: ' '
        },
        country: {
            value: '',
            error: false,
            errorMessage: ' '
        }
    };
    //register logic
    const [userInfo, setUserInfo] = React.useState(defaultUserInfo);
    const postSubmitValidation = (userInfo) => {
        //all necessary values nonempty
        for (let attribute in userInfo) {
            if (attribute === "company" && userInfo["usage"].value === "private") {

                continue;
            }

            if (!userInfo[attribute].value) {
                return false;
            }
        }

        //passwords identical
        if (userInfo.password1.value !== userInfo.password2.value) {
            setUserInfo({
                ...userInfo,
                ["password2"]: {
                    ...userInfo["password2"],
                    errorMessage: "Passwords are not identical",
                    error: true
                }
            });

            return false;
        }
        return true;
    }
    const handleRegister = (e) => {
        e.preventDefault();

        //validate
        if (postSubmitValidation(userInfo)) {
            let registerData = {};
            for (let attribute in userInfo) {
                registerData[attribute] = userInfo[attribute].value;
            }

            FetchBackend('POST', 'register', registerData)
                .then(response => response.json())
                .then(data => {
                    if (data.registrationSuccess) {
                        setRegisterStatusLabel(<ResponsePopup reason={"success"} message={"Registration successful"} />);
                        setUserInfo(defaultUserInfo);
                    }
                    else {
                        setRegisterStatusLabel(<ResponsePopup reason={"error"} message={data.reason} />);
                    }
                })
                .catch((error) => {
                    setRegisterStatusLabel(<ResponsePopup message={"An error occurred. Please try again."} reason={"error"} />);
                });
        };
    };
    const handleChange = (e) => {
        const { name, value } = e.target;

        let isEmpty = false;
        let message = " ";
        if (!value || value.length === 0) {
            isEmpty = true;
            message = name + " cannot be empty";
        }

        setUserInfo({
            ...userInfo,
            [name]: {
                ...userInfo[name],
                value,
                errorMessage: message,
                error: isEmpty
            }
        });
    };

    const [registerStatusLabel, setRegisterStatusLabel] = React.useState(null);
    return (
        <Box sx={{ ...FrameStyle }}>
            <Appbar />
            {registerStatusLabel}
            <Stack sx={{ ...centeredDivStyle }}>
                <Typography gutterBottom variant="h6" >
                    How do you want to use Rentopia?
                </Typography>
                <RadioGroup required row aria-labelledby="demo-row-radio-buttons-group-label"
                    onChange={handleChange}
                    name="usage" value={userInfo.usage.value}>
                    <FormControlLabel value="private" control={<Radio />} label="private" required />
                    <FormControlLabel value="commercial" control={<Radio />} label="commercial" required />
                </RadioGroup>
                <TextField required sx={{ ...InputFieldStyle, display: userInfo.usage.value === "commercial" ? "inherit" : "none" }}
                    id="companyTextField" label="Company Name"
                    variant="outlined" name="company" onChange={handleChange} value={userInfo.company.value}
                    error={userInfo.company.error} helperText={userInfo.company.errorMessage} />

                <Grid2 container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid2 size={12} sx={{ ...GridCellStyle }}>
                        <Typography sx={{ marginTop: "10px" }} variant="button" gutterBottom variant="h6">
                            Your Account Information
                        </Typography>
                    </Grid2>
                    <Grid2 size={6}>

                        <Grid2 size={6} sx={{ ...GridCellStyle }}>
                            <TextField sx={{ ...InputFieldStyle }} name="name" label="Name" variant="outlined" required
                                onChange={handleChange} value={userInfo.name.value} error={userInfo.name.error}
                                helperText={userInfo.name.errorMessage} />
                        </Grid2>
                        <Grid2 size={6} sx={{ ...GridCellStyle }}>
                            <TextField sx={{ ...InputFieldStyle }} name="email" label="Email" variant="outlined" required
                                onChange={handleChange} value={userInfo.email.value} error={userInfo.email.error}
                                helperText={userInfo.email.errorMessage} />
                            <TextField sx={{ ...InputFieldStyle }}
                                required
                                type={showPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
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
                                helperText={userInfo.password1.errorMessage} error={userInfo.password1.error}
                            />
                        </Grid2>
                        <Grid2 size={6} sx={{ ...GridCellStyle }}>
                            <TextField sx={{ ...InputFieldStyle }}
                                type={showPassword ? 'text' : 'password'}
                                required
                                InputProps={{
                                    endAdornment: (
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
                                helperText={userInfo.password2.errorMessage} error={userInfo.password2.error}
                            />
                        </Grid2>
                    </Grid2>
                    <Grid2 size={6}>
                        <Grid2 size={6} sx={{ ...GridCellStyle }}>
                            <TextField sx={{ ...InputFieldStyle }} required
                                label="street" name="street" onChange={handleChange} value={userInfo.street.value}
                                helperText={userInfo.street.errorMessage} error={userInfo.street.error}
                            />
                        </Grid2>
                        <Grid2 size={6} sx={{ ...GridCellStyle }}>
                            <TextField sx={{ ...InputFieldStyle }} required type="number"
                                label="postal code" name="postalCode" onChange={handleChange} value={userInfo.postalCode.value}
                                helperText={userInfo.postalCode.errorMessage} error={userInfo.postalCode.error}
                            />
                        </Grid2>
                        <Grid2 size={6} sx={{ ...GridCellStyle }}>
                            <TextField sx={{ ...InputFieldStyle }} required
                                label="city" name="city" onChange={handleChange} value={userInfo.city.value}
                                helperText={userInfo.city.errorMessage} error={userInfo.city.error}
                            />
                        </Grid2>
                        <Grid2 size={6} sx={{ ...GridCellStyle }}>
                            <TextField sx={{ ...InputFieldStyle }} required
                                label="country" name="country" onChange={handleChange} value={userInfo.country.value}
                                helperText={userInfo.country.errorMessage} error={userInfo.country.error}
                            />
                        </Grid2>
                    </Grid2>
                </Grid2>
                <Button variant="contained" onClick={(e) => handleRegister(e)} sx={{ ...InputFieldStyle }}>
                    Create Account
                </Button>
            </Stack>
            <Box flex={"auto"} />
            <Footer />
        </Box>
    )
}

export default RegisterSite;
