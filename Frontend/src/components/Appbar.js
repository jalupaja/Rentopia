import {
    AppBar,
    Box,
    FormControl,
    InputBase,
    Select,
    Toolbar,
    Button,
    MenuItem,
    IconButton,
    Dialog, TextField, DialogTitle, DialogContent, InputLabel, Slider, DialogActions, Popover
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { alpha, styled } from "@mui/material";
import * as React from 'react';
import Logo from "../image/RentopiaLogo64.jpg";
import { useNavigate, Link } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TuneIcon from '@mui/icons-material/Tune';
import MenuComponent from "./MenuComponent.js";
import LanguageSelector from "./LanguageSelector.js";
import { useTranslation } from "react-i18next";
import FetchBackend, { Logout } from "../helper/BackendHelper.js"
import {useEffect} from "react";

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

function Appbar({ showLogin = true, authUser = null, searchVisibility = 'hidden', setDevices}) {
    const { t } = useTranslation("", { keyPrefix: "appbar" });
    const [openFilter, setOpenFilter] = React.useState(false);
    const initialFilterOptions = {
        priceRange: [0, 9999],
        postalCode: "",
        sortOption: "" //dateAsc, priceDesc, priceAsc
    };
    const [prevFilterOptions, setPrevFilterOptions] = React.useState(initialFilterOptions);
    const [filterOptions, setFilterOptions] = React.useState(initialFilterOptions);

    let loginButton = <Button sx={{ visibility: 'hidden' }} />;
    if (showLogin) {
        if (authUser === null) {
            loginButton = <Button component={Link} to={"/login"} variant="outlined" color="inherit">{t("sign_in")}</Button>;
        }
        else{
            loginButton = <MenuComponent authUser={authUser}/>;
        }
    }

    const handleFilterOpen = () => {
        setOpenFilter(true);
    };

    const handleFilterClose = () => {
        setOpenFilter(false);
        setPrevFilterOptions(filterOptions);
    }

    const handleFilterCancel = () => {
        setOpenFilter(false);
        setFilterOptions(prevFilterOptions);
    }

    const handleFilterReset = () => {
        setFilterOptions({...initialFilterOptions});
        setOpenFilter(false);
    }

    const handleSearch = () =>{
        console.log(filterOptions);

        FetchBackend('GET', 'device/short/search', filterOptions)
            .then(response => response.json())
            .then(data => setDevices(data))
            .catch(error => console.log(error));

        /*useEffect(() => {
            let _paginatedDevices = devices.slice((page - 1) * devicesPPage, page * devicesPPage);
            setPaginatedDevices(_paginatedDevices);
        }, [devices, page]);*/
    }

    return (
        <Box sx={{ height: 'auto', width: '100%', display: 'block' }}>
            <AppBar position="static">
                <Toolbar>
                    <LanguageSelector />
                    <Box
                        sx={{
                            width: 63,
                            height: 63,
                            margin: 1,
                            borderRadius: '50%',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexShrink: 0,
                        }}
                    >
                        <Link to={"/"}>
                            <img
                                src={Logo}
                                alt={t("logo")}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '50%',
                                }}
                            />
                        </Link>
                    </Box>
                    <Search sx={{ marginLeft: '7%', marginRight: 0, visibility: searchVisibility }}>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder={t('search')}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter')
                                    handleSearch();
                            }}
                        />
                    </Search>
                    <IconButton size="large" color={"inherit"} onClick={handleFilterOpen}>
                        <TuneIcon/>
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }}></Box>
                  {loginButton}
                </Toolbar>
            </AppBar>

            {/*Filter Popup*/}
            <Dialog open={openFilter} onClose={handleFilterClose}>
                <DialogTitle>Filters</DialogTitle>
                <DialogContent>
                    {/* Postal Code */}
                    <TextField
                        label="Postal Code"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={filterOptions.postalCode}
                        onChange={(e) => {
                            setFilterOptions(prevState => ({
                                ...prevState,
                                postalCode: e.target.value
                            }));
                        }}
                    />
                    <Box>
                        <InputLabel>Price Range</InputLabel>
                        <Slider
                            sx={{width:'97%'}}
                            value={filterOptions.priceRange}
                            onChange={(e, newValue) => {
                                setFilterOptions(prevState => ({
                                    ...prevState,
                                    priceRange: newValue
                                }));
                            }}
                            valueLabelDisplay="auto"
                            getAriaValueText={() => `${filterOptions.priceRange}€`}
                            min={0}
                            max={10000}
                            step={10}
                        />
                    </Box>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Sort By</InputLabel>
                        <Select
                            value={filterOptions.sortOption}
                            onChange={(e) => {
                                setFilterOptions(prevState => ({
                                    ...prevState,
                                    sortOption: e.target.value
                                }));
                            }}
                            label="Sort By"
                         variant={"outlined"}>
                            <MenuItem value="priceAsc">Price (Low to High)</MenuItem>
                            <MenuItem value="priceDesc">Price (High to Low)</MenuItem>
                            <MenuItem value="dateAsc">Date (Oldest First)</MenuItem>
                            <MenuItem value="dateDesc">Date (Newest First)</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFilterCancel} color="primary">
                        Cancel
                    </Button>
                    <Button color="primary" onClick={handleFilterClose}>
                        Apply Filters
                    </Button>
                    <Button  onClick={handleFilterReset} color="error">
                        ResetFilters
                    </Button>
                </DialogActions>
            </Dialog>
        </Box >
    )
}

export default Appbar;
