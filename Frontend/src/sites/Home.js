import {
    alpha,
    AppBar,
    Box,
    Button,
    Card,
    CardActionArea, CardContent,
    CardMedia,
    InputBase,
    Link,
    styled,
    Toolbar, Typography, Grid2, Grid
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer.js";
import FetchBackend, {JWTTokenExists} from "../helper/BackendHelper.js";
import {useEffect, useState} from "react";
import Appbar from "../components/Appbar.js";

const DeviceGrid = styled(Grid2)(({theme}) => ({
    margin: '2% 10%'
}))

function HomeSite(){
    const navigate = useNavigate();

    const [authUser, setAuthUser] = useState(null);
    const [devices, setDevices] = useState([]);

    useEffect(() =>{
        if(JWTTokenExists()){
            FetchBackend('GET', 'user/me',null)
                .then(response => response.json())
                .then(data => {
                    setAuthUser(data);
                })
                .catch(error => console.log(error))
        }
    }, []);

    useEffect(() => {
        FetchBackend('GET', 'device/short/all',null)
            .then(response => response.json())
            .then(data => setDevices(data))
            .catch(error => console.log(error))
    }, []);

    return (
        <Box>
            <Appbar authUser={authUser}/>
            <Box sx={{ flexGrow: 1}} >
                <DeviceGrid container spacing={{xs: 4}} justifyContent={'center'} >
                  {devices.map((device, index) => (
                        <Grid key={index}>
                            <Card sx={{width: 300, boxShadow: 3}} >
                                <CardActionArea onClick={()=>navigate("/device/" + index)} >
                                    <CardMedia
                                        component="img"
                                      alt={device.title}
                                        height="125"
                                      image={"images/devices/" + device.image} />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {device.title}
                                        </Typography>
                                        <Typography variant="h6" sx={{ color: 'text.secondary' }} justifySelf={'end'}>
                                          {device.price + " €"}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </DeviceGrid>
            </Box>
            <Footer/>
        </Box>
    );
}

export default HomeSite;
