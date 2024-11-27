import {
    Box,
    Card, CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Appbar from './components/Appbar';
import {useEffect, useState} from "react";
import {styled} from "@mui/material/styles";

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

const DeviceGrid = styled(Grid)(({theme}) => ({
    marginTop: '25px',
}))

function App() {
    const[devices, setDevices] = useState([])

    /*useEffect(() => {
        fetch("http://localhost:8080/home/getAllDevices")
            .then(res => res.json())
            .then((result) => {
                setDevices(result);
            }
            )
    },[])*/

  return (
      <div>
          <Appbar/>
          <Box sx={{ flexGrow: 1}} >
              <DeviceGrid container spacing={{xs: 4}} justifyContent={'center'} >
                  {Array.from({ length: 15 }).map((_, index) => (
                      <Grid key={index}>
                        <Card sx={{minWidth: 250}} >
                            <CardActionArea /*component={RouterLink} to="/DevicesDetail" TODO: ADD Device Detail PAge here*/>
                                <CardMedia
                                    component="img"
                                    alt={"ToolNr " + index}
                                    height="125"
                                    image="" />
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {"ToolNr " + index}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                        {index * 3 + " €"}
                                    </Typography>
                                </CardActions>
                            </CardActionArea>
                        </Card>
                      </Grid>
                  ))}
              </DeviceGrid>
          </Box>
      </div>
  );
}

export default App;
