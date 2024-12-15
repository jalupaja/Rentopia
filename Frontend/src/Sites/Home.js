import {
    Box,
    Card,
    CardActionArea, CardContent,
    CardMedia,
    styled, Typography, Grid2, Pagination
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer.js";
import FetchBackend, {JWTTokenExists} from "../helper/BackendHelper.js";
import {useEffect, useState} from "react";
import * as React from 'react';
import Appbar from "../components/Appbar.js";
import usePagination from "../components/Pagination";
import {FrameStyle} from "./RegisterPage";

const DeviceGrid = styled(Grid2)(({theme}) => ({
    margin: '2% 10%'
}))

function Home(){
    const navigate = useNavigate();
    const [authUser, setAuthUser] = useState(null);
    const [page, setPage] = useState(1);
    const [devices, setDevices] = useState([1,2,3,4,5,6,7,8,9,10,11,12,13,14]);
    const devicesPPage = 10;

    const count = Math.ceil(devices.length / devicesPPage);
    const _DEVICES = usePagination(devices, devicesPPage);

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

    const handlePageChange = (event, value) => {
        setPage(value);
        _DEVICES.jump(value);
    };

    return (
        <Box sx={{...FrameStyle}}>
            <Appbar authUser={authUser} searchVisibility={'visible'}/>
            <Box sx={{ flexGrow: 1}} >
                <DeviceGrid container spacing={{xs: 4}} justifyContent={'center'} >
                    {_DEVICES.currentData().map((item, index) => (
                        <Grid2 key={index}>
                            <Card sx={{width: 300, boxShadow: 3}} >
                                <CardActionArea /*component={RouterLink} to="/DevicesDetail" TODO: ADD Device Detail PAge here*/>
                                    <CardMedia
                                        component="img"
                                        alt={"ToolNr " + item}
                                        height="125"
                                        image="" />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {"ToolNr " + item}
                                        </Typography>
                                        <Typography variant="h6" sx={{ color: 'text.secondary' }} justifySelf={'end'}>
                                            {item * 3 + " €"}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid2>
                    ))}
                </DeviceGrid>
            </Box>
            <Box flex={"auto"}/>
            <Pagination count={count} page={page} onChange={handlePageChange} />
            <Footer/>
        </Box>
    );
}

export default Home;