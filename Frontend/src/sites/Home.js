import {
    Box,
    Card,
    CardActionArea, CardContent,
    CardMedia,
    styled, Typography, Grid2, Pagination
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer.js";
import FetchBackend, { JWTTokenExists } from "../helper/BackendHelper.js";
import { useEffect, useState } from "react";
import * as React from 'react';
import Appbar from "../components/Appbar.js";
import { FrameStyle } from "./Register";

const DeviceGrid = styled(Grid2)(({ theme }) => ({
    margin: '2% 10%'
}))

function HomeSite() {
    const navigate = useNavigate();
    const [authUser, setAuthUser] = useState(null);
    const [devices, setDevices] = useState([]);
    const [paginatedDevices, setPaginatedDevices] = useState([]);
    const [page, setPage] = useState(1);
    const devicesPPage = 8;

    useEffect(() => {
        if (JWTTokenExists()) {
            FetchBackend('GET', 'user/me', null)
                .then(response => response.json())
                .then(data => {
                    setAuthUser(data);
                })
                .catch(error => console.log(error))
        }
    }, []);

    useEffect(() => {
        FetchBackend('GET', 'device/short/all', null)
            .then(response => response.json())
            .then(data => setDevices(data))
            .catch(error => console.log(error))
    }, []);

    useEffect(() => {
        let _paginatedDevices = devices.slice((page - 1) * devicesPPage, page * devicesPPage);
        setPaginatedDevices(_paginatedDevices);
    }, [devices, page]);

    return (
        <Box sx={{ ...FrameStyle }}>
            <Appbar authUser={authUser} searchVisibility={'visible'} />
            <Box sx={{ flexGrow: 1 }} >
                <DeviceGrid container spacing={{ xs: 4 }} justifyContent={'center'} >
                    {paginatedDevices.map((device, index) => (
                        <Grid2 key={index}>
                            <Card sx={{ width: 300, boxShadow: 3 }} >
                                <CardActionArea onClick={() => navigate("/device/" + device.id)} >
                                    <CardMedia
                                        component="img"
                                        alt={device.title}
                                        height="125"
                                        image={"/images/devices/" + device.image} />
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
                        </Grid2>
                    ))}
                </DeviceGrid>
            </Box>
            <Box flex={"auto"} />
            <Pagination count={Math.ceil(devices.length / devicesPPage)} page={page} onChange={(_, value) => setPage(value)} />
            <Footer />
        </Box>
    );
}

export default HomeSite;
