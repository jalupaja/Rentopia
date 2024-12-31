package com.othr.rentopia.service;

import java.util.List;

import com.othr.rentopia.model.ChatMessage;

import com.othr.rentopia.model.Chat;

public interface ChatService {
    void saveChat(Chat chat);
    void removeChat(Long chatId);

    List<Chat> getChatsForUser(Long userId);
    List<ChatMessage> getMessagesFromChat(Long chatId);

    void saveMessage(ChatMessage message);
    Chat getChatForId(Long id);
    void updateChatMessage(ChatMessage message);

}
