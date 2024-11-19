package com.othr.rentopia.service.impl;

import java.util.List;
import jakarta.transaction.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceException;
import org.springframework.stereotype.Service;

import com.othr.rentopia.model.Bookmark;
import com.othr.rentopia.service.BookmarkService;

@Service
public class BookmarkServiceImpl implements BookmarkService {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public void saveBookmark(Bookmark bookmark) {
	entityManager.persist(bookmark);
    }

    @Override
    public List<Bookmark> getBookmarksByOwner(Long ownerId) {
	List<Bookmark> bookmarks = null;

	String query = "SELECT b FROM Bookmark b WHERE b.ownerId = :ownerId";
	try {
	    bookmarks = entityManager
		    .createQuery(query, Bookmark.class)
		    .setParameter("ownerId", ownerId)
		    .getResultList();
	} catch (NoResultException e) {
	}

	return bookmarks;
    }

    @Override
    public void removeBookmark(Long bookmarkId) {
	String query = "DELETE FROM Bookmark WHERE id = :bookmarkId";
	try {
	    entityManager
		.createQuery(query)
		.setParameter("bookmarkId", bookmarkId)
		.executeUpdate();
	} catch (PersistenceException e) {
	    System.err.println("ERROR removing Bookmark with ID " + bookmarkId + ": " + e.getMessage());
	}
    }
}
