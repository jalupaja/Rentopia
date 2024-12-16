import {Typography, Box, MenuItem, FormControl, InputLabel, Select, TextField, Button,Grid2} from "@mui/material";
import * as React from "react";
import {InputFieldStyle} from "../sites/Register.js";

function TicketDetail({ticket}){
    const initTicket = ticket;
    const editable = ticket.status !== "new";

    const [titleError, setTitleError] = React.useState(false);
    const validate = () => {
        let error = !ticketInfo.title || ticketInfo.title.length === 0;
        setTitleError(error);
        if(error){
            return false;
        }

        return true;
    }
    const [ticketInfo, setTicketInfo] = React.useState(initTicket);
    const handleChange = (e) => {
        const {name, value} = e.target;
        setTicketInfo({
            ...ticketInfo,
            [name] : value
        });
    };

    const handleSubmitTicket = () => {
        if(validate()){

        }
    };
    const handleDeleteTicket = () => {
        //todo if status new or not
    };
    return (
        <Box sx={{padding:"1%"}}>
            <Typography variant="button" gutterBottom variant="h4">
                Ticket {ticket.id !== -1 ? ticket.id : ""}
            </Typography>
            <Typography variant="button" gutterBottom variant="h5">
                Status: {ticket.status}
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
                    <MenuItem value={"General"}>General</MenuItem>
                </Select>
            </FormControl>
            <TextField
                fullWidth
                name="details" value={ticketInfo.details} onChange={handleChange}
                label="Details"
                multiline rows={6}
                disabled={editable} margin="normal"
            />
            <Grid2 container sx={{marginTop : "1%"}}>
                <Button variant="contained" sx={{marginRight : "1%"}}
                    style={{display: ticket.status==="new" ? "inherit": "none"}}
                    onClick={handleSubmitTicket}>
                    Submit Ticket
                </Button>
                <Button variant="contained" onClick={handleDeleteTicket}>
                    Delete Ticket
                </Button>
            </Grid2>
        </Box>

    );
}

export default TicketDetail;