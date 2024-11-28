import {
    Box,
    Card, CardActionArea,
    CardContent,
    CardMedia,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Appbar from './components/Appbar';
import {useEffect, useState} from "react";
import {styled} from "@mui/material/styles";

const DeviceGrid = styled(Grid)(({theme}) => ({
    margin: '2% 10%'
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
                        <Card sx={{width: 300, boxShadow: 3}} >
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
                                    <Typography variant="h6" sx={{ color: 'text.secondary' }} justifySelf={'end'}>
                                        {index * 3 + " €"}
                                    </Typography>
                                </CardContent>
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
