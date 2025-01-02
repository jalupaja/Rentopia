package com.othr.rentopia.service;

import java.util.ArrayList;
import java.util.List;

import com.othr.rentopia.model.ChatMessage;
import com.othr.rentopia.model.Ticket;
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
	@Transactional
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

	@Override
	public List<Chat> getChatsForUser(Long userId) {
		List<Chat> userChats = new ArrayList<>();

		String query = "SELECT c FROM Chat c" +
				" WHERE c.firstAccount.id = :userId OR c.secondAccount.id = :userId";
		try {
			userChats = entityManager
					.createQuery(query, Chat.class)
					.setParameter("userId", userId)
					.getResultList();
		} catch (NoResultException e) {
			System.out.println(e.getMessage());
		}

		return userChats;
	}

	@Override
	public List<ChatMessage> getMessagesFromChat(Long chatId) {
		List<ChatMessage> messages = new ArrayList<>();

		String query = "SELECT m FROM ChatMessage m" +
				" WHERE m.chat.id = :chatId";
		try {
			messages = entityManager
					.createQuery(query, ChatMessage.class)
					.setParameter("chatId", chatId)
					.getResultList();
		} catch (NoResultException e) {
			System.out.println(e.getMessage());
		}

		return messages;
	}

	@Override
	@Transactional
	public void saveMessage(ChatMessage message) {
		entityManager.persist(message);
	}

	@Override
	public Chat getChatForId(Long chatId) {
		Chat chat = null;
		String query = "SELECT c FROM Chat c WHERE c.id = :chatId";

		try {
			chat = entityManager
					.createQuery(query, Chat.class)
					.setParameter("chatId", chatId)
					.getSingleResult();
		} catch (NoResultException e) {
			System.out.println(e.getMessage());
		}

		return chat;
	}

	@Override
	@Transactional
	public void updateChatMessage(ChatMessage message) {
		entityManager.merge(message);
	}

	@Override
	public boolean chatExists(Chat chat) {
		String query = "SELECT c FROM Chat c WHERE " +
				"(c.firstAccount = :firstUser AND c.secondAccount = :secondUser)" +
				"OR (c.firstAccount = :secondUser AND c.secondAccount = :firstUser)";

		try {
			chat = entityManager
					.createQuery(query, Chat.class)
					.setParameter("firstUser", chat.getFirstAccount())
					.setParameter("secondUser", chat.getSecondAccount())
					.getSingleResult();
		} catch (NoResultException e) {
			return false;
		}

		return true;
	}
}
