package com.othr.rentopia.service;

import java.util.List;
import jakarta.persistence.Tuple;

import com.othr.rentopia.model.Chat;
import com.othr.rentopia.model.Account;

public interface ChatService {
    public void saveChat(Chat chat);
    public List<Chat> getChatsBetweenAccounts(Long fromId, Long toId);
    public List<Tuple> getChatsforAccount(Long toId);
    public void removeChat(Long chatId);
}
