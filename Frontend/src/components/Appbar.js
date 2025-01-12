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
import { alpha, styled } from "@mui/material";
import * as React from 'react';
import Logo from "../image/RentopiaLogo64.jpg";
import { useNavigate, Link } from "react-router-dom";
import TuneIcon from '@mui/icons-material/Tune';
import MenuComponent from "./MenuComponent.js";
import LanguageSelector from "./LanguageSelector.js";
import { useTranslation } from "react-i18next";
import FetchBackend, { Logout } from "../helper/BackendHelper.js"

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    backgroundColor: 'transparent',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        transition: theme.transitions.create('width'),
        width: '100%',
    },
    width: '100%',
}));

const SearchWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
    maxWidth: '400px',
    marginLeft: '7%',
}));

function Appbar({ showLogin = true, authUser = null, searchVisibility = 'hidden', setDevices, iPriceRange = [0,999]}) {
    const { t } = useTranslation("", { keyPrefix: "appbar" });
    const [openFilter, setOpenFilter] = React.useState(false);
    const initialFilterOptions = {
        title: "",
        priceRange: iPriceRange,
        postalCode: "",
        sortOption: "" //dateAsc, priceDesc, priceAsc
    };
    const [prevFilterOptions, setPrevFilterOptions] = React.useState(initialFilterOptions);
    const [filterOptions, setFilterOptions] = React.useState(initialFilterOptions);
    const navigate = useNavigate();
  
    let loginButton = <Button sx={{ visibility: 'hidden' }} />;
    let profileButton = <IconButton sx={{visibility: 'hidden'}}></IconButton>;
    if (showLogin) {
        if (authUser === null) {
            loginButton = <Button component={Link} to={"/login"} variant="outlined" color="inherit">{t("sign_in")}</Button>;
            profileButton = <div/>
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
        const queryString = new URLSearchParams(filterOptions).toString();

        FetchBackend('GET', `device/short/search?${queryString}`)
            .then(response => response.json())
            .then(data => setDevices(data))
            .catch(error => console.log(error));
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
                    <SearchWrapper sx={{ visibility: searchVisibility }}>
                        <IconButton sx={{ padding: '0 8px' }} size="large" color="inherit" onClick={handleFilterOpen}>
                            <TuneIcon />
                        </IconButton>
                        <StyledInputBase
                            value={filterOptions.title}
                            onChange={(e) => {
                                setFilterOptions((prevState) => ({
                                    ...prevState,
                                    title: e.target.value,
                                }));
                            }}
                            placeholder="Search"
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') handleSearch();
                            }}
                        />
                        <IconButton sx={{ padding: '0 8px' }} size="large" color="inherit" onClick={handleSearch}>
                            <SearchIcon />
                        </IconButton>
                    </SearchWrapper>
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
                            min={iPriceRange[0]}
                            max={iPriceRange[1]}
                            step={1}
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
                        Reset Filters
                    </Button>
                </DialogActions>
            </Dialog>
        </Box >
    )
}

export default Appbar;
