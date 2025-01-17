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
import {getOtherUser} from "../helper/ChatHelper";
import {useTranslation} from "react-i18next";

function ChatSite(){
    const { t } = useTranslation("", { keyPrefix: "chat" });

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

    const handleChatSelection = (index) => {
        if(chats != null && index >= 0 && index < chats.length){
            setChatComponent(<ChatComponent chat={chats[index].chatInfo} authUser={authUser}/>)
        }
    };

    useEffect(()=>{
        fetchChats();
    }, [authUser]);

    useEffect(() => {
        const intervalId = setInterval(fetchChats, 5000);
        return () => clearInterval(intervalId);
    }, []);

    return(
        <Box sx = {{ ...FrameStyle}}>
            <Appbar authUser={authUser}/>
            <Grid2 container sx={{width : "100%", height : "100%"}}>

                <Grid2 size={3} sx={{padding : "1%"}}>
                    <Typography gutterBottom variant="h6" >
                        {t("your_chats")}
                    </Typography>
                    <List>
                        {
                            chats.map((chat, index) => (
                                <ListItemButton
                                    key={index} onClick={() => handleChatSelection(index)}>
                                    <ListItemIcon>
                                        {getOtherUser(chat.chatInfo, authUser).role !== "COMPANY"
                                            ? <PersonIcon fontSize="small" />
                                            : <StoreIcon fontSize="small" />
                                        }
                                    </ListItemIcon>
                                    <Typography>
                                        {getOtherUser(chat.chatInfo, authUser).name}
                                    </Typography>
                                    <Box sx={{flex : "auto"}}/>
                                    <Typography>
                                        {chat.unreadCount > 0 && chat.unreadCount}
                                    </Typography>
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