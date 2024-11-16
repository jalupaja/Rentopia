import { styled, alpha } from '@mui/material/styles';
import {AppBar, Box, Button, InputBase, Toolbar} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

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

const logo = {
    imageUrl: '/pictures/RentopiaLogo64.jpg',
};

function App() {
  return (
      <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
              <Toolbar>
                  <img src={logo.imageUrl} alt={"Rentopia Logo"}/>
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
                  <Button variant="outlined" color="inherit">Sign in</Button>
              </Toolbar>
          </AppBar>
      </Box>
  );
}

export default App;
