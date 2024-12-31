package com.othr.rentopia.controller;

import com.othr.rentopia.model.Account;
import com.othr.rentopia.model.Chat;
import com.othr.rentopia.model.ChatMessage;
import com.othr.rentopia.service.AccountServiceImpl;
import com.othr.rentopia.service.ChatServiceImpl;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController()
@RequestMapping("api/chat")
public class ChatController {

    @Autowired
    private ChatServiceImpl chatService;
    @Autowired
    private AccountServiceImpl accountService;

    @PostMapping()
    public ResponseEntity<String> createChat(@RequestBody String chatInfo) throws Exception {
        JSONObject response = new JSONObject();
        response.put("success", false);

        //todo parse chatinfo
        Chat chat = new Chat();

        try{
            chatService.saveChat(chat);
        } catch (Exception e){
            System.out.println("Error during persistance of chat: " + e.getMessage());
            return new ResponseEntity<>(response.toString(), HttpStatus.OK);
        }

        response.put("success", true);
        return new ResponseEntity<>(response.toString(), HttpStatus.OK);
    }

    @DeleteMapping("{chatId}")
    public ResponseEntity<String> deleteChat(@PathVariable("chatId") Long chatId){
        JSONObject response = new JSONObject();
        response.put("success", false);

        try{
            chatService.removeChat(chatId);
        } catch(Exception e){
            System.out.println("Error during deletion of chat: "+e.getMessage());
            return new ResponseEntity<>(response.toString(), HttpStatus.OK);
        }


        response.put("success", true);
        return new ResponseEntity<>(response.toString(), HttpStatus.OK);
    }

    @GetMapping(path="all/{userId}", produces="application/json")
    public ResponseEntity<String> getUserChats(@PathVariable("userId") Long userId) {

        JSONArray response = new JSONArray();

        List<Chat> userChats = chatService.getChatsForUser(userId);
        for(Chat chat : userChats){
            JSONObject chatJSON = new JSONObject();
            chatJSON.put("chatInfo", new JSONObject(chat));

            List<ChatMessage> messages = chatService.getMessagesFromChat(chat.getId());
            Long unreadCount = messages.stream()
                    .filter(msg -> msg.getSender().getId() != userId && !msg.getIsRead())
                    .count();

            chatJSON.put("unreadCount", unreadCount);
            response.put(chatJSON);
        }
        return new ResponseEntity<>(response.toString(), HttpStatus.OK);
    }

    @GetMapping(path="messages/{chatId}/{receiverId}", produces="application/json")
    public ResponseEntity<List<ChatMessage>> getMessagesFromChat(@PathVariable("chatId") Long chatId,
                                                                 @PathVariable("receiverId") Long userId){
        List<ChatMessage> messages = chatService.getMessagesFromChat(chatId);


        messages.forEach(msg -> {
            if(!msg.getSender().getId().equals(userId)){
                msg.setIsRead(true);
            }
        });

        for(ChatMessage message : messages){
            try{
                chatService.updateChatMessage(message);
            }catch(Exception e){
                System.out.println(e);
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        return new ResponseEntity<>( messages, HttpStatus.OK);
    }

    @PostMapping(path="message")
    public ResponseEntity<String> saveChatMessage(@RequestBody String chatMessage){
        JSONObject response = new JSONObject();
        response.put("success", false);

        JSONObject request = new JSONObject(chatMessage);

        ChatMessage message = new ChatMessage();
        message.setContent((String)request.get("content"));
        message.setIsRead(false);

        Long chatID = request.getLong("chatId");
        Long senderId = request.getLong("senderId");

        Account sender = accountService.getAccountById(senderId);
        if(sender == null){
            response.put("reason", "user doesnt exist");
            return new ResponseEntity<>(response.toString(), HttpStatus.OK);
        }
        message.setSender(sender);

        Chat chat = chatService.getChatForId(chatID);
        if(chat == null){
            response.put("reason", "chat doesnt exist");
            return new ResponseEntity<>(response.toString(), HttpStatus.OK);
        }
        message.setChat(chat);

        try{
            chatService.saveMessage(message);
        } catch (Exception e){
            System.out.println("Error during persistance of chat message: " + e.getMessage());
            return new ResponseEntity<>(response.toString(), HttpStatus.OK);
        }

        response.put("success", true);

        return new ResponseEntity<>(response.toString(), HttpStatus.OK);
    }
}
