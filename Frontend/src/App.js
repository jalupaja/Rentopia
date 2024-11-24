import { styled, alpha } from '@mui/material/styles';
import {
    AppBar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    InputBase,
    Toolbar,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Grid2";
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

/*const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));*/

function App() {
  return (
      <div>
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
          <Box sx={{ flexGrow: 1}} >
              <Grid container spacing={{xs: 4}} margin-top={"25px"} justifyContent={'center'} >
                  {Array.from({ length: 15 }).map((_, index) => (
                      <Grid key={index}>
                        <Card sx={{maxWidth: 250 }}>
                            <CardMedia
                                component="img"
                                alt={"ToolNr " + index}
                                height="125"
                                image="" />
                            <CardContent>
                                <Typography gutterBottom variant="h6" component="div">
                                    {"ToolNr " + index}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {"This Tool is crazy and nice. Pls Rent it. !Lets go Tool " + index}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size={"small"}>Show More</Button>
                                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                    {index * 3 + " €"}
                                </Typography>
                            </CardActions>
                        </Card>
                      </Grid>
                  ))}
              </Grid>
          </Box>
      </div>
  );
}

export default App;
