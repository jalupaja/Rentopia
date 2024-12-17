import {
    Avatar, Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, IconButton, TextField
} from "@mui/material";
import * as React from 'react';
import {useState} from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from '@mui/icons-material/Upload';

function EditProfileDialog({open, userData, handleEditDialogClose}) {

    const [errors, setErrors] = useState({});
    const [avatar, setAvatar] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');
    const [postCode, setPostCode] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [houseNo, setHouseNo] = useState('');
    const [country, setCountry] = useState('');
    const [company, setCompany] = useState('');

    const handleDeleteAvatar = () => {
        setAvatar(null);
    };

    const closeDialog = (event) => {
        handleEditDialogClose();
    }

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(URL.createObjectURL(file));
        }
    };

    const handleSave = (event) => {
        event.preventDefault();

        const newErrors = {};

        setErrors(newErrors);

        if (!Object.values(newErrors).includes(true)) {
            closeDialog();
        }
    }

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleEditDialogClose}
                PaperProps={{
                    component: 'form'
                }}
            >
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <Box display="flex" mb={2}>
                        <Avatar
                            src={avatar}
                            sx={{ width: 100, height: 100 }}
                        />
                        <IconButton component="label" sx={{alignSelf: 'flex-end'}}>
                            <UploadIcon />
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleAvatarChange}
                            />
                        </IconButton>
                        <IconButton  sx={{alignSelf: 'flex-end'}}
                            color="error"
                            onClick={handleDeleteAvatar}
                        >
                            <DeleteIcon/>
                        </IconButton>
                    </Box>
                    <Box display="flex" justifyContent={"space-between"}>
                        <TextField
                            label="Name"
                            margin="normal"
                            value={userData ? userData.name : undefined}
                            onChange={(e) => setName(e.target.value)}
                            sx={{width: "49%"}}
                        />
                    </Box>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={userData ? userData.email : undefined}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <TextField
                        label="Description"
                        multiline
                        rows={4}
                        fullWidth
                        margin="normal"
                        value={userData ? userData.description : undefined}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Box  display="flex" justifyContent={"space-between"}>
                        <TextField
                            label="Company"
                            margin="normal"
                            value={userData ? userData.company : undefined}
                            onChange={(e) => setCompany(e.target.value)}
                            sx={{width: "49%"}}
                        />
                        <TextField
                            label="Country"
                            margin="normal"
                            value={userData ? userData.location.country : undefined}
                            onChange={(e) => setCountry(e.target.value)}
                            sx={{width: "49%"}}
                        />
                    </Box>
                    <Box display={"flex"} justifyContent={"space-between"} flexWrap={"wrap"}>
                        <TextField
                            label="Post Code"
                            margin="normal"
                            value={userData ? userData.location.postalCode : undefined}
                            onChange={(e) => setPostCode(e.target.value)}
                            sx={{width: "29%"}}
                        />
                        <TextField
                            label="City"
                            margin="normal"
                            value={userData ? userData.location.city : undefined}
                            onChange={(e) => setCity(e.target.value)}
                            sx={{width: "69%"}}
                        />
                        <TextField
                            label="Street"
                            margin="normal"
                            value={userData ? userData.street : undefined}
                            onChange={(e) => setStreet(e.target.value)}
                            sx={{width: "79%"}}
                        />
                        <TextField
                            label="House No."
                            margin="normal"
                            value={houseNo}
                            onChange={(e) => setHouseNo(e.target.value)}
                            sx={{width: "19%"}}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color={"error"}>Cancel</Button>
                    <Button onClick={handleSave} type="submit">Save</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default EditProfileDialog;