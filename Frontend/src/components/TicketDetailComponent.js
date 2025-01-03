import {Typography, Divider, Box, MenuItem, FormControl, InputLabel, Select, TextField, Button,Grid2} from "@mui/material";
import * as React from "react";
import {InputFieldStyle} from "../sites/Register.js";
import FetchBackend from "../helper/BackendHelper.js";
import ResponsePopup from "./ResponsePopup.js";
import {useEffect} from "react";

function TicketDetail({ticketInfo, handleChange, handleTicketAction, adm = false}){
    if(!handleTicketAction){
        handleTicketAction = (e) => {};
    }

    const [titleError, setTitleError] = React.useState(false);
    const editable = ticketInfo.status !== "new";

    const validate = () => {
        let error = !ticketInfo.title || ticketInfo.title.length === 0;
        setTitleError(error);
        if(error){
            return false;
        }

        return true;
    }

    const handleSubmitTicket = () => {
        if(validate()){
            handleTicketAction({
                success : false,
                message : null,
                fetch : false
            });

            let responseSuccess = false;
            let responseMessage = null;
            let responseFetch = false;
            FetchBackend("Post", "ticket", ticketInfo)
                .then(response => {
                    if(response.ok){
                        responseSuccess = true;
                        responseMessage = "Creating Ticket was successful";
                        responseFetch = true;
                    }
                    else{
                        responseSuccess = false;
                        responseMessage = "An error occured, please try again";
                        responseFetch = false;
                    }
                })
                .catch(e =>{
                    responseSuccess = false;
                    responseMessage = "An error occured, please try again";
                    responseFetch = false;
                })
                .finally(() => {
                    handleTicketAction({
                        success : responseSuccess,
                        message : responseMessage,
                        fetch : responseFetch
                    });
                });

        }
    };
    const handleDeleteTicket = () => {
        handleTicketAction({
            success : false,
            message : null,
            fetch : false
        });

        if(!ticketInfo.id || ticketInfo.id < 0){
            //ticket only local, no api call necessary
            handleTicketAction({
                success : true,
                message : "Deleting Ticket was successful",
                fetch : true
            });
            return;
        }

        FetchBackend("Delete", "ticket/"+ticketInfo.id, null)
            .then(response => {
                if(response.ok){
                    handleTicketAction({
                        success : true,
                        message : "Deleting Ticket was successful",
                        fetch : true
                    });
                }
                else{
                    handleTicketAction({
                        success : false,
                        message : "An error occured, please try again",
                        fetch : false
                    });
                }
            })
            .catch(e =>{
                handleTicketAction({
                    success : false,
                    message : "An error occured, please try again",
                    fetch : false
                });
            });
    };

    const handleCloseTicket = (e) => {
        handleTicketAction({
            success : false,
            message : null,
            fetch : false
        });

        ticketInfo.status = "closed";
        FetchBackend("POST", "ticket/"+ticketInfo.id, ticketInfo)
            .then(response => response.json())
            .then(data => {
                if(data.success){
                    handleTicketAction({
                        success : true,
                        message : "Closing ticket was successful",
                        fetch : true
                    });
                }
                else{
                    handleTicketAction({
                        success : false,
                        message : "An error occured, please try again",
                        fetch : false
                    });
                }
            })
            .catch(e => {
                handleTicketAction({
                    success : false,
                    message : "An error occured, please try again",
                    fetch : false
                });
            });
    }
    return (
        <Box sx={{padding:"1%"}}>
            <Typography variant="button" gutterBottom variant="h4">
                Ticket {ticketInfo.id ? "#"+ticketInfo.id : ""}
            </Typography>
            <Typography variant="button" gutterBottom variant="h5">
                Owner: {ticketInfo.owner.name}
            </Typography>
            <Typography variant="button" gutterBottom variant="h5">
                Status: {ticketInfo.status}
            </Typography>
            <TextField label="Title" variant="outlined" required disabled={editable}
                       name="title" value={ticketInfo.title} onChange={handleChange}
                       error={titleError} helperText={titleError ? "Title must not be empty" : null}
                       fullWidth margin="normal"/>
            <FormControl margin="normal" fullWidth>
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select disabled={editable}
                    value={ticketInfo.category} name="category" onChange={handleChange}
                    label="Category"
                >
                    <MenuItem value={"general"}>General</MenuItem>
                </Select>
            </FormControl>
            <TextField
                fullWidth
                name="details" value={ticketInfo.details} onChange={handleChange}
                label="Details"
                multiline rows={6}
                disabled={editable} margin="normal"
            />
            {
                adm ?
                    <Box >
                        <Divider/>
                        <TextField
                            fullWidth
                            name="adminResponse" value={ticketInfo.adminResponse} onChange={handleChange}
                            label="Response"
                            multiline rows={6}
                            disabled={ticketInfo.status === "CLOSED"} margin="normal"
                        />
                    </Box>
                :
                <Box/>
            }
            <Grid2 container sx={{marginTop : "1%"}}>
                <Button variant="contained" sx={{marginRight : "1%"}}
                    style={{display: ticketInfo.status==="new" ? "inherit": "none"}}
                    onClick={handleSubmitTicket}>
                    Submit Ticket
                </Button>
                <Button variant="contained" sx={{marginRight : "1%"}} onClick={handleDeleteTicket}>
                    Delete Ticket
                </Button>
                <Button variant="contained" sx={{marginRight : "1%", color: "secondary"}}
                        style={{display: adm ? "inherit": "none"}}
                        onClick={handleCloseTicket}>
                    Close Ticket
                </Button>
            </Grid2>
        </Box>

    );
}

export default TicketDetail;