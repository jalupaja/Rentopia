import {Divider, IconButton, ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import * as React from "react";

function DeviceListItem({DeviceName="Test Tool", DeviceId=null}) {

    return (
        <div>
            <ListItem >
                <ListItemAvatar></ListItemAvatar>
                <ListItemText primary={DeviceName} />
                <IconButton edge="end" aria-label="edit">
                    <EditIcon/>
                </IconButton>
                <IconButton edge="end" aria-label="delte">
                    <DeleteIcon/>
                </IconButton>
            </ListItem>
            <Divider/>
        </div>
    )
}

export default DeviceListItem;
