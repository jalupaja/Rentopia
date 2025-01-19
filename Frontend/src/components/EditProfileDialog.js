import {
    Avatar, Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, IconButton, TextField
} from "@mui/material";
import * as React from 'react';
import {useEffect, useState} from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from '@mui/icons-material/Upload';
import FetchBackend from "../helper/BackendHelper";
import {useTranslation} from "react-i18next";

function EditProfileDialog({open, userData, setUserData, handleEditDialogClose}) {

    const { t } = useTranslation("", { keyPrefix: "profile" });
    const [avatar, setAvatar] = useState(null);
    const initialUserData = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        description: userData.description ? userData.description : " ",
        postCode: userData.location.postalCode,
        city: userData.location.city,
        street: userData.location.street,
        country: userData.location.country,
        company: userData.company ? userData.company : " ",
    };

    const [newUserData, setNewUserData] = useState(initialUserData);

    useEffect(() => {
        setNewUserData(initialUserData);
    }, [userData]);

    const onChange = (e) => {
        const {name, value} = e.target;
        setNewUserData(prevState => ({...prevState, [name]: value}));
    }

    const clearFields = () => {
        setNewUserData({...initialUserData});
    }

    const handleDeleteAvatar = () => {
        setAvatar(null);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(URL.createObjectURL(file));
        }
    };

    const closeDialog = () => {
        clearFields();
        handleEditDialogClose();
    }

    const handleSave = (event) => {
        event.preventDefault();

        FetchBackend('POST', 'user/update', newUserData)
            .then(response => response.json())
            .then(data => {setUserData(data) })
            .catch((error) => {
                console.log(error);
            });

        closeDialog();
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
                <DialogTitle>{t("edit_profile")}</DialogTitle>
                <DialogContent>
                    <Box display="flex" mb={2}>
                        <Avatar
                            src={avatar}
                            sx={{ width: 100, height: 100 }}
                        />
                        {/*<IconButton component="label" sx={{alignSelf: 'flex-end'}}>
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
                        </IconButton>*/}
                    </Box>
                    <Box display="flex" justifyContent={"space-between"}>
                        <TextField
                            label={t("name")}
                            margin="normal"
                            name="name"
                            value={newUserData.name}
                            onChange={onChange}
                            sx={{width: "49%"}}
                        />
                    </Box>
                    <TextField
                        label={t("email")}
                        fullWidth
                        margin="normal"
                        name="email"
                        value={newUserData.email}
                        onChange={onChange}
                    />

                    <TextField
                        label={t("description")}
                        multiline
                        rows={4}
                        fullWidth
                        name="description"
                        margin="normal"
                        value={newUserData.description}
                        onChange={onChange}
                    />
                    <Box  display="flex" justifyContent={"space-between"}>
                        <TextField
                            disabled={userData.role === "USER"}
                            margin="normal"
                            name="company"
                            value={newUserData.company}
                            onChange={onChange}
                            sx={{width: "49%"}}
                        />
                        <TextField
                            label={t("country")}
                            margin="normal"
                            name="country"
                            value={newUserData.country}
                            onChange={onChange}
                            sx={{width: "49%"}}
                        />
                    </Box>
                    <Box display={"flex"} justifyContent={"space-between"} flexWrap={"wrap"}>
                        <TextField
                            label={t("post_code")}
                            margin="normal"
                            name="postCode"
                            value={newUserData.postCode}
                            onChange={onChange}
                            sx={{width: "29%"}}
                        />
                        <TextField
                            label={t("city")}
                            margin="normal"
                            name="city"
                            value={newUserData.city}
                            onChange={onChange}
                            sx={{width: "69%"}}
                        />
                        <TextField
                            label={t("street")}
                            margin="normal"
                            name="street"
                            value={newUserData.street}
                            onChange={onChange}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color={"error"}>{t("cancel")}</Button>
                    <Button onClick={handleSave} type="submit">{t("save")}</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default EditProfileDialog;