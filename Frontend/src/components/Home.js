import {
    Box,
    Card,
    CardActionArea, CardContent,
    CardMedia,
    styled, Typography, Grid2
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer.js";
import FetchBackend, {JWTTokenExists} from "../helper/BackendHelper.js";
import {useEffect, useState} from "react";
import Appbar from "./Appbar.js";

const DeviceGrid = styled(Grid2)(({theme}) => ({
    margin: '2% 10%'
}))

function Home(){
    const navigate = useNavigate();

    const [authUser, setAuthUser] = useState(null);

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

    return (
        <Box>
            <Appbar authUser={authUser} searchVisibility={'visible'}/>
            <Box sx={{ flexGrow: 1}} >
                <DeviceGrid container spacing={{xs: 4}} justifyContent={'center'} >
                    {Array.from({ length: 15 }).map((_, index) => (
                        <Grid2 key={index}>
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
                        </Grid2>
                    ))}
                </DeviceGrid>
            </Box>
            <Footer/>
        </Box>
    );
}

export default Home;