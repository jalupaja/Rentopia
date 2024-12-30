import {
    Box,
    Button,
    FormControl,
    Grid2,
    InputLabel,
    List,
    ListItemButton,
    ListItemIcon,
    MenuItem,
    Select, Typography
} from "@mui/material";
import {FrameStyle} from "./Register";
import Appbar from "../components/Appbar";
import * as React from "react";
import FetchBackend, {GetAuthUser, ReturnHomeWhenLoggedOut} from "../helper/BackendHelper";
import Footer from "../components/Footer";
import PersonIcon from '@mui/icons-material/Person';
import StoreIcon from '@mui/icons-material/Store';
import {useEffect} from "react";
import ResponsePopup from "../components/ResponsePopup";
import ChatComponent from "../components/Chat";

function ChatSite(){
    ReturnHomeWhenLoggedOut();

    const authUser = GetAuthUser();

    const [chats, setChats] = React.useState([]);
    const [statusLabel, setStatusLabel] = React.useState(null);
    const [chatComponent, setChatComponent] = React.useState(null);

    const fetchChats = () => {
        if(authUser != null){
            FetchBackend("GET",  "chat/all/"+authUser.id, null)
                .then(response => response.json())
                .then(data => setChats(data))
                .catch(e => {
                    setStatusLabel(<ResponsePopup message={"Chats are currently not available. Please try again"}
                                                  reason={"error"}/>);
                });
        }

    }

    const getOtherUser = (chat) => {
        if(authUser){
            if(chat.firstAccount.id !== authUser.id){
                return chat.firstAccount;
            }
            else if(chat.secondAccount.id !== authUser.id){
                return chat.secondAccount;
            }
            else{
                throw "User id in chat error";
            }
        }

        return {};
    };

    const handleChatSelection = (index) => {
        if(chats != null && index >= 0 && index < chats.length){
            setChatComponent(<ChatComponent chat={chats[index]} authUser={authUser}/>)
        }
    };

    useEffect(()=>{
        fetchChats();
    }, [authUser]);
    return(
        <Box sx = {{ ...FrameStyle}}>
            <Appbar authUser={authUser}/>
            <Grid2 container sx={{width : "100%", height : "100%"}}>

                <Grid2 size={3} sx={{padding : "1%"}}>
                    <Typography gutterBottom variant="h6" >
                        Your Chats
                    </Typography>
                    <List>
                        {
                            chats.map((chat, index) => (
                                <ListItemButton
                                    key={index} onClick={() => handleChatSelection(index)}>
                                    <ListItemIcon>
                                        {getOtherUser(chat).role !== "COMPANY"
                                            ? <PersonIcon fontSize="small" />
                                            : <StoreIcon fontSize="small" />
                                        }
                                    </ListItemIcon>
                                    {getOtherUser(chat).name}
                                </ListItemButton>
                            ))
                        }
                    </List>

                </Grid2>
                <Grid2 size={9} >
                    {statusLabel}
                    {chatComponent}
                </Grid2>
            </Grid2>
            <Box sx={{flex : "auto"}}/>
            <Footer/>
        </Box>
    );
}

export default ChatSite;