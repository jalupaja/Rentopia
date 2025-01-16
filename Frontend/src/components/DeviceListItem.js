import {Divider, IconButton, ListItem, ListItemAvatar, ListItemText, Rating} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import * as React from "react";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import FetchBackend from "../helper/BackendHelper";
import {useEffect} from "react";

function DeviceListItem({DeviceName="Test Tool",
                            DeviceId=null,
                            handleOpenDeviceEdit,
                            handleRemoveBookmark,
                            handleDeleteTool,
                            tabValue})
{
    const navigate = useNavigate();
    const [rating, setRating] = React.useState(0);

    const handleSaveRating = () => {
        FetchBackend('POST', 'rating/rate/' + DeviceId, rating)
            .catch((error) => {console.log(error)})
    }

    useEffect(() => {
        FetchBackend('GET', 'rating/' + DeviceId, null)
            .then(response => response.json())
            .then(data => {
                if(data !== null){
                    setRating(data);
                }
            })
            .catch(error => console.log(error))
    }, []);

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
                ) : (
                    <Rating
                        name="simple-controlled"
                        value={rating}
                        onChange={(event, newValue) => {
                            handleSaveRating(); setRating(newValue);
                        }}
                    />
                ))}
            </ListItem>
            <Divider/>
        </div>
    )
}

export default DeviceListItem;
