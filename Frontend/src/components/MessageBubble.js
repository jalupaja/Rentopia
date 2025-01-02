import {Paper, Typography, Grid2, Box} from "@mui/material";
import * as React from "react";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CheckIcon from '@mui/icons-material/Check';

function MessageBubble({message = null, isSender = true}){
    const parseTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const options = { day : "numeric", month : "numeric",hour:"2-digit", minute:"2-digit"};
        return date.toLocaleString('de-de', options);
    }
    return (
        <Box>
            <Paper sx={{
                float: isSender ? "right" : "left",
                marginLeft : "5%",
                marginRight : "5%",
                maxWidth : "50%",
                marginTop : "2%",
                padding : "1%"
            }}>
                <Grid2 container columns={2} >
                    <Grid2 size={1}>
                        <Typography sx ={{wordWrap: "break-word", fontWeight: 'bold' }}>
                            {message.sender.name}
                        </Typography>
                    </Grid2>
                    <Grid2 size={10} columns={1}>
                        <Typography sx ={{wordWrap: "break-word"}}>
                            {message.content}
                        </Typography>
                    </Grid2>
                    <Grid2 columns={1} sx={{justifyContent : isSender ? "end" : "start"}}>
                        <Typography variant="caption">
                            {parseTimestamp(message.timestamp)}
                        </Typography>
                    </Grid2>

                </Grid2>

            </Paper>
        </Box>
    )
}

export default MessageBubble;