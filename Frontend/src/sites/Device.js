import {
    AppBar,
    Box,
    Button,
    Card,
    styled,
    Typography, Grid, Grid2,
    Container,
    ImageList,
    Paper,
    Rating,
    Avatar,
    ImageListItem
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../components/Footer.js";
import FetchBackend, {JWTTokenExists} from "../helper/BackendHelper.js";
import {useEffect, useState} from "react";
import Appbar from "../components/Appbar.js";
// TODO maybe import ReactImageMagnify from 'react-image-magnify';
// TODO: npm i @types/react-image-magnify

const boxStyle = {
    mt: 4,
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const DeviceGrid = styled(Grid2)(({theme}) => ({
    margin: '2% 10%'
}))

function DeviceSite() {
    const navigate = useNavigate();
    const { deviceId } = useParams();
    const [authUser, setAuthUser] = useState(null);
    const [device, setDevice] = useState({
	"owner": "",
	"images": [],
	"price": 0,
	"description": "",
	"isPublic": true,
	"location": {
	    "street": "",
	    "city": "",
	    "state": "",
	    "country": "",
	    "postalCode": ""
	},
	"id": 0,
	"categories": [],
	"title": ""
    });
    const [deviceImageIndex, setDeviceImageIndex] = useState(0);

    useEffect(() => {
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

    return (
	<Box>
	    <Appbar authUser={authUser}/>
	    <Container>
	      <Grid container spacing={3} sx={{ mt: 4 }}>
		{/* Left Column: Device Images */}
		<Grid item xs={12} md={6}>
		  <Box sx={{...boxStyle, textAlign: "center" }}>
		    {/* Main Device Image */}
		    <img src={"/images/devices/" + device.images[deviceImageIndex % 2 /* TODO */] } alt={device.title} width="100%" style={{ borderRadius: 8 }} />
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
		</Grid>

		{/* Right Column: Device Details */}
		<Grid item xs={12} md={6}>
		  <Paper sx={{ padding: 3, height: "100%" }}>
		    {/* Device Title */}
		    <Typography variant="h4" gutterBottom>
		      {device.title}
		    </Typography>

		    {/* Device Rating */}
		    <Box display="flex" alignItems="center" mb={2}>
		      <Rating value={"rating"} readOnly />
		      <Typography variant="body2" sx={{ ml: 1 }}>
			(4.5) { /* TODO or remove? */ }
		      </Typography>
		    </Box>

		    {/* Price */}
		{ /* TODO localize */ }
		    <Typography variant="h5" color="primary" mb={2}>
		      {device.price} €
		    </Typography>

		    {/* Add to Cart & Buy Now Buttons */}
		    <Box display="flex" mb={2}>
		    { /* TODO */ }
		      <Button
			    variant="contained" color="primary" fullWidth sx={{ mr: 2 }}
			    onClick={()=>navigate(`/user/${device.owner}`)}
			    >
			Add to Cart
		      </Button>
		      <Button
			    variant="contained" color="secondary" fullWidth
			    onClick={()=>navigate(`/user/${device.owner}`)}
			    >
			Buy Now
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
			onClick={()=>navigate(`/user/${device.owner}`)}
			>
		      <Avatar alt={"seller_name"} src={""} sx={{ mr: 1 }} />
		      <Typography variant="body2" color="textSecondary">
			{device.owner}
		      </Typography>
		    </Box>

		  </Paper>
		</Grid>
	      </Grid>

	      {/* device Description */}
	      <Box sx={boxStyle}>
		<Typography variant="h5" gutterBottom>
		    {device.title}
		</Typography>
		<Typography variant="body1" paragraph>
		  {device.description}
		</Typography>
	      </Box>
	    </Container>
	{ /* TODO use DeviceContainer?. Footer is cutting in description!!! */}
            <Footer/>
        </Box>
  );
}

export default DeviceSite;
