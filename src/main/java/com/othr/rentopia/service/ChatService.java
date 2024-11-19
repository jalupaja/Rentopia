package com.othr.rentopia.service;

import java.util.List;

import com.othr.rentopia.model.Chat;
import com.othr.rentopia.model.Account;

public interface ChatService {
    public void saveChat(Chat chat);
    public List<Chat> getChatsBetweenAccounts(Long fromId, Long toId);
    public List<Long> getUnreadChats(Long toId);
    public void removeChat(Long chatId);
}
