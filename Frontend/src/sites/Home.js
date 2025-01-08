import {
    Box,
    Card,
    CardActionArea, CardContent,
    CardMedia,
    styled, Typography, Grid2, Pagination
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../components/Footer.js";
import FetchBackend, {GetAuthUser, JWTTokenExists} from "../helper/BackendHelper.js";
import { useEffect, useState } from "react";
import * as React from 'react';
import Appbar from "../components/Appbar.js";
import { FrameStyle } from "./Register";
import { useTranslation } from "react-i18next";

const DeviceGrid = styled(Grid2)(({ theme }) => ({
    margin: '2% 10%'
}))

function HomeSite() {
    const navigate = useNavigate();
    const [devices, setDevices] = useState([]);
    const [paginatedDevices, setPaginatedDevices] = useState([]);
    const [page, setPage] = useState(1);
    const devicesPPage = 8;
    const { t } = useTranslation("", { keyPrefix: 'home' });

    let authUser = GetAuthUser();

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
            <Appbar authUser={authUser} searchVisibility={'visible'} setDevices={setDevices} />
            <Box sx={{ flexGrow: 1 }} >
                <DeviceGrid container spacing={{ xs: 4 }} justifyContent={'center'} >
                    {paginatedDevices.map((device, index) => (
                        <Grid2 key={index}>
                            <Card sx={{ width: 300, boxShadow: 3 }} >
                                <CardActionArea component={Link} to={"/device/" + device.id} >
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
