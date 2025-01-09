import {Divider, IconButton, ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import * as React from "react";
import {useNavigate} from "react-router-dom";

function DeviceListItem({DeviceName="Test Tool",
                            DeviceId=null,
                            handleOpenDeviceEdit,
                            handleRemoveBookmark,
                            handleDeleteTool,
                            tabValue})
{
    const navigate = useNavigate();

    return (
        <div>
            <ListItem>
                <IconButton edge="start" aria-label="device" onClick={() => navigate("/device/" + DeviceId)}>
                    <ImageSearchIcon/>
                </IconButton>
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
