import {
    AppBar,
    Box,
    Button,
    styled,
    Typography, Grid, Grid2,
    Container,
    ImageList,
    Rating,
    Avatar,
    ImageListItem,
    Tooltip,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../components/Footer.js";
import FetchBackend, { JWTTokenExists } from "../helper/BackendHelper.js";
import { useEffect, useState } from "react";
import Appbar from "../components/Appbar.js";

const boxStyle = {
    mt: 4,
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '3',
};

function DeviceSite() {
    const navigate = useNavigate();
    const { deviceId } = useParams();
    const [authUser, setAuthUser] = useState(null);
    const [device, setDevice] = useState({
        "owner": "",
        "images": [],
        "price": 0,
        "description": "", "isPublic": true,
        "location": {
            "street": "",
            "city": "",
            "state": "",
            "country": "",
            "postalCode": ""
        },
        "id": 0,
        "categories": [],
        "title": "",
        "isBookmarked": false,
        "rating": 0,
        "amountRatings": 0,
    });
    const [deviceImageIndex, setDeviceImageIndex] = useState(0);

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
        FetchBackend('GET', 'device/' + deviceId, null)
            .then(response => response.json())
            .then(data => setDevice(data))
            .catch(error => console.log(error))

    }, []);

    // navigate back to Home if the device is hidden or invalid
    if (device === null) {
        navigate('/');
    }

    const handleThumbnailClick = (index) => {
        setDeviceImageIndex(index);
    };

    const btnBookmark = () => {
        if (authUser === null) {
            navigate(`/login`);
        } else {
            if (device.isBookmarked) {
                FetchBackend('POST', 'device/bookmarks/remove/' + device.id, null)
                    .catch(error => console.log(error));
            } else {
                FetchBackend('POST', 'device/bookmarks/add/' + device.id, null)
                    .catch(error => console.log(error));
            }
            setDevice({ ...device, isBookmarked: !device.isBookmarked });
        }
    }

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            <Appbar authUser={authUser} />
            {/* TODO registerPage framestyle */}
            <Box mb={"20px"}>
                <Container>
                    <Grid container spacing={6} >
                        <Grid item xs={12} >
                            <Grid container spacing={2} >
                                {/* Left Column: Device Images */}
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ ...boxStyle, height: "100%" }}>
                                        {/*TODO remove boxStyle. only slight?*/}
                                        <Box sx={{ textAlign: "center" }}>
                                            {/* Main Device Image */}
                                            <img src={"/images/devices/" + device.images[deviceImageIndex % 2 /* TODO */]} alt={device.title} width="100%" style={{ borderRadius: 8 }} />
                                        </Box>

                                        {/* Image Thumbnails */}
                                        <ImageList
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'flex-start',
                                                overflowX: 'auto',
                                                mt: 2,
                                                pb: 1,
                                            }}
                                            cols={device.images.length}
                                            rowHeight={80}
                                        >
                                            {[...device.images, ...device.images, ...device.images, ...device.images, ...device.images, ...device.images].map((image, index) => (  /* TODO */
                                                // {device.images.map((image, index) => (
                                                <ImageListItem
                                                    key={index}
                                                    sx={{
                                                        cursor: 'pointer',
                                                        minWidth: 80,
                                                        maxWidth: 100,
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    <img
                                                        src={"/images/devices/" + image}
                                                        alt={`${device.title} thumbnail ${index + 1}`}
                                                        style={{
                                                            borderRadius: 8,
                                                            border: index === deviceImageIndex ? '2px solid #1976d2' : '2px solid transparent',
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                        }}
                                                        onClick={() => handleThumbnailClick(index)}
                                                    />
                                                </ImageListItem>
                                            ))}
                                        </ImageList>
                                    </Box>
                                </Grid>

                                {/* Right Column: Device Details */}
                                <Grid item xs={12} sm={6} >
                                    <Box sx={{ ...boxStyle, height: "100%" }}>
                                        {/* Device Title */}
                                        <Typography variant="h4" gutterBottom>
                                            {device.title}
                                        </Typography>

                                        {/* Device Rating */}
                                        <Box display="flex" alignItems="center" mb={2}>
                                            <Tooltip title={device.rating} arrow>
                                                <div>
                                                    <Rating
                                                        value={device.rating}
                                                        precision={0.5}
                                                        readOnly
                                                        on
                                                    />
                                                </div>
                                            </Tooltip>

                                            <Typography variant="body2" sx={{ ml: 1 }}>
                                                ({device.amountRatings})
                                            </Typography>
                                        </Box>

                                        {/* Price */}
                                        <Typography variant="h5" color="primary" mb={2}>
                                            {device.price} €
                                        </Typography>

                                        <Box display="flex" mb={2}>
                                            <Button
                                                variant="contained" color="primary" fullWidth sx={{ mr: 2 }}
                                                onClick={btnBookmark}
                                            >
                                                {device.isBookmarked ? ("Bookmarked") : ("Add to Bookmarks")}
                                            </Button>
                                            <Button
                                                variant="contained" color="secondary" fullWidth
                                            >
                                                { /* TODO onClick={() => RENT} */}
                                                Rent Now
                                            </Button>
                                        </Box>

                                        {/* Seller Information */}
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            sx={{
                                                cursor: 'pointer',
                                            }}
                                            mb={2}
                                            mx={boxStyle}
                                        >
                                            <Avatar alt={"seller_name"} src={""} sx={{ mr: 1 }} />
                                            <Typography variant="body2" color="textSecondary">
                                                {device.owner}
                                            </Typography>
                                        </Box>

                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            {/* device Description */}
                            <Box sx={boxStyle} >
                                <Typography variant="h5" gutterBottom>
                                    {device.title}
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    {device.description}
                                </Typography>

                            </Box>
                        </Grid>
                    </Grid>

                </Container>
            </Box>
            <Box flex={"auto"} />
            <Footer />
        </Box>
    );
}

export default DeviceSite;

