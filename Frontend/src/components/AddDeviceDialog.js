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

function AddDeviceDialog({open, handleAddDialogClose}) {

    const [images, setImages] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = React.useState("%");
    const [price, setPrice] = useState(0);

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

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    }

    const handleNameChange = (event) => {
        setName(event.target.value);
    }

    const handlePriceChange = (event) => {
        setPrice(event.target.value);
    }

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    }

    const [errors, setErrors] = useState({
        name: false,
        price: false
    });

    const closeDialog = () => {
        setCategory("%");
        setName("");
        setDescription("");
        setPrice(0);
        setImages([]);
        handleAddDialogClose();
    }

    const handleSave = (event) => {
        event.preventDefault();

        const newErrors = {
            name: !name,
            price: !price
        };

        setErrors(newErrors);

        if (!Object.values(newErrors).includes(true)) {
            console.log('Device successfully Added:', name, price, category, description);
            closeDialog();
        }
    }
    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleAddDialogClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const email = formJson.email;
                        console.log(email);
                        handleAddDialogClose();
                    },
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
                                value={name}
                                onChange={handleNameChange}
                                required
                                error={errors.name}
                                helperText={errors.name ? 'Name is required' : ''}/>
                            <TextField
                                variant="outlined"
                                label={"Price"}
                                value={price}
                                onChange={handlePriceChange}
                                required
                                error={errors.price}
                                helperText={errors.price ? 'Price is required' : ''}
                                slotProps={{ input: { inputMode: 'numeric', pattern: '[0-9]*', endAdornment: <EuroIcon/> }}}/>
                            <FormControl size="small">
                                <StyledSelect
                                    value={category}
                                    onChange={handleCategoryChange}
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
                                value={description}
                                onChange={handleDescriptionChange}/>
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