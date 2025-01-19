import {
    Box,
    Button,
    Typography, Grid, Grid2,
    Container,
    ImageList,
    Rating,
    Avatar,
    ImageListItem,
    Tooltip,
    Fab,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../components/Footer.js";
import FetchBackend, { JWTTokenExists } from "../helper/BackendHelper.js";
import { useEffect, useState } from "react";
import * as React from "react";
import Appbar from "../components/Appbar.js";
import { useTranslation } from "react-i18next";
import CheckoutDialog from "../components/Checkout";
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

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
    const { t } = useTranslation("", { keyPrefix: "device" });
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
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const handleCheckoutOpen = () => {
        if (authUser) {
            setCheckoutOpen(true);
        } else {
            navigation("/login");
        }
    };
    const handleCheckoutClose = () => {
        setCheckoutOpen(false);
    };
    const [bookedDates, setBookedDates] = useState([]);
    const selectionRange = {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    }

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

    useEffect(() => {
        FetchBackend('GET', 'device/bookedDates/' + deviceId, null)
            .then(response => response.json())
            .then(data => {
                const dates = [];
                data.forEach(({ startDate, endDate }) => {
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    // Generate all dates in the range
                    while (start <= end) {
                        dates.push(new Date(start));
                        start.setDate(start.getDate() + 1); // Increment by 1 day
                    }
                });
                setBookedDates(dates);
            })
            .catch(error => console.log(error));
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


    const btnDel = () => {
        FetchBackend('POST', 'device/remove/' + device.id, null)
            .then(response => response.json())
            .then(data => { data ? setDeviceList(data) : console.log("error " + data);})
            .catch((error) => {
                console.log(error);
            });

            navigate(`/`);
    }

    const navigation = useNavigate();
    const handleConversationStart = (e) => {
        const chatData = {
            authUserId : authUser.id,
            deviceId : device.id
        };
        FetchBackend("POST", "chat", chatData)
            .then(response => response.json())
            .then(data => {
                if(data.success){
                    navigation("/chat");
                }
            })
            .catch((e) => console.log(e));
    };
    return (
        <React.Fragment>
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
                                                <img src={"/images/devices/" + device.images[deviceImageIndex]} alt={device.title} width="100%" style={{ borderRadius: 8 }} />
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
                                                {device.images.map((image, index) => (
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
                                          <Tooltip title={device.rating.toFixed(1)} arrow>
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
                                                {device.price} € / {t("day")}
                                            </Typography>

                                            <Grid2 container>
                                                <Grid2 size={12} sx={{marginBottom : "1%"}}>
                                                    <Button
                                                        variant="contained" color="secondary" fullWidth
                                                        onClick={handleCheckoutOpen}
                                                    >
                                                        {t("rent")}
                                                    </Button>
                                                </Grid2>
                                                <Grid2 container size={12} sx={{marginBottom : "1%"}}>
                                                    <Grid2 size={6} sx={{paddingRight: "1%"}}>
                                                        <Button
                                                            variant="contained" color="primary" sx={{marginRight : "1%"}}
                                                            onClick={btnBookmark} fullWidth>
                                                            {device.isBookmarked ? (t("bookmarked")) : t("add_bookmark")}
                                                        </Button>
                                                    </Grid2>
                                                    <Grid2 size={6} sx={{paddingLeft: "1%"}}>
                                                        <Button variant="contained" onClick={handleConversationStart} fullWidth>
                                                            {t("StartConversation")}
                                                        </Button>
                                                    </Grid2>
                                                </Grid2>
                                            </Grid2>

                                            {/* Seller Information */}
                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                mb={2}
                                                mx={boxStyle}
                                            >
                                                <Avatar alt={"seller_name"} src={""} sx={{ mr: 1 }} />
                                                <Typography variant="body2" color="textSecondary">
                                                    {device.owner}
                                                </Typography>
                                            </Box>

                                            {/*Calendar*/}
                                            <Box className="disable-month-pointer" sx={{ position: "relative", justifySelf: "center" }}>
                                                <style>
                                                    {`
                                                        .disable-month-pointer .rdrMonth {
                                                            pointer-events: none;
                                                        }
                                                        .disable-month-pointer .rdrDefinedRangesWrapper {
                                                            display: none;
                                                        }
                                                        .disable-month-pointer .rdrDateDisplayWrapper {
                                                            display: none;
                                                        }
                                                    `}
                                                </style>
                                                <DateRangePicker
                                                    ranges={[selectionRange]}
                                                    disabledDates={bookedDates}
                                                    minDate={new Date()}
                                                />
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
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                        {device.description}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
                <Box flex={"auto"} />
                {authUser && authUser.role === "ADMIN" && (
                  <Fab
                    onClick={() => btnDel()}
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                        backgroundColor: 'red',
                        boxShadow: 5,
                        '&:hover': {
                            backgroundColor: 'darkred',
                        },
                    }}
                    >
                    <DeleteIcon />
                  </Fab>
                )}
                <Footer />
                {authUser ? (
                        <CheckoutDialog
                            open={checkoutOpen}
                            handleCheckoutClose={handleCheckoutClose}
                            device={device}
                            authUser={authUser}
                            bookedRanges={bookedDates}
                        />
                    ) : ('')}
            </Box>
            </React.Fragment>
        );
}

export default DeviceSite;

