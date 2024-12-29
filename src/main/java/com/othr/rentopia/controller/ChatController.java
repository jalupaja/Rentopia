package com.othr.rentopia.controller;

import com.othr.rentopia.model.Chat;
import com.othr.rentopia.model.ChatMessage;
import com.othr.rentopia.service.AccountServiceImpl;
import com.othr.rentopia.service.ChatServiceImpl;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<List<Chat>> getUserChats(@PathVariable("userId") Long userId) {
        return new ResponseEntity<>(chatService.getChatsForUser(userId), HttpStatus.OK);
    }

    @GetMapping(path="messages/{chatId}", produces="application/json")
    public ResponseEntity<List<ChatMessage>> getMessagesFromChat(@PathVariable("chatId") Long chatId){
        return new ResponseEntity<>(chatService.getMessagesFromChat(chatId), HttpStatus.OK);
    }

    @PostMapping(path="message")
    public ResponseEntity<String> saveChatMessage(@RequestBody String chatMessage){
        JSONObject response = new JSONObject();
        response.put("success", false);

        //todo parse chatmessage
        ChatMessage message = new ChatMessage();

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
