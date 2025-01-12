import {
    alpha, Box,
    Button, Card, CardActions,
    CardMedia,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControl, FormLabel, IconButton, MenuItem, Select, styled, Switch,
    TextField
} from "@mui/material";
import * as React from 'react';
import Grid from "@mui/material/Grid2";
import DeleteIcon from "@mui/icons-material/Delete";
import EuroIcon from '@mui/icons-material/Euro';
import {useState} from "react";
import FetchBackend, {FetchBackendMultiPart} from "../helper/BackendHelper";

const StyledSelect = styled(Select)(({ theme }) => ({
    '& .MuiOutlinedInput-notchedOutline': {
        border: `1px solid ${alpha(theme.palette.common.white, 0.5)}`,
        backgroundColor: 'transparent',
        '&:hover': {
            borderColor: alpha(theme.palette.common.white, 0.75),
        },
    },
    color: 'inherit',
}))

function AddDeviceDialog({open, handleAddDialogClose, iDevice, setDeviceList, authUser}) {

    const [oldImages, setOldImages] = useState(iDevice.images ? iDevice.images : []);
    const [deleteImages, setDeleteImages] = useState([]);
    const [images, setImages] = useState([]);
    const initialValues = {
        id: iDevice.id ? iDevice.id : null,
        title: iDevice.title,
        description: iDevice.description,
        price: iDevice.price ? iDevice.price : 0.0,
        category: iDevice.category ? iDevice.category : '%',
        isPublic: iDevice.isPublic,
        ownerId: authUser.id,
        location: authUser.location,
    };
    const [newDeviceData, setNewDeviceData] = React.useState(initialValues);

    const clearFields = () => {
        setNewDeviceData({...initialValues});
    }

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        const newImages = selectedFiles.map(file => ({
            id: URL.createObjectURL(file),
            src: URL.createObjectURL(file),
            name: file.name,
        }));

        setImages([...images, ...newImages]);
    };

    const handleImageUpload = (deviceID) => {
        const formData = new FormData();

        images.forEach(image => {
            // Convert the image object back to a File object if necessary
            const file = new File([image.src], image.name); // Adjust if `image.src` isn't the Blob
            formData.append('files', file); // Use 'files' to match @RequestParam("files")
        });

        try {
            FetchBackendMultiPart('POST', `device/${deviceID}/image`, formData)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => console.log("Images uploaded successfully:", data))
                .catch(error => console.error("Error uploading images:", error));
        } catch (error) {
            console.error("Unexpected error during upload:", error);
        }
    };

    const handleDeleteImage = (id) => {
        setImages(images.filter(image => image.id !== id));
    };

    const handleDeleteOldImage = (name) => {
        setOldImages(oldImages.filter(image => image !== name));
        setDeleteImages([...deleteImages, name]);
    }

    const closeDialog = () => {
        clearFields();
        console.log(iDevice);
        handleAddDialogClose();
    }

    const handleSave = (event) => {
        event.preventDefault();

        setNewDeviceData(prevState => ({
            ...prevState,
            price: Math.round(prevState.price* 100) / 100
        }));

        if(iDevice.id != null) {
            FetchBackend('POST', 'device/update', newDeviceData)
                .then(response => response.json())
                .then(data => {data ? setDeviceList(data) : console.log(data) })
                .catch(error => console.log(error));

            FetchBackend('DELETE', 'device/delete/image', deleteImages)
                .then(response => response.json())
                .catch(error => console.log(error));

            handleImageUpload(iDevice.id);


        } else {
            FetchBackend('POST', 'device/add', newDeviceData)
                .then(response => response.json())
                .then(data => {setDeviceList(data); handleImageUpload(data[data.length - 1].id);})
                .catch(error => console.log(error));
        }

        closeDialog();
    }

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleAddDialogClose}
                PaperProps={{
                    component: 'form'
                }}
            >
                <DialogTitle>Add new Tool</DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            margin: '0 auto',
                            padding: 3,
                        }}>
                        <Grid container spacing={2}>
                            <TextField
                                variant="outlined"
                                label={"Name"}
                                value={newDeviceData.title}
                                onChange={(e) => {
                                    setNewDeviceData(prevState => ({
                                        ...prevState,
                                        title: e.target.value
                                    }));
                                }}
                                required
                            />
                            <TextField
                                variant="outlined"
                                label={"Price"}
                                value={newDeviceData.price}
                                onChange={(e) => {
                                    setNewDeviceData(prevState => ({
                                        ...prevState,
                                        price: e.target.value
                                    }));
                                }}
                                required
                                slotProps={{ input: { inputMode: 'numeric', pattern: '[0-9]*', endAdornment: <EuroIcon/> }}}
                            />
                            {/*<FormControl size="small" fullWidth>
                                <FormLabel component="legend">Category</FormLabel>
                                <StyledSelect
                                    value={newDeviceData.category}
                                    onChange={(e) => {
                                        setNewDeviceData(prevState => ({
                                            ...prevState,
                                            category: e.target.value
                                        }));
                                    }}
                                >
                                    <MenuItem value={"%"}><em>Category</em></MenuItem>
                                    <MenuItem value={"tools"}>Tools</MenuItem>
                                    <MenuItem value={"media"}>Media</MenuItem>
                                    <MenuItem value={"home"}>Home</MenuItem>
                                </StyledSelect>
                            </FormControl>*/}
                            <FormControl fullWidth>
                                <FormLabel component="legend">Is Public</FormLabel>
                                <Switch checked={newDeviceData.isPublic} onChange={(e) => {
                                    setNewDeviceData(prevState => ({
                                        ...prevState,
                                        isPublic: e.target.checked
                                    }));
                                }} />
                            </FormControl>
                            <TextField
                                fullWidth
                                variant="outlined"
                                multiline rows={5}
                                label={"Description"}
                                value={newDeviceData.description}
                                onChange={(e) => {
                                    setNewDeviceData(prevState => ({
                                        ...prevState,
                                        description: e.target.value
                                    }));
                                }}/>
                        </Grid>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 2,
                            height: '200px',
                            overflowY: 'auto',
                            margin: '0 24px 0 24px',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                        }}
                    >
                        {(images.length === 0 && oldImages.length === 0) ? (
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                height: '100%'
                            }}>
                                <span>No images uploaded</span>
                            </Box>
                        ) : (
                            <Box>
                                {images.map((image, index) => (
                                    <Card key={image.id} sx={{maxWidth: 100}}>
                                        <CardMedia
                                            component="img"
                                            alt={image.name}
                                            height="140"
                                            image={image.src}
                                            title={image.name}
                                        />
                                        <CardActions>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDeleteImage(image.id)}
                                            >
                                                <DeleteIcon/>
                                            </IconButton>
                                        </CardActions>
                                    </Card>
                                ))}
                                {oldImages.map((image, index) => (
                                    <Card key={image.id} sx={{maxWidth: 100}}>
                                        <CardMedia
                                            component="img"
                                            alt={image.name}
                                            height="140"
                                            image={"/images/devices/" + image}
                                            title={image.name}
                                        />
                                        <CardActions>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDeleteOldImage(image)}
                                            >
                                                <DeleteIcon/>
                                            </IconButton>
                                        </CardActions>
                                    </Card>
                                ))}
                            </Box>
                        )}
                    </Box>
                    <Button variant="contained" component="label" sx={{marginLeft: '24px'}}>
                        Upload Images
                        <input
                            type="file"
                            hidden
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color={"error"}>Cancel</Button>
                    <Button onClick={handleSave} type="submit">Save</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default AddDeviceDialog;