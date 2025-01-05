import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

export const getOtherUser = (chat, authUser) => {
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