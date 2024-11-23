import {alpha, AppBar, Box, Button, InputBase, styled, Toolbar} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {useNavigate} from "react-router-dom";
import Logo from "../image/RentopiaLogo64.jpg";

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
    width: '100%'
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
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

function NavBar({showLogin = true}){
    const navigate = useNavigate();

    let loginButton = <Button/>;
    if(showLogin){
        loginButton = <Button onClick={()=>navigate("/login")} variant="outlined" color="inherit">Sign in</Button>;
    }

    return (
        <Box sx={{ height: 'auto', width:'100%', display:'block' }}>
            <AppBar position="static">
                <Toolbar>
                    <img src={Logo} onClick={()=>navigate("/")} alt={"Rentopia Logo"}/>
                    <Search sx={{ flexGrow: 0.5 }} >
                        <SearchIconWrapper>
                            <SearchIcon/>
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{'aria-label': 'search'}}
                        />
                    </Search>
                    <Box sx={{flexGrow: 1}}></Box>
                    {loginButton}
                    </Toolbar>
            </AppBar>
        </Box>
    )
}

export default NavBar;