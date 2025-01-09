import {
    alpha, Box,
    Button, Card, CardActions,
    CardMedia,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControl, IconButton, MenuItem, Select, styled,
    TextField
} from "@mui/material";
import * as React from 'react';
import Grid from "@mui/material/Grid2";
import DeleteIcon from "@mui/icons-material/Delete";
import EuroIcon from '@mui/icons-material/Euro';
import {useState} from "react";
import FetchBackend from "../helper/BackendHelper";

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

function AddDeviceDialog({open, handleAddDialogClose, iDevice, getAllDeviceData}) {

    const [images, setImages] = useState([]);
    const initialValues = {
        title: iDevice.title,
        description: iDevice.description,
        price: iDevice.price,
        category: iDevice.category,
        ownerId: iDevice.ownerId,
        location: iDevice.location
    };
    const [newDeviceData, setNewDeviceData] = React.useState(initialValues);

    const onChange = (e) => {
        const {name, value } = e.target;
        setNewDeviceData(prevState => ({...prevState, [name]: value}));
    }

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

    const handleDeleteImage = (id) => {
        setImages(images.filter(image => image.id !== id));
    };

    const closeDialog = (event) => {
        clearFields();
        handleAddDialogClose();
    }

    const handleSave = (event) => {
        event.preventDefault();

        if(iDevice.id === null) {
            FetchBackend('POST', 'device/add', newDeviceData)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                })
                .catch(error => console.log(error));
        } else {
            FetchBackend('POST', 'device/update', newDeviceData)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                })
                .catch(error => console.log(error));
        }
        getAllDeviceData();

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
                                onChange={onChange}
                                required
                            />
                            <TextField
                                variant="outlined"
                                label={"Price"}
                                value={newDeviceData.price}
                                onChange={onChange}
                                required
                                slotProps={{ input: { inputMode: 'numeric', pattern: '[0-9]*', endAdornment: <EuroIcon/> }}}
                            />
                            <FormControl size="small">
                                <StyledSelect
                                    value={newDeviceData.category}
                                    onChange={onChange}
                                >
                                    <MenuItem value={"%"}><em>Category</em></MenuItem>
                                    <MenuItem value={"tools"}>Tools</MenuItem>
                                    <MenuItem value={"media"}>Media</MenuItem>
                                    <MenuItem value={"home"}>Home</MenuItem>
                                </StyledSelect>
                            </FormControl>
                            <TextField
                                fullWidth
                                variant="outlined"
                                multiline rows={5}
                                label={"Description"}
                                value={newDeviceData.description}
                                onChange={onChange}/>
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
                        {images.length > 0 ? (
                            images.map(image => (
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
                            ))
                        ) : (
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                height: '100%'
                            }}>
                                <span>No images uploaded</span>
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