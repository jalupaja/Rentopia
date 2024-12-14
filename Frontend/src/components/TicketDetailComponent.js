import {Typography, Box, MenuItem, FormControl, InputLabel, Select, TextField, Button,Grid2} from "@mui/material";
import * as React from "react";
import {InputFieldStyle} from "../sites/Register.js";

function TicketDetail({ticket}){
    //todo
    const testStatus = "open";

    const editable = testStatus !== "new";

    const [ticketCategory, setTicketCategory] = React.useState('General');
    const handleCategorySelection = (event) => {
        setTicketCategory(event.target.value);
    };

    return (
        <Box sx={{padding:"1%"}}>
            <Typography variant="button" gutterBottom variant="h4">
                TITLE #ID
            </Typography>
            <Typography variant="button" gutterBottom variant="h5">
                Status: STATUS
            </Typography>
            <TextField label="Titel" variant="outlined" required disabled={editable}
                       fullWidth margin="normal"/>
            <FormControl margin="normal" fullWidth>
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select disabled={editable}
                    value={ticketCategory}
                    label="Category"
                    onChange={handleCategorySelection}
                >
                    <MenuItem value={"General"}>General</MenuItem>
                    <MenuItem value={"Own Devices"}>Own Devices</MenuItem>
                </Select>
            </FormControl>
            <TextField
                fullWidth
                label="Details"
                multiline
                rows={6}
                disabled={editable}
                margin="normal"
            />
            <Grid2 container sx={{marginTop : "1%"}}>
                <Button variant="contained" sx={{marginRight : "1%"}}
                    style={{display: testStatus==="new" ? "inherit": "none"}}    >
                    Submit Ticket
                </Button>
                <Button variant="contained" >
                    Delete Ticket
                </Button>
            </Grid2>
        </Box>

    );
}

export default TicketDetail;