import {Alert, Box} from "@mui/material";

function ResponsePopup({message = "", reason=""}){
    return (
        <Box sx={{width : "100%", paddingRight : 0 }}>
            <Alert severity={reason}>{message}</Alert>
        </Box>
    );
}

export default ResponsePopup;