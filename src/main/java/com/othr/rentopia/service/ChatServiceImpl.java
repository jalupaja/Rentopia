package com.othr.rentopia.service;

import java.util.List;
import jakarta.persistence.Tuple;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceException;
import org.springframework.stereotype.Service;

import com.othr.rentopia.service.ChatService;
import com.othr.rentopia.model.Chat;

@Service
public class ChatServiceImpl implements ChatService {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public void saveChat(Chat chat) {
	entityManager.persist(chat);
    }

    @Override
    public List<Chat> getChatsBetweenAccounts(Long fromId, Long toId) {
	// TODO beide richtungen!!!
	List<Chat> chats = null;

	String query = "SELECT c FROM Chat c WHERE c.fromId = :fromId AND c.toId = :toId";
	try {
	    chats = entityManager
		    .createQuery(query, Chat.class)
		    .setParameter("fromId", fromId)
		    .setParameter("toId", toId)
		    .getResultList();
	} catch (NoResultException e) {
	}

	try {
	    chats.addAll(entityManager
		    .createQuery(query, Chat.class)
		    .setParameter("fromId", toId)
		    .setParameter("toId", fromId)
		    .getResultList()
		    );
	} catch (NoResultException e) {
	}

	return chats;
    }

    @Override
    public List<Tuple> getChatsforAccount(Long accountId) {

	List<Tuple> accounts = null;

	// Get a list of all Account names that have at least once wrote to accountId as well as the read status, if the message has been read by accountId.
	String query = """
	    SELECT a.name,
		   CASE WHEN c.toId = :accountId AND c.read = true THEN true ELSE false END as read
		       FROM Account a
		       JOIN Chat c ON c.fromId = a.id OR c.toId = a.id
		       WHERE (c.toId = :accountId OR c.fromId = :accountId)
		       GROUP BY a.id
		       ORDER BY MAX(c.timestamp) DESC
		       """;
	try {
	    accounts = entityManager
		.createQuery(query, Tuple.class)
		.setParameter("accountId", accountId)
		.getResultList();
	} catch (NoResultException e) {
	}

        return accounts;
    }

    @Override
    public void removeChat(Long chatId) {
	String query = "DELETE FROM Chat WHERE id = :chatId";
	try {
	    entityManager
		.createQuery(query)
		.setParameter("chatId", chatId)
		.executeUpdate();
	} catch (PersistenceException e) {
	    System.err.println("ERROR removing Chat with ID " + chatId + ": " + e.getMessage());
	}
    }
}
