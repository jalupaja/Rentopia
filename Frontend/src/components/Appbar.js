import { AppBar, Box, FormControl, InputBase, Select, Toolbar, Button, MenuItem, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { alpha, styled } from "@mui/material";
import * as React from 'react';
import Logo from "../image/RentopiaLogo64.jpg";
import { useNavigate, Link } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuComponent from "./MenuComponent.js";
import LanguageSelector from "./LanguageSelector.js";
import { useTranslation } from "react-i18next";
import { Logout } from "../helper/BackendHelper.js"

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
    width: '100%',
}));

const StyledSelect = styled(Select)(({ theme }) => ({
    '& .MuiOutlinedInput-notchedOutline': {
        border: `1px solid ${alpha(theme.palette.common.white, 0.5)}`,
        backgroundColor: 'transparent',
        '&:hover': {
            borderColor: alpha(theme.palette.common.white, 0.75),
        },
    },
    '& .MuiSelect-icon': {
        color: 'white',
    },
    '& .MuiInputBase-input': {
        color: 'white',
    },
    color: 'inherit',
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${alpha(theme.palette.common.white, 0.5)}`,
    backgroundColor: 'transparent',
    '&:hover': {
        borderColor: alpha(theme.palette.common.white, 0.75),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        width: 'auto',
    },
}));

const logo = {
    imageUrl: '/pictures/RentopiaLogo64.jpg',
};

function Appbar({ showLogin = true, authUser = null, searchVisibility = 'hidden' }) {
    const { t } = useTranslation("", { keyPrefix: "appbar" });
    const [category, setCategory] = React.useState("%");

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    }

    const navigate = useNavigate();
    let loginButton = <Button sx={{ visibility: 'hidden' }} />;
    let profileButton = <IconButton sx={{ visibility: 'hidden' }}></IconButton>;
    if (showLogin) {
        if (authUser === null) {
            loginButton = <Button component={Link} to={"/login"} variant="outlined" color="inherit">{t("sign_in")}</Button>;
            profileButton = <IconButton component={Link} to={"/profilePage"} size="large"><AccountCircleIcon fontSize="inherit" /></IconButton>
        }
        else{
            loginButton = <Button onClick={()=> {Logout();  window.location.reload();}} variant="outlined" color="inherit">Log out</Button>;
            profileButton = <IconButton onClick={() => navigate("/profilePage")} size="large"><AccountCircleIcon fontSize="inherit"/></IconButton>
        }
    }

    return (
        <Box sx={{ height: 'auto', width: '100%', display: 'block' }}>
            <AppBar position="static">
                <Toolbar>
                    <Box sx={{ height: '63px', width: '63px', borderRadius: 25, overflow: 'hidden', cursor: 'pointer' }}>
                        <img src={Logo} onClick={() => navigate("/")} alt={"Rentopia Logo"} />
                    <LanguageSelector />
                    </Box>
                    <FormControl sx={{ marginRight: 0, marginLeft: '7%', width: '150px', visibility: searchVisibility }} size="small">
                        <StyledSelect
                            value={category}
                            onChange={handleCategoryChange}
                        >
                            <MenuItem value={"%"}><em>{t("all_categories")}</em></MenuItem>
                            <MenuItem value={"tools"}>{t("tools")}</MenuItem>
                            <MenuItem value={"media"}>{t("media")}</MenuItem>
                            <MenuItem value={"home"}>{t("home")}</MenuItem>
                        </StyledSelect>
                    </FormControl>
                    <Search sx={{ marginLeft: 0, marginRight: 0, visibility: searchVisibility }}>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder={t('search')}
                        />
                    </Search>
                    <Search sx={{ marginLeft: 0, visibility: searchVisibility }} >
                        <SearchIconWrapper>
                            <LocationOnIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder={t('location')}
                        />
                    </Search>
                    <Box sx={{ flexGrow: 1 }}></Box>
                  {profileButton}
                  {loginButton}
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Appbar;
