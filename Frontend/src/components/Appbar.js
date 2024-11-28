import {AppBar, Box, FormControl, InputBase, Select, Toolbar} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {alpha, styled} from "@mui/material/styles";
import * as React from 'react';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import LocationOnIcon from '@mui/icons-material/LocationOn';

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

function Appbar() {
    const [category, setCategory] = React.useState("%");

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    }

return (
    <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
                <img src={logo.imageUrl} alt={"Rentopia Logo"}/>
                <FormControl sx={{marginRight: 0, marginLeft: '7%', width: '150px' }} size="small">
                    <StyledSelect
                        value={category}
                        onChange={handleCategoryChange}
                    >
                        <MenuItem value={"%"}><em>All Categories</em></MenuItem>
                        <MenuItem value={"tools"}>Tools</MenuItem>
                        <MenuItem value={"media"}>Media</MenuItem>
                        <MenuItem value={"home"}>Home</MenuItem>
                    </StyledSelect>
                </FormControl>
                <Search sx={{ marginLeft: 0, marginRight: 0 }}>
                    <SearchIconWrapper>
                        <SearchIcon/>
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="Search…"
                    />
                </Search>
                <Search sx={{ marginLeft: 0 }} >
                    <SearchIconWrapper>
                        <LocationOnIcon/>
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="City or Postal Code"
                    />
                </Search>
                <Box sx={{flexGrow: 1}}></Box>
                <Button variant="outlined" color="inherit">Sign in</Button>
            </Toolbar>
        </AppBar>
    </Box>
)
}

export default Appbar;