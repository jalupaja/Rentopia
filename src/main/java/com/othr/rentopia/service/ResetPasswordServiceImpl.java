package com.othr.rentopia.service;

import com.othr.rentopia.model.Account;
import com.othr.rentopia.model.ResetPasswordToken;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class ResetPasswordServiceImpl implements ResetPasswordService {
    @PersistenceContext
    private EntityManager entityManager;
    @Override
    @Transactional
    public void saveToken(ResetPasswordToken token) {
        entityManager.persist(token);
    }

    @Override
    public ResetPasswordToken getToken(Account user) {
        ResetPasswordToken token = null;

        String query = "SELECT a FROM ResetPasswordToken a WHERE a.userEmail = :accountEmail";
        try {
            token = entityManager
                    .createQuery(query, ResetPasswordToken.class)
                    .setParameter("accountEmail", user.getEmail())
                    .getSingleResult();
        } catch (NoResultException ignore) {
        }

        return token;
    }

    @Override
    @Transactional
    public void removeTokenIfExists(String userMail) {
        String query = "DELETE FROM ResetPasswordToken t WHERE t.userEmail = :userMail";
        entityManager.createQuery(query)
                .setParameter("userMail", userMail)
                .executeUpdate();
    }
}
