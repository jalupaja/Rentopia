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
import {useTranslation} from "react-i18next";

function ChangePasswordDialog({open, handleEditDialogClose}){
    const { t } = useTranslation("", { keyPrefix: "profile" });

    const [oldPassword, setOldPassword] = React.useState(null);
    const [newPassword, setNewPassword] = React.useState(null);
    const [confirmedPassword, setConfirmedPassword] = React.useState(null);
    const [errorLabel, setErrorLabel] = React.useState(null);

    const resetUI = () => {
        setErrorLabel(null);
        setOldPassword(null);
        setNewPassword(null);
        setConfirmedPassword(null);
    };
    const giveFeedback = (message, success) => {
        const reason = success ? "success" : "error";
        setErrorLabel(<ResponsePopup reason={reason} message={message}/>);
    }
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
            else{
                giveFeedback( t("passwords_dont_match"), false);
            }
        }
        else{
            giveFeedback(t("input_empty"), false);
        }

        return false;
    }
    const changePassword = () => {
        if(validate()){
            const request = {
                oldPassword : oldPassword,
                newPassword : newPassword
            }

            let message = t("general_error");
            FetchBackend("POST", "user/changePassword", request)
                .then(response => response.json())
                .then(data => {
                    if(data.success){
                        resetUI();
                        giveFeedback(t("change_password_success"), true);
                        return;
                    }

                    if(data.reason && data.reason === "password_invalid"){
                        message = t("password_invalid");
                    }

                    giveFeedback(message, false);
                })
                .catch((e) => giveFeedback( t("general_error"), false));
        }
    };

    useEffect(() => {
        resetUI();
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
                <DialogTitle>{t("password_dialog_title")}</DialogTitle>
                <DialogContent>
                    {errorLabel}
                    <TextField
                        label={t("old_password")}
                        fullWidth
                        margin="normal"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />

                    <TextField
                        label={t("new_password")}
                        fullWidth
                        margin="normal"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <TextField
                        label={t("confirm_password")}
                        fullWidth
                        margin="normal"
                        value={confirmedPassword}
                        onChange={(e) => setConfirmedPassword(e.target.value)}
                    />
                    <Link href="/resetPassword" >{t("forgot_password")}</Link>
                    {//todo : password visibility
                         }
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color={"error"}>{t("cancel")}</Button>
                    <Button onClick={changePassword} >{t("change")}</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default ChangePasswordDialog;