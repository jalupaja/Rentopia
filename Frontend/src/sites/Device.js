import {
    AppBar,
    Box,
    Button,
    Card,
    styled,
    Typography, Grid2, Grid,
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

const DeviceGrid = styled(Grid2)(({theme}) => ({
    margin: '2% 10%'
}))

function DeviceSite() {
    const navigate = useNavigate();
    const { deviceId } = useParams();
    const [authUser, setAuthUser] = useState(null);
    const [device, setDevice] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null); // TODO probably rename or just bs

    // Redirect to Home if no valid deviceId was used
    useEffect(() => {
	if(JWTTokenExists()){
	    FetchBackend('GET', 'user/me',null)
		.then(response => response.json())
		.then(data => {
		    setAuthUser(data);
		})
		.catch(error => console.log(error))
	}

	FetchBackend('GET', 'user/me', {id: deviceId}) // TODO send current User to access "hidden"? Backend needs to validate!
	    .then(response => response.json())
	    .then(data => {
		setDevice(data)
	    })
	    .catch(error => console.log(error))

	setDevice({"title": "abc"})
	console.log("device: " + device);

	if (false && device === null) { // TODO
	    navigate('/');
	}

    }, [deviceId, navigate, device]);

    console.log("device: " + device);

    return (
    <Container>
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {/* Left Column: Device Images */}
        <Grid item xs={12} md={6}>
          <Box sx={{ textAlign: "center" }}>
            {/* Main Device Image */}
            <img src={selectedImage} alt={"title"} width="100%" style={{ borderRadius: 8 }} />
          </Box>

          {/* Image Thumbnails */}
          <ImageList sx={{ display: 'flex', justifyContent: 'center', mt: 2 }} cols={5}>

          </ImageList>
        </Grid>

        {/* Right Column: Device Details */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 3, height: "100%" }}>
            {/* Device Title */}
            <Typography variant="h4" gutterBottom>
              {"title"}
            </Typography>

            {/* Device Rating */}
            <Box display="flex" alignItems="center" mb={2}>
              <Rating value={"rating"} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>
                ({"reviews"} reviews)
              </Typography>
            </Box>

            {/* Price */}
	{ /* TODO price + localize */ }
            <Typography variant="h5" color="primary" mb={2}>
              {999.99}€
            </Typography>

            {/* Add to Cart & Buy Now Buttons */}
            <Box display="flex" mb={2}>
              <Button variant="contained" color="primary" fullWidth sx={{ mr: 2 }}>
                Add to Cart
              </Button>
              <Button variant="contained" color="secondary" fullWidth>
                Buy Now
              </Button>
            </Box>

            {/* Seller Information */}
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar alt={"seller_name"} src={""} sx={{ mr: 1 }} />
              <Typography variant="body2" color="textSecondary">
                Seller: {"seller_name"}
              </Typography>
            </Box>

          </Paper>
        </Grid>
      </Grid>

      {/* device Description */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          device Description
        </Typography>
        <Typography variant="body1" paragraph>
          {"description"}
        </Typography>
      </Box>
    </Container>
  );
}

export default DeviceSite;
