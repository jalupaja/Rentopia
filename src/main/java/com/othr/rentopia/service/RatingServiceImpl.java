package com.othr.rentopia.service;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.util.List;

import com.othr.rentopia.model.Rating;

@Service
public class RatingServiceImpl implements RatingService {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public void saveRating(Rating rating) {
		// INSERT or UPDATE
		entityManager.merge(rating);
    }

    @Override
    @Transactional
    public boolean removeRating(Long ownerId, Long deviceId) {
	String query = "DELETE FROM Rating r WHERE r.accountId = :ownerId AND deviceId = :deviceId";
	try {
	    entityManager.createQuery(query)
		.setParameter("ownerId", ownerId)
		.setParameter("deviceId", deviceId)
		.executeUpdate();
	} catch (PersistenceException e) {
	    System.err.println("ERROR deleting Rating for user " + ownerId + " and device " + deviceId + ": " + e.getMessage());
	    return false;
	}
	return true;
    }

    @Override
    public boolean hasRating(Long ownerId, Long deviceId) {
	String query = "SELECT r FROM Rating r WHERE r.accountId = :ownerId AND deviceId = :deviceId";
	try {
	    entityManager.createQuery(query)
		.setParameter("ownerId", ownerId)
		.setParameter("deviceId", deviceId)
		.getSingleResult();
	    return true;
	} catch (NoResultException e) {
	    return false;
	}
    }

    @Override
    public List<Integer> getRatings(Long deviceId) {
		String query = "SELECT r.rating FROM Rating r WHERE deviceId = :deviceId";

		try {
			List<Integer> ratings = entityManager
				.createQuery(query, Integer.class)
				.setParameter("deviceId", deviceId)
				.getResultList();
			return ratings;
		} catch (NoResultException e) {
			return null;
		}
    }

	@Override
	public Integer getRating(Long ownerId, Long deviceId) {
		String query = "SELECT r.rating FROM Rating r WHERE r.accountId = :ownerId AND deviceId = :deviceId";

		try {
            return entityManager
                    .createQuery(query, Integer.class)
                    .setParameter("deviceId", deviceId)
                    .setParameter("ownerId", ownerId)
                    .getSingleResult();

		} catch (NoResultException e) {
			return null;
		}
	}
}
