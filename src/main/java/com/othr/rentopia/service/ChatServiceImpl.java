package com.othr.rentopia.service;

import java.util.List;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.NoResultException;
import org.springframework.stereotype.Service;

import com.othr.rentopia.service.ChatService;
import com.othr.rentopia.model.Chat;

@Service
public class ChatServiceImpl implements ChatService {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void saveChat(Chat chat) {
	entityManager.persist(chat);
    }

    @Override
    public List<Chat> getChatsBetweenAccounts(Long fromId, Long toId) {
	// TODO beide richtungen!!!
	List<Chat> chats = null;

	String query = "SELECT c FROM Chat c WHERE c.from = :from AND c.to = :to";
	try {
	    chats = entityManager
		    .createQuery(query, Chat.class)
		    .setParameter("from", fromId)
		    .setParameter("to", toId)
		    .getResultList();
	} catch (NoResultException e) {
	}

	try {
	    chats.addAll(entityManager
		    .createQuery(query, Chat.class)
		    .setParameter("from", toId)
		    .setParameter("to", fromId)
		    .getResultList()
		    );
	} catch (NoResultException e) {
	}

	return chats;
    }

    @Override
    public List<Long> getUnreadChats(Long toId) {

	List<Long> accountIds = null;

	String query = "SELECT DISTINCT c.from FROM Chat c WHERE c.to = :to AND c.read = 0";
	try {
	    accountIds = entityManager
		    .createQuery(query, Long.class)
		    .setParameter("to", toId)
		    .getResultList();
	} catch (NoResultException e) {
	}

        return accountIds;
    }

    @Override
    public void removeChat(Long chatId) {
	String query = "DELETE c FROM Chat c WHERE c.id = :chatId";
	try {
	    entityManager
		.createQuery(query, Chat.class)
		.setParameter("chatId", chatId)
		.executeUpdate();
	} catch (NoResultException e) {
	}
    }
}
