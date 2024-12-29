package com.othr.rentopia.service;

import java.util.List;

import com.othr.rentopia.model.ChatMessage;

import com.othr.rentopia.model.Chat;

public interface ChatService {
    public void saveChat(Chat chat);
    public void removeChat(Long chatId);

    public List<Chat> getChatsForUser(Long userId);
    public List<ChatMessage> getMessagesFromChat(Long chatId);

    public void saveMessage(ChatMessage message);
}
