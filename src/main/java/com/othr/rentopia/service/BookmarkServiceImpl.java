package com.othr.rentopia.service.impl;

import java.util.List;
import jakarta.transaction.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceException;
import org.springframework.stereotype.Service;

import com.othr.rentopia.model.Bookmark;
import com.othr.rentopia.model.Device;
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
    @Transactional
    public boolean removeBookmark(Long ownerId, Long deviceId) {
        String query = "DELETE FROM Bookmark WHERE ownerId = :ownerId AND deviceId = :deviceId";
        try {
            entityManager.createQuery(query)
                    .setParameter("ownerId", ownerId)
                    .setParameter("deviceId", deviceId)
                    .executeUpdate();
        } catch (PersistenceException e) {
            System.err.println(
                    "ERROR deleting Bookmark for user " + ownerId + " and Device " + deviceId + ": " + e.getMessage());
            return false;
        }
        return true;
    }

    @Override
    public boolean checkBookmark(Long ownerId, Long deviceId) {
        String query = "SELECT b FROM Bookmark b WHERE ownerId = :ownerId AND deviceId = :deviceId";
        try {
            entityManager
                    .createQuery(query, Bookmark.class)
                    .setParameter("ownerId", ownerId)
                    .setParameter("deviceId", deviceId)
                    .getSingleResult();
            return true;
        } catch (NoResultException e) {
            return false;
        }
    }

    @Override
    public List<Device> getBookmarkedDevices(Long ownerId) {
        List<Device> devices = null;

        String query = "SELECT d FROM Device d JOIN Bookmark b ON d.id = b.deviceId WHERE b.ownerId = :ownerId";
        try {
            devices = entityManager
                    .createQuery(query, Device.class)
                    .setParameter("ownerId", ownerId)
                    .getResultList();
        } catch (NoResultException e) {
            // no Bookmarks yet
        }

        return devices;
    }

}
