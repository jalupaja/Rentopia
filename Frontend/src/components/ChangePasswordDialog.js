import * as React from "react";
import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton, Link,
    TextField
} from "@mui/material";
import FetchBackend from "../helper/BackendHelper";
import ResponsePopup from "./ResponsePopup";
import {useEffect} from "react";

function ChangePasswordDialog({open, handleEditDialogClose}){

    const [oldPassword, setOldPassword] = React.useState(null);
    const [newPassword, setNewPassword] = React.useState(null);
    const [confirmedPassword, setConfirmedPassword] = React.useState(null);
    const [errorLabel, setErrorLabel] = React.useState(null);

    const closeDialog = (event) => {
        handleEditDialogClose();
    };
    const notNullOrEmpty = (string) => {
        return string && string.length > 0;
    };
    const validate = () => {
        if(notNullOrEmpty(oldPassword) && notNullOrEmpty(newPassword) && notNullOrEmpty(confirmedPassword)){
            if(newPassword === confirmedPassword){
                return true;
            }
        }

        return false;
    }
    const changePassword = () => {
        //validate length and equality
        if(validate()){
            const request = {
                oldPassword : oldPassword,
                newPassword : newPassword
            }

            let message = "An error occured. Please try again";
            FetchBackend("POST", "user/changePassword", request)
                .then(response => response.json())
                .then(data => {
                    if(data.success){
                        //todo
                        closeDialog();
                        return;
                    }

                    if(reason && reason === "password_invalid"){
                        message = "Password invalid";
                    }
                })
                .catch((e) => console.log(e))
                .finally(() => {
                    setErrorLabel(<ResponsePopup reason="error" message={message}/>);
                });
        }
    };

    useEffect(() => {
        setErrorLabel(null);
        setOldPassword(null);
        setNewPassword(null);
        setConfirmedPassword(null);
    }, [open]);
    return(
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleEditDialogClose}
                PaperProps={{
                    component: 'form'
                }}
            >
                <DialogTitle>Change Password todo: translation</DialogTitle>
                <DialogContent>
                    {errorLabel}
                    <TextField
                        label="password todo traslation"
                        fullWidth
                        margin="normal"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />

                    <TextField
                        label="new password"
                        fullWidth
                        margin="normal"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <TextField
                        label="confirm password"
                        fullWidth
                        margin="normal"
                        value={confirmedPassword}
                        onChange={(e) => setConfirmedPassword(e.target.value)}
                    />
                    <Link href="/resetPassword" >forgot_password</Link>
                    {//todo : password visibility
                         }
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color={"error"}>Cancel</Button>
                    <Button onClick={changePassword} >Change</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default ChangePasswordDialog;