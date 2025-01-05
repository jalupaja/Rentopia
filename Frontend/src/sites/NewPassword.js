import Footer from "../components/Footer";
import {useParams} from "react-router-dom";
import {centeredDivStyle, FrameStyle, InputFieldStyle} from "./Register";
import Appbar from "../components/Appbar";
import {
    Box,
    Button,
    FormControl, IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import * as React from "react";
import {useTranslation} from "react-i18next";
import {Visibility, VisibilityOff} from "@mui/icons-material";

function NewPasswordSite(){
    const {token} = useParams()

    const [statusLabel, setStatusLabel] = React.useState(null);
    const [password, setPassword] = React.useState(null);
    const [showPassword, setShowPassword] = React.useState(false);

    const { t } = useTranslation("", { keyPrefix: "new_password" });

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMousePassword = (event) => {
        event.preventDefault();
    };

    const resetPassword = () => {
        //validate
        //fetch bakcend
    }
    return (
        <Box sx={{ ...FrameStyle }}>
            <Appbar />
            {statusLabel}
            <Stack sx={{ ...centeredDivStyle }}>
                <Typography variant="button" gutterBottom variant="h6">
                    {t("title_new_password")}
                </Typography>

                <FormControl sx={{ ...InputFieldStyle }} variant="outlined">
                    <InputLabel required htmlFor="outlined-adornment-password">{t("password")}</InputLabel>
                    <OutlinedInput
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : "password"}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMousePassword}
                                    onMouseUp={handleMousePassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label={t("password")}
                    />
                </FormControl>

                <Button variant="contained" onClick={() => resetPassword()}
                        sx={{ ...InputFieldStyle }}>
                    {t("reset_password")}
                </Button>
            </Stack>
            <Box flex={"auto"} />
            <Footer />
        </Box>
    );
}

export default NewPasswordSite;