import {Divider, IconButton, ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import * as React from "react";

function DeviceListItem({DeviceName="Test Tool",
                            DeviceId=null,
                            handleOpenDeviceEdit,
                            handleRemoveBookmark,
                            handleDeleteTool,
                            tabValue})
{

    const handleOpenDevice = () => {
        //TODO: go to new Site
    }

    return (
        <div>
            <ListItem onClick={handleOpenDevice}>
                <ListItemAvatar></ListItemAvatar>
                <ListItemText primary={DeviceName} />
                {tabValue === 0 ? (
                    <div>
                        <IconButton edge="end" aria-label="edit" onClick={handleOpenDeviceEdit}>
                            <EditIcon/>
                        </IconButton>
                        <IconButton edge="end" aria-label="delte" onClick={handleDeleteTool}>
                            <DeleteIcon color="error"/>
                        </IconButton>
                    </div>
                ) : (tabValue === 1 ? (
                    <IconButton edge="end" aria-label="delte" onClick={handleRemoveBookmark}>
                        <BookmarkIcon color="primary" />
                    </IconButton>
                ) : (''))}
            </ListItem>
            <Divider/>
        </div>
    )
}

export default DeviceListItem;
