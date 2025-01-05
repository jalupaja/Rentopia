import {Box, IconButton, InputAdornment, TextField, Grid2, Paper, Typography} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import * as React from "react";
import MessageBubble from "./MessageBubble";
import FetchBackend from "../helper/BackendHelper";
import {useEffect} from "react";
import {getOtherUser} from "../helper/ChatHelper";
import {useTranslation} from "react-i18next";

function ChatComponent({chat = null, authUser = null}){
    const { t } = useTranslation("", { keyPrefix: "chat" });

    const [messages, setMessages] = React.useState([]);
    const [newMessage, setNewMessage] = React.useState("");
    const handleTypeMessage = (e) => {
        setNewMessage(e.target.value);
    }
    const handleSend = () => {
        if(newMessage){
            const message = {
                content : newMessage,
                chatId : chat.id,
                senderId : authUser.id
            }
            FetchBackend("POST", "chat/message", message)
                .then(response => response.json())
                .then(data => {
                    if(!data.success){
                        //todo
                    }
                })
                .catch(e => console.log(e))
                .finally(() => {
                    fetchMessages(chat);
                })

            setNewMessage("");
        }
    }

    const fetchMessages = (chat) => {
        FetchBackend("GET", "chat/messages/"+chat.id+"/"+authUser.id, null)
            .then(response => response.json())
            .then(data => {
                let orderedMessages = data.sort(function(a, b){
                    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
                });

                setMessages(orderedMessages);
            })
                .catch(e => console.log(e));
    };

    setInterval(() => fetchMessages(chat), 5000);

    useEffect(() => {
        fetchMessages(chat);
    }, [chat, authUser]);
    return(
        <Box >
            <Typography variant="h3" >
                {getOtherUser(chat, authUser).name}
            </Typography>
            <Box sx={{
                overflowY : "scroll",
                height : "400px",
                display :"flex",
                flexDirection: "column-reverse",
                backgroundColor : "#ebebeb"
            }}>
                    {
                        messages.map((message, index) => (
                            <MessageBubble key={index} message={message} isSender={message.sender.id === authUser.id}/>
                        ))
                    }
            </Box>
            <Box sx={{ backgroundColor : "#ebebeb" }} >
                <TextField sx={{
                    boxSizing: "border-box",
                    padding : "1%",
                    "& .MuiOutlinedInput-root": {backgroundColor : "white"}

                }}
                    value={newMessage} onChange={handleTypeMessage}
                           margin="normal" fullWidth
                           InputProps={{
                               endAdornment: (
                                   <InputAdornment position="end" onClick={handleSend}>
                                       <IconButton edge="end">
                                           <SendIcon/>
                                       </IconButton>
                                   </InputAdornment>)
                           }}
                           placeholder={t("message_hint") + "..."}
                           onKeyPress={(e) => {
                               if (e.key === 'Enter') {
                                   handleSend();
                               }
                           }}
                />
            </Box>

        </Box>
    )
}

export default ChatComponent;