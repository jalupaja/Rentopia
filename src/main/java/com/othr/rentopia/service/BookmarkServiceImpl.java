package com.othr.rentopia.service.impl;

import java.util.List;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import org.springframework.stereotype.Service;

import com.othr.rentopia.model.Bookmark;
import com.othr.rentopia.service.BookmarkService;

@Service
public class BookmarkServiceImpl implements BookmarkService {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void saveBookmark(Bookmark bookmark) {
	entityManager.persist(bookmark);
    }

    @Override
    public List<Bookmark> getBookmarksByOwner(Long ownerId) {
	List<Bookmark> bookmarks = null;

	String query = "SELECT b FROM Bookmark b WHERE b.owner = :ownerId";
	try {
	    bookmarks = entityManager
		    .createQuery(query, Bookmark.class)
		    .setParameter("owner", ownerId)
		    .getResultList();
	} catch (NoResultException e) {
	}

	return bookmarks;
    }

    @Override
    public void removeBookmark(Long bookmarkId) {
	String query = "DELETE b FROM Bookmark b WHERE b.id = :bookmarkId";
	try {
	    entityManager
		.createQuery(query, Bookmark.class)
		.setParameter("bookmarkId", bookmarkId)
		.executeUpdate();
	} catch (NoResultException e) {
	}
    }
}
